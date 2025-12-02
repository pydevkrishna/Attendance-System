import { onAuthStateChangedHelper, getIdToken, doSignOut } from './auth.js';

const markAttendanceButton = document.getElementById('mark-attendance');
const logoutButton = document.getElementById('logout');
const studentEmailSpan = document.getElementById('student-email');
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

markAttendanceButton.addEventListener('click', () => {
    toggleSpinner(markAttendanceButton, true);
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        getIdToken().then(token => {
            fetch(`/student/mark-attendance?latitude=${latitude}&longitude=${longitude}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    showAlert('Attendance marked successfully!', 'success');
                } else {
                    showAlert(data.detail || 'Failed to mark attendance.');
                }
            })
            .catch(error => showAlert(error.message))
            .finally(() => toggleSpinner(markAttendanceButton, false));
        });
    }, error => {
        showAlert(`Geolocation error: ${error.message}`);
        toggleSpinner(markAttendanceButton, false);
    });
});

onAuthStateChangedHelper(user => {
    if (user) {
        studentEmailSpan.textContent = user.email;
    } else {
        window.location.href = 'index.html';
    }
});

logoutButton.addEventListener('click', () => {
    doSignOut().then(() => {
        window.location.href = 'index.html';
    });
});