import { signUp, signIn } from './auth.js';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login');
const signupButton = document.getElementById('signup');
const roleSelection = document.getElementById('role-selection');
const roleInput = document.getElementById('role');
const submitRoleButton = document.getElementById('submit-role');
const cancelSignupButton = document.getElementById('cancel-signup');
const navigation = document.getElementById('navigation');
const loginContainer = document.getElementById('login-container');
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

loginButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    toggleSpinner(loginButton, true);
    signIn(email, password)
        .then(() => {
            loginContainer.style.display = 'none';
            navigation.style.display = 'block';
        })
        .catch(error => {
            showAlert(error.message);
        })
        .finally(() => {
            toggleSpinner(loginButton, false);
        });
});

signupButton.addEventListener('click', () => {
    roleSelection.style.display = 'block';
    loginContainer.style.display = 'none';
});

cancelSignupButton.addEventListener('click', () => {
    roleSelection.style.display = 'none';
    loginContainer.style.display = 'block';
});

submitRoleButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const role = roleInput.value;

    toggleSpinner(submitRoleButton, true);
    signUp(email, password, role)
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                roleSelection.style.display = 'none';
                navigation.style.display = 'block';
                showAlert('Sign up successful! Please log in.', 'success');
            } else {
                showAlert(data.detail);
            }
        })
        .catch(error => {
            showAlert(error.message);
        })
        .finally(() => {
            toggleSpinner(submitRoleButton, false);
            roleSelection.style.display = 'none';
            loginContainer.style.display = 'block';
        });
});