let obs = null; // Global variable to hold the OBSWebSocket instance

// JavaScript to show the modal when the page loads
$(document).ready(function(){
    $('#loginModal').modal('show');

    // Check if there are saved credentials
    const savedAddressPort = localStorage.getItem('addressPort');
    const savedPassword = localStorage.getItem('password');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (rememberMe) {
        $('#addressPort').val(savedAddressPort);
        $('#password').val(savedPassword);
        $('#rememberMe').prop('checked', true);
    }
});

// Handle form submission
$('#loginForm').on('submit', function(event) {
    event.preventDefault();
    const addressPort = $('#addressPort').val();
    const password = $('#password').val();
    const rememberMe = $('#rememberMe').prop('checked');

    // Save credentials if rememberMe is checked
    if (rememberMe) {
        localStorage.setItem('addressPort', addressPort);
        localStorage.setItem('password', password);
        localStorage.setItem('rememberMe', true);
    } else {
        localStorage.removeItem('addressPort');
        localStorage.removeItem('password');
        localStorage.removeItem('rememberMe');
    }

    // Close any existing connection before attempting a new one
    if (obs) {
        obs.disconnect().then(() => {
            console.log('Disconnected from OBS');
            obs = null;
        });
    }

    // Attempt to connect to OBS
    obs = new OBSWebSocket();
    obs.connect(`ws://${addressPort}`, password).then(() => {
        console.log('Connected to OBS');
        $('#loginModal').modal('hide'); // Hide the modal after successful connection

        // Initialize camera, scene, and shortcut functionality
        initializeCameraSceneShortcut();
    }).catch(error => {
        console.error('Failed to connect to OBS:', error);
        alert('Failed to connect to OBS. Please check your credentials and try again.');
    });
});

// Show and hide password
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');

    togglePasswordButton.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    // Perform logout actions here, e.g., clear session, cookies, etc.
    console.log('Logged out');

    // Close the OBSWebSocket connection if it exists
    if (obs) {
        obs.disconnect().then(() => {
            console.log('Disconnected from OBS');
            obs = null;
        });
    }

    // Show the login modal
    var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
});

function initializeCameraSceneShortcut() {
    const datetimeElement = document.getElementById('datetime');
    const obsStatusElement = document.getElementById('obs-status');
    let isConnected = true;

    function updateDateTime() {
        const now = new Date();
        datetimeElement.textContent = now.toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();

    function updateOBSStatus() {
        Promise.all([
            obs.call('GetStreamStatus'),
            obs.call('GetRecordStatus')
        ]).then(([streamResponse, recordResponse]) => {
            let status = 'Status: Idle';
            if (streamResponse.outputActive && recordResponse.outputActive) {
                status = 'Status: Live & Record';
            } else if (streamResponse.outputActive) {
                status = 'Status: Live Streaming';
            } else if (recordResponse.outputActive) {
                status = 'Status: Recording';
            }
            obsStatusElement.textContent = status;
        }).catch(err => {
            console.error('Error getting stream or record status:', err);
        });
    }

    updateOBSStatus();
    setInterval(updateOBSStatus, 1000); // Update status every 5 seconds

    function updateOBSSourceText(text, sourceName) {
        if (!isConnected) {
            console.error('Not connected to OBS');
            return;
        }

        obs.call('SetInputSettings', {
            inputName: sourceName,
            inputSettings: {
                text: text
            }
        }).then(() => {
            console.log('Text updated in OBS source');
        }).catch(err => {
            console.error('Error updating text in OBS source:', err);
        });
    }

    function setupToggleSwitch(inputId, switchId, sourceName, switchClass) {
        const inputElement = document.getElementById(inputId);
        const switchElement = document.getElementById(switchId);

        // Load saved value from localStorage
        const savedValue = localStorage.getItem(inputId);
        if (savedValue) {
            inputElement.value = savedValue;
        }

        switchElement.addEventListener('change', function() {
            if (this.checked) {
                // Uncheck all other switches with the same class
                document.querySelectorAll(`.${switchClass}`).forEach(switchElem => {
                    if (switchElem.id !== switchId) {
                        switchElem.checked = false;
                    }
                });
                updateOBSSourceText(inputElement.value, sourceName);
            } else {
                updateOBSSourceText('', sourceName);
            }
            // Save value to localStorage
            localStorage.setItem(inputId, inputElement.value);
        });
    }

    // Setup all toggle switches for Presbiter
    for (let i = 1; i <= 7; i++) {
        setupToggleSwitch(`new-text-${i}`, `toggle-switch-${i}`, 'Presbiter', 'toggle-switch');
    }

    // Setup all toggle switches for Sesi
    for (let i = 1; i <= 25; i++) {
        setupToggleSwitch(`sesi-text-${i}`, `sesi-switch-${i}`, 'Sesi', 'toggle-switch-sesi');
    }

    // Setup all toggle switches for Musik
    for (let i = 1; i <= 15; i++) {
        setupToggleSwitch(`lagu-text-${i}`, `lagu-switch-${i}`, 'Musik', 'toggle-switch-lagu');
    }

    // Setup all toggle switches for Kesaksian
    for (let i = 1; i <= 3; i++) {
        setupToggleSwitch(`kesaksian-text-${i}`, `kesaksian-switch-${i}`, 'Kesaksian', 'toggle-switch-kesaksian');
    }
}