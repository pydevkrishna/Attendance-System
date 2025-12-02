import { onAuthStateChangedHelper, getIdToken, doSignOut } from './auth.js';

const setLocationButton = document.getElementById('set-location');
const studentsTableBody = document.getElementById('students-table-body');
const logoutButton = document.getElementById('logout');
const refreshListButton = document.getElementById('refresh-list');
const alertContainer = document.getElementById('alert-container');

function showAlert(message, type = 'danger') {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    alertContainer.append(wrapper);
}

function toggleSpinner(button, show) {
    const spinner = button.querySelector('.spinner-border');
    if (show) {
        spinner.style.display = 'inline-block';
        button.disabled = true;
    } else {
        spinner.style.display = 'none';
        button.disabled = false;
    }
}

function fetchAttendance() {
    getIdToken().then(token => {
        fetch('/teacher/attendance', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch attendance.');
            }
            return response.json();
        })
        .then(data => {
            studentsTableBody.innerHTML = '';
            if (data.length === 0) {
                studentsTableBody.innerHTML = '<tr><td colspan="3" class="text-center">No attendance records yet.</td></tr>';
                return;
            }
            data.forEach((record, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${record.student_id}</td>
                    <td>${new Date(record.timestamp).toLocaleString()}</td>
                `;
                studentsTableBody.appendChild(row);
            });
        })
        .catch(error => {
            showAlert(error.message);
        });
    });
}

setLocationButton.addEventListener('click', () => {
    toggleSpinner(setLocationButton, true);
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        getIdToken().then(token => {
            fetch('/teacher/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ latitude, longitude })
            })
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    showAlert('Location set successfully!', 'success');
                } else {
                    showAlert(data.detail || 'Failed to set location.');
                }
            })
            .catch(error => showAlert(error.message))
            .finally(() => toggleSpinner(setLocationButton, false));
        });
    }, error => {
        showAlert(`Geolocation error: ${error.message}`);
        toggleSpinner(setLocationButton, false);
    });
});

refreshListButton.addEventListener('click', fetchAttendance);

onAuthStateChangedHelper(user => {
    if (user) {
        fetchAttendance();
    } else {
        window.location.href = 'index.html';
    }
});

logoutButton.addEventListener('click', () => {
    doSignOut().then(() => {
        window.location.href = 'index.html';
    });
});