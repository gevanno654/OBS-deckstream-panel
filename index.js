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

// Lower Third
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const addressPortInput = document.getElementById('addressPort');
    const passwordInput = document.getElementById('password');

    // Show the modal when the page loads
    modal.style.display = 'block';

    // Handle form submission
    loginForm.onsubmit = function(event) {
        event.preventDefault();
        const addressPort = addressPortInput.value;
        const password = passwordInput.value;

        connectToOBS(addressPort, password);
    };

    function connectToOBS(addressPort, password) {
        let obs = new OBSWebSocket();
        let isConnected = false;
        let lowerThirdId = null;
        let bgLtItemId = null;
        let ltMusikItemId = null;
        let sesiItemId = null;
        let presbiterItemId = null;
        let kesaksianItemId = null;

        const lowerThirdToggle = document.querySelector('#toggle-lower-third');
        const bgLtToggle = document.querySelector('#toggle-bg-lt');
        const ltMusikToggle = document.querySelector('#toggle-lt-musik');
        const sesiToggle = document.querySelector('#toggle-sesi');
        const presbiterToggle = document.querySelector('#toggle-presbiter');
        const kesaksianToggle = document.querySelector('#toggle-lt-kesaksian');

        // Attempt to connect to OBS
        obs.connect(`ws://${addressPort}`, password).then(() => {
            isConnected = true;
            console.log('Connected to OBS');
            modal.style.display = 'none'; // Hide the modal after successful connection

            // Get the scene item IDs
            Promise.all([
                obs.call('GetSceneItemId', {
                    sceneName: 'Main Scene',
                    sourceName: 'Lower Third'
                }).then(response => {
                    lowerThirdId = response.sceneItemId;
                    return obs.call('GetSceneItemEnabled', {
                        sceneName: 'Main Scene',
                        sceneItemId: lowerThirdId
                    }).then(response => {
                        lowerThirdToggle.checked = response.sceneItemEnabled;
                    });
                }),

                obs.call('GetSceneItemId', {
                    sceneName: 'Lower Third',
                    sourceName: 'BG LT'
                }).then(response => {
                    bgLtItemId = response.sceneItemId;
                    return obs.call('GetSceneItemEnabled', {
                        sceneName: 'Lower Third',
                        sceneItemId: bgLtItemId
                    }).then(response => {
                        bgLtToggle.checked = response.sceneItemEnabled;
                    });
                }),

                obs.call('GetSceneItemId', {
                    sceneName: 'Lower Third',
                    sourceName: 'Musik'
                }).then(response => {
                    ltMusikItemId = response.sceneItemId;
                    return obs.call('GetSceneItemEnabled', {
                        sceneName: 'Lower Third',
                        sceneItemId: ltMusikItemId
                    }).then(response => {
                        ltMusikToggle.checked = response.sceneItemEnabled;
                    });
                }),

                obs.call('GetSceneItemId', {
                    sceneName: 'Lower Third',
                    sourceName: 'Sesi'
                }).then(response => {
                    sesiItemId = response.sceneItemId;
                    return obs.call('GetSceneItemEnabled', {
                        sceneName: 'Lower Third',
                        sceneItemId: sesiItemId
                    }).then(response => {
                        sesiToggle.checked = response.sceneItemEnabled;
                    });
                }),

                obs.call('GetSceneItemId', {
                    sceneName: 'Lower Third',
                    sourceName: 'Presbiter'
                }).then(response => {
                    presbiterItemId = response.sceneItemId;
                    return obs.call('GetSceneItemEnabled', {
                        sceneName: 'Lower Third',
                        sceneItemId: presbiterItemId
                    }).then(response => {
                        presbiterToggle.checked = response.sceneItemEnabled;
                    });
                }),

                obs.call('GetSceneItemId', {
                    sceneName: 'Main Scene',
                    sourceName: 'Title'
                }).then(response => {
                    kesaksianItemId = response.sceneItemId;
                    return obs.call('GetSceneItemEnabled', {
                        sceneName: 'Main Scene',
                        sceneItemId: kesaksianItemId
                    }).then(response => {
                        kesaksianToggle.checked = response.sceneItemEnabled;
                    });
                })
            ]).catch(err => {
                console.error('Error getting item IDs or visibility:', err);
            });
        }).catch(err => {
            console.error('Error connecting to OBS:', err);
        });

        // Add event listeners to toggle switches
        lowerThirdToggle.addEventListener('change', () => {
            const isLowerThirdVisible = lowerThirdToggle.checked;
            localStorage.setItem('toggle-lower-third', isLowerThirdVisible);

            if (!isConnected || lowerThirdId === null || bgLtItemId === null || sesiItemId === null || presbiterItemId === null) {
                console.error('Not connected to OBS or item IDs not found');
                return;
            }

            obs.call('SetSceneItemEnabled', {
                sceneName: 'Main Scene',
                sceneItemId: lowerThirdId,
                sceneItemEnabled: isLowerThirdVisible
            }).then(() => {
                bgLtToggle.checked = isLowerThirdVisible;
                sesiToggle.checked = isLowerThirdVisible;
                presbiterToggle.checked = isLowerThirdVisible;

                if (isLowerThirdVisible) {
                    obs.call('SetSceneItemEnabled', {
                        sceneName: 'Lower Third',
                        sceneItemId: bgLtItemId,
                        sceneItemEnabled: isLowerThirdVisible
                    }).then(() => {
                        setTimeout(() => {
                            obs.call('SetSceneItemEnabled', {
                                sceneName: 'Lower Third',
                                sceneItemId: sesiItemId,
                                sceneItemEnabled: isLowerThirdVisible
                            });
                        }, 400);

                        setTimeout(() => {
                            obs.call('SetSceneItemEnabled', {
                                sceneName: 'Lower Third',
                                sceneItemId: presbiterItemId,
                                sceneItemEnabled: isLowerThirdVisible
                            });
                        }, 400);
                    });
                } else {
                    setTimeout(() => {
                        obs.call('SetSceneItemEnabled', {
                            sceneName: 'Lower Third',
                            sceneItemId: sesiItemId,
                            sceneItemEnabled: isLowerThirdVisible
                        });
                    }, 500);
                    setTimeout(() => {
                        obs.call('SetSceneItemEnabled', {
                            sceneName: 'Lower Third',
                            sceneItemId: presbiterItemId,
                            sceneItemEnabled: isLowerThirdVisible
                        });
                    }, 500);
                    setTimeout(() => {
                        obs.call('SetSceneItemEnabled', {
                            sceneName: 'Lower Third',
                            sceneItemId: bgLtItemId,
                            sceneItemEnabled: isLowerThirdVisible
                        });
                    }, 500);
                }

                // Turn off ltMusik if lowerThird is off
                if (!isLowerThirdVisible) {
                    ltMusikToggle.checked = false;
                    localStorage.setItem('toggle-lt-musik', false);

                    obs.call('SetSceneItemEnabled', {
                        sceneName: 'Lower Third',
                        sceneItemId: ltMusikItemId,
                        sceneItemEnabled: false
                    });
                }
            }).catch(err => {
                console.error('Error toggling Lower Third:', err);
            });
        });

        bgLtToggle.addEventListener('change', () => {
            const isBgLtVisible = bgLtToggle.checked;
            localStorage.setItem('toggle-bg-lt', isBgLtVisible);

            if (!isConnected || bgLtItemId === null || sesiItemId === null || presbiterItemId === null) {
                console.error('Not connected to OBS or item IDs not found');
                return;
            }

            obs.call('SetSceneItemEnabled', {
                sceneName: 'Lower Third',
                sceneItemId: bgLtItemId,
                sceneItemEnabled: isBgLtVisible
            }).then(() => {
                sesiToggle.checked = isBgLtVisible;
                presbiterToggle.checked = isBgLtVisible;

                obs.call('SetSceneItemEnabled', {
                    sceneName: 'Lower Third',
                    sceneItemId: sesiItemId,
                    sceneItemEnabled: isBgLtVisible
                });

                obs.call('SetSceneItemEnabled', {
                    sceneName: 'Lower Third',
                    sceneItemId: presbiterItemId,
                    sceneItemEnabled: isBgLtVisible
                });

                // Turn off ltMusik if bgLt is off
                if (!isBgLtVisible) {
                    ltMusikToggle.checked = false;
                    localStorage.setItem('toggle-lt-musik', false);

                    obs.call('SetSceneItemEnabled', {
                        sceneName: 'Lower Third',
                        sceneItemId: ltMusikItemId,
                        sceneItemEnabled: false
                    });
                }
            }).catch(err => {
                console.error('Error toggling BG LT:', err);
            });
        });

        ltMusikToggle.addEventListener('change', () => {
            const isLtMusikVisible = ltMusikToggle.checked;
            localStorage.setItem('toggle-lt-musik', isLtMusikVisible);
        
            if (!isConnected || ltMusikItemId === null || lowerThirdId === null || bgLtItemId === null || sesiItemId === null || presbiterItemId === null) {
                console.error('Not connected to OBS or item IDs not found');
                return;
            }
        
            if (isLtMusikVisible) {
                obs.call('GetSceneItemEnabled', {
                    sceneName: 'Main Scene',
                    sceneItemId: lowerThirdId
                }).then(response => {
                    const isLowerThirdVisible = response.sceneItemEnabled;
        
                    obs.call('GetSceneItemEnabled', {
                        sceneName: 'Lower Third',
                        sceneItemId: bgLtItemId
                    }).then(response => {
                        const isBgLtVisible = response.sceneItemEnabled;
        
                        if (!isLowerThirdVisible) {
                            // Turn on lowerThird
                            lowerThirdToggle.checked = true;
                            obs.call('SetSceneItemEnabled', {
                                sceneName: 'Main Scene',
                                sceneItemId: lowerThirdId,
                                sceneItemEnabled: true
                            });
                        }
        
                        if (!isBgLtVisible) {
                            // Turn on bgLt
                            bgLtToggle.checked = true;
                            obs.call('SetSceneItemEnabled', {
                                sceneName: 'Lower Third',
                                sceneItemId: bgLtItemId,
                                sceneItemEnabled: true
                            });
                        }
        
                        // Turn off sesi and presbiter
                        sesiToggle.checked = false;
                        presbiterToggle.checked = false;
        
                        obs.call('SetSceneItemEnabled', {
                            sceneName: 'Lower Third',
                            sceneItemId: sesiItemId,
                            sceneItemEnabled: false
                        });
        
                        obs.call('SetSceneItemEnabled', {
                            sceneName: 'Lower Third',
                            sceneItemId: presbiterItemId,
                            sceneItemEnabled: false
                        });
        
                        // Delay the Musik source toggle
                        setTimeout(() => {
                            obs.call('SetSceneItemEnabled', {
                                sceneName: 'Lower Third',
                                sceneItemId: ltMusikItemId,
                                sceneItemEnabled: isLtMusikVisible
                            });
                        }, 500);
                    });
                })
            } else {
                obs.call('SetSceneItemEnabled', {
                    sceneName: 'Lower Third',
                    sceneItemId: ltMusikItemId,
                    sceneItemEnabled: isLtMusikVisible
                })
            }
        });

        sesiToggle.addEventListener('change', () => {
            const isSesiVisible = sesiToggle.checked;
            localStorage.setItem('toggle-sesi', isSesiVisible);
        
            if (!isConnected || sesiItemId === null || presbiterItemId === null || bgLtItemId === null || ltMusikItemId === null) {
                console.error('Not connected to OBS or item IDs not found');
                return;
            }
        
            if (isSesiVisible) {
                // Turn on bgLt if it is off
                if (!bgLtToggle.checked) {
                    bgLtToggle.checked = true;
                    localStorage.setItem('toggle-bg-lt', true);
        
                    obs.call('SetSceneItemEnabled', {
                        sceneName: 'Lower Third',
                        sceneItemId: bgLtItemId,
                        sceneItemEnabled: true
                    }).then(() => {
        
                        // Delay the Sesi and Presbiter source toggle
                        setTimeout(() => {
                            obs.call('SetSceneItemEnabled', {
                                sceneName: 'Lower Third',
                                sceneItemId: sesiItemId,
                                sceneItemEnabled: isSesiVisible
                            });
        
                            presbiterToggle.checked = true;
                            localStorage.setItem('toggle-presbiter', true);
        
                            obs.call('SetSceneItemEnabled', {
                                sceneName: 'Lower Third',
                                sceneItemId: presbiterItemId,
                                sceneItemEnabled: true
                            });
                        }, 300);
                    });
                } else {
                    // Delay the Sesi and Presbiter source toggle
                    setTimeout(() => {
                        obs.call('SetSceneItemEnabled', {
                            sceneName: 'Lower Third',
                            sceneItemId: sesiItemId,
                            sceneItemEnabled: isSesiVisible
                        });

                        presbiterToggle.checked = true;
                        localStorage.setItem('toggle-presbiter', true);

                        obs.call('SetSceneItemEnabled', {
                            sceneName: 'Lower Third',
                            sceneItemId: presbiterItemId,
                            sceneItemEnabled: true
                        });
                    }, 10);
                }

                // Turn off ltMusik if sesi is on
                if (ltMusikToggle.checked) {
                    ltMusikToggle.checked = false;
                    localStorage.setItem('toggle-lt-musik', false);

                    obs.call('SetSceneItemEnabled', {
                        sceneName: 'Lower Third',
                        sceneItemId: ltMusikItemId,
                        sceneItemEnabled: false
                    });
                }
            } else {
                obs.call('SetSceneItemEnabled', {
                    sceneName: 'Lower Third',
                    sceneItemId: sesiItemId,
                    sceneItemEnabled: isSesiVisible
                });
            }
        });

        presbiterToggle.addEventListener('change', () => {
            const isPresbiterVisible = presbiterToggle.checked;
        
            if (!isConnected || presbiterItemId === null || bgLtItemId === null) {
                console.error('Not connected to OBS or item IDs not found');
                return;
            }
        
            if (ltMusikToggle.checked) {
                console.log('Cannot toggle Presbiter when LT Musik is active');
                presbiterToggle.checked = false; // Reset the toggle state
                return;
            }
        
            localStorage.setItem('toggle-presbiter', isPresbiterVisible);
        
            if (isPresbiterVisible) {
                // Turn on bgLt if it is off
                if (!bgLtToggle.checked) {
                    bgLtToggle.checked = true;
                    localStorage.setItem('toggle-bg-lt', true);
        
                    obs.call('SetSceneItemEnabled', {
                        sceneName: 'Lower Third',
                        sceneItemId: bgLtItemId,
                        sceneItemEnabled: true
                    }).then(() => {
        
                        // Delay the Presbiter source toggle
                        setTimeout(() => {
                            obs.call('SetSceneItemEnabled', {
                                sceneName: 'Lower Third',
                                sceneItemId: presbiterItemId,
                                sceneItemEnabled: isPresbiterVisible
                            });
                        }, 300);
                    }).catch(err => {
                        console.error('Error toggling BG LT:', err);
                    });
                } else {
                    // Delay the Presbiter source toggle
                    setTimeout(() => {
                        obs.call('SetSceneItemEnabled', {
                            sceneName: 'Lower Third',
                            sceneItemId: presbiterItemId,
                            sceneItemEnabled: isPresbiterVisible
                        });
                    }, 10);
                }
            } else {
                obs.call('SetSceneItemEnabled', {
                    sceneName: 'Lower Third',
                    sceneItemId: presbiterItemId,
                    sceneItemEnabled: isPresbiterVisible
                });
            }
        });

        kesaksianToggle.addEventListener('change', () => {
            const isKesaksianVisible = kesaksianToggle.checked;
            localStorage.setItem('toggle-lt-kesaksian', isKesaksianVisible);

            if (!isConnected || kesaksianItemId === null) {
                console.error('Not connected to OBS or item IDs not found');
                return;
            }

            obs.call('SetSceneItemEnabled', {
                sceneName: 'Main Scene',
                sceneItemId: kesaksianItemId,
                sceneItemEnabled: isKesaksianVisible
            }).catch(err => {
                console.error('Error toggling Kesaksian:', err);
            });
        });
    }
});

//Camera, Scene, Shortcut
function initializeCameraSceneShortcut() {
    const datetimeElement = document.getElementById('datetime');
    const obsStatusElement = document.getElementById('obs-status');
    let isConnected = true;
    let cameraIds = {
        'Camera 1': null,
        'Camera 2': null,
        'Camera 3': null,
        'Camera 4': null
    };
    let sourceIds = {
        'Thumbnail': null,
        'Bumper': null,
        'Persembahan': null,
        'WARTA LISAN': null,
        'VIDEO1': null,
        'Video': null // Added for the new "Video" source in "Main Scene"
    };

    // Get the scene item IDs for the camera sources in Camera scene
    Object.keys(cameraIds).forEach(cameraName => {
        obs.call('GetSceneItemId', {
            sceneName: 'Camera',
            sourceName: cameraName
        }).then(response => {
            cameraIds[cameraName] = response.sceneItemId;
            console.log(`${cameraName} item ID:`, cameraIds[cameraName]);
        }).catch(err => {
            console.error(`Error getting ${cameraName} item ID:`, err);
        });
    });

    // Get the scene item IDs for the sources in Main Scene and Video Scene
    Object.keys(sourceIds).forEach(sourceName => {
        obs.call('GetSceneItemId', {
            sceneName: sourceName === 'WARTA LISAN' || sourceName === 'VIDEO1' ? 'Video' : 'Main Scene',
            sourceName: sourceName
        }).then(response => {
            sourceIds[sourceName] = response.sceneItemId;
            console.log(`${sourceName} item ID:`, sourceIds[sourceName]);
        }).catch(err => {
            console.error(`Error getting ${sourceName} item ID:`, err);
        });
    });

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
    setInterval(updateOBSStatus, 1000); // Update status every second

    document.querySelector('#card-nx').addEventListener('click', () => toggleCameraVisibility('Camera 1'));
    document.querySelector('#card-presbiter').addEventListener('click', () => toggleCameraVisibility('Camera 2'));
    document.querySelector('#card-prokantor').addEventListener('click', () => toggleCameraVisibility('Camera 3'));
    document.querySelector('#card-pujian').addEventListener('click', () => toggleCameraVisibility('Camera 4'));

    document.querySelector('#card-thumbnail').addEventListener('click', () => toggleSourceVisibility('Thumbnail'));
    document.querySelector('#card-bumper').addEventListener('click', () => toggleSourceVisibility('Bumper'));
    document.querySelector('#card-persembahan').addEventListener('click', () => toggleSourceVisibility('Persembahan'));
    document.querySelector('#card-main').addEventListener('click', turnOffMainSceneSources);

    document.querySelector('#card-warta').addEventListener('click', () => toggleVideoSourceVisibility('WARTA LISAN'));
    document.querySelector('#card-video1').addEventListener('click', () => toggleVideoSourceVisibility('VIDEO1'));

    function toggleCameraVisibility(cameraName) {
        if (!isConnected || cameraIds[cameraName] === null) {
            console.error('Not connected to OBS or camera item ID not found');
            return;
        }

        obs.call('GetSceneItemEnabled', {
            sceneName: 'Camera',
            sceneItemId: cameraIds[cameraName]
        }).then(response => {
            const isVisible = response.sceneItemEnabled;

            // If the camera is currently visible, hide it
            if (isVisible) {
                obs.call('SetSceneItemEnabled', {
                    sceneName: 'Camera',
                    sceneItemId: cameraIds[cameraName],
                    sceneItemEnabled: false
                }).then(() => {
                    console.log(`${cameraName} turned off`);
                }).catch(err => {
                    console.error(`Error turning off ${cameraName}:`, err);
                });
            } else {
                // First, turn off all cameras
                Object.keys(cameraIds).forEach(name => {
                    if (name !== cameraName && cameraIds[name] !== null) {
                        obs.call('SetSceneItemEnabled', {
                            sceneName: 'Camera',
                            sceneItemId: cameraIds[name],
                            sceneItemEnabled: false
                        }).catch(err => {
                            console.error(`Error turning off ${name}:`, err);
                        });
                    }
                });

                // Then, turn on the selected camera
                obs.call('SetSceneItemEnabled', {
                    sceneName: 'Camera',
                    sceneItemId: cameraIds[cameraName],
                    sceneItemEnabled: true
                }).then(() => {
                    console.log(`${cameraName} turned on`);
                }).catch(err => {
                    console.error(`Error turning on ${cameraName}:`, err);
                });
            }
        }).catch(err => {
            console.error(`Error getting ${cameraName} visibility:`, err);
        });
    }

    function toggleSourceVisibility(sourceName) {
        if (!isConnected || sourceIds[sourceName] === null) {
            console.error('Not connected to OBS or source item ID not found');
            return;
        }

        obs.call('GetSceneItemEnabled', {
            sceneName: 'Main Scene',
            sceneItemId: sourceIds[sourceName]
        }).then(response => {
            const isVisible = response.sceneItemEnabled;

            // If the source is currently visible, hide it
            if (isVisible) {
                obs.call('SetSceneItemEnabled', {
                    sceneName: 'Main Scene',
                    sceneItemId: sourceIds[sourceName],
                    sceneItemEnabled: false
                }).then(() => {
                    console.log(`${sourceName} turned off`);
                }).catch(err => {
                    console.error(`Error turning off ${sourceName}:`, err);
                });
            } else {
                // First, turn off all sources
                Object.keys(sourceIds).forEach(name => {
                    if (name !== sourceName && sourceIds[name] !== null) {
                        obs.call('SetSceneItemEnabled', {
                            sceneName: 'Main Scene',
                            sceneItemId: sourceIds[name],
                            sceneItemEnabled: false
                        }).catch(err => {
                            console.error(`Error turning off ${name}:`, err);
                        });
                    }
                });

                // Then, turn on the selected source
                obs.call('SetSceneItemEnabled', {
                    sceneName: 'Main Scene',
                    sceneItemId: sourceIds[sourceName],
                    sceneItemEnabled: true
                }).then(() => {
                    console.log(`${sourceName} turned on`);
                }).catch(err => {
                    console.error(`Error turning on ${sourceName}:`, err);
                });
            }
        }).catch(err => {
            console.error(`Error getting ${sourceName} visibility:`, err);
        });
    }

    function toggleVideoSourceVisibility(sourceName) {
        if (!isConnected || sourceIds[sourceName] === null || sourceIds['Video'] === null) {
            console.error('Not connected to OBS or source item ID not found');
            return;
        }

        obs.call('GetSceneItemEnabled', {
            sceneName: 'Video',
            sceneItemId: sourceIds[sourceName]
        }).then(response => {
            const isVisible = response.sceneItemEnabled;

            // Toggle the "Video" source in "Main Scene"
            obs.call('GetSceneItemEnabled', {
                sceneName: 'Main Scene',
                sceneItemId: sourceIds['Video']
            }).then(videoResponse => {
                const isVideoVisible = videoResponse.sceneItemEnabled;

                // If the source is currently visible, hide it
                if (isVisible) {
                    obs.call('SetSceneItemEnabled', {
                        sceneName: 'Video',
                        sceneItemId: sourceIds[sourceName],
                        sceneItemEnabled: false
                    }).then(() => {
                        console.log(`${sourceName} turned off`);
                        if (isVideoVisible) {
                            obs.call('SetSceneItemEnabled', {
                                sceneName: 'Main Scene',
                                sceneItemId: sourceIds['Video'],
                                sceneItemEnabled: false
                            }).then(() => {
                                console.log('Video turned off');
                            }).catch(err => {
                                console.error('Error turning off Video:', err);
                            });
                        }
                    }).catch(err => {
                        console.error(`Error turning off ${sourceName}:`, err);
                    });
                } else {
                    // First, turn off all sources in the same scene
                    Object.keys(sourceIds).forEach(name => {
                        if (name === 'WARTA LISAN' || name === 'VIDEO1') {
                            if (name !== sourceName && sourceIds[name] !== null) {
                                obs.call('SetSceneItemEnabled', {
                                    sceneName: 'Video',
                                    sceneItemId: sourceIds[name],
                                    sceneItemEnabled: false
                                }).catch(err => {
                                    console.error(`Error turning off ${name}:`, err);
                                });
                            }
                        }
                    });

                    // Then, turn on the selected source
                    obs.call('SetSceneItemEnabled', {
                        sceneName: 'Video',
                        sceneItemId: sourceIds[sourceName],
                        sceneItemEnabled: true
                    }).then(() => {
                        console.log(`${sourceName} turned on`);
                        if (!isVideoVisible) {
                            obs.call('SetSceneItemEnabled', {
                                sceneName: 'Main Scene',
                                sceneItemId: sourceIds['Video'],
                                sceneItemEnabled: true
                            }).then(() => {
                                console.log('Video turned on');
                            }).catch(err => {
                                console.error('Error turning on Video:', err);
                            });
                        }
                    }).catch(err => {
                        console.error(`Error turning on ${sourceName}:`, err);
                    });
                }
            }).catch(err => {
                console.error('Error getting Video visibility:', err);
            });
        }).catch(err => {
            console.error(`Error getting ${sourceName} visibility:`, err);
        });
    }

    function turnOffMainSceneSources() {
        if (!isConnected) {
            console.error('Not connected to OBS');
            return;
        }

        ['Thumbnail', 'Bumper', 'Persembahan', 'Video'].forEach(sourceName => {
            if (sourceIds[sourceName] !== null) {
                obs.call('SetSceneItemEnabled', {
                    sceneName: 'Main Scene',
                    sceneItemId: sourceIds[sourceName],
                    sceneItemEnabled: false
                }).then(() => {
                    console.log(`${sourceName} turned off`);
                }).catch(err => {
                    console.error(`Error turning off ${sourceName}:`, err);
                });
            }
        });
    }

    // Shortcut
    var mainModal = new bootstrap.Modal(document.getElementById('shortcutModal'));
    var selectionModal = new bootstrap.Modal(document.getElementById('shortcutSelectionModal'));
    var saveBtn = document.getElementById('saveShortcuts');

    document.getElementById('openModalBtn').addEventListener('click', function() {
        loadShortcuts();
        mainModal.show();
    });

    document.querySelectorAll('#shortcutForm input[type="text"]').forEach(input => {
        input.addEventListener('click', function() {
            selectionModal.show();
            selectionModal._element.setAttribute('data-target', this.id);
        });
    });

    document.querySelectorAll('.shortcutOption').forEach(option => {
        option.addEventListener('click', function() {
            var targetId = selectionModal._element.getAttribute('data-target');
            var targetInput = document.getElementById(targetId);
            targetInput.value = this.getAttribute('data-key');
            selectionModal.hide();
        });
    });

    saveBtn.addEventListener('click', function() {
        const shortcuts = {
            'card-nx': document.getElementById('card-nx-shortcut').value,
            'card-presbiter': document.getElementById('card-presbiter-shortcut').value,
            'card-prokantor': document.getElementById('card-prokantor-shortcut').value,
            'card-pujian': document.getElementById('card-pujian-shortcut').value,
            'toggle-lower-third': document.getElementById('toggle-lower-third-shortcut').value,
            'toggle-bg-lt': document.getElementById('toggle-bg-lt-shortcut').value
        };

        localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
        applyShortcuts(shortcuts);
        mainModal.hide();
        location.reload();
    });

    function loadShortcuts() {
        const shortcuts = JSON.parse(localStorage.getItem('shortcuts'));
        if (shortcuts) {
            document.getElementById('card-nx-shortcut').value = shortcuts['card-nx'] || '';
            document.getElementById('card-presbiter-shortcut').value = shortcuts['card-presbiter'] || '';
            document.getElementById('card-prokantor-shortcut').value = shortcuts['card-prokantor'] || '';
            document.getElementById('card-pujian-shortcut').value = shortcuts['card-pujian'] || '';
            document.getElementById('toggle-lower-third-shortcut').value = shortcuts['toggle-lower-third'] || '';
            document.getElementById('toggle-bg-lt-shortcut').value = shortcuts['toggle-bg-lt'] || '';
        }
    }

    function applyShortcuts(shortcuts) {
        document.addEventListener('keydown', function(event) {
            for (const [action, key] of Object.entries(shortcuts)) {
                if (key === 'Ctrl+Shift' && event.ctrlKey && event.shiftKey) {
                    performAction(action);
                } else if (key === 'Ctrl+Shift+Z' && event.ctrlKey && event.shiftKey && event.key === 'Z') {
                    performAction(action);
                } else if (key === 'Ctrl+Shift+X' && event.ctrlKey && event.shiftKey && event.key === 'X') {
                    performAction(action);
                } else if (key === 'Ctrl+Shift+C' && event.ctrlKey && event.shiftKey && event.key === 'C') {
                    performAction(action);
                } else if (key === 'Ctrl+Alt' && event.ctrlKey && event.altKey) {
                    performAction(action);
                } else if (key === 'Numpad1' && event.code === 'Numpad1') {
                    performAction(action);
                } else if (key === 'Numpad2' && event.code === 'Numpad2') {
                    performAction(action);
                } else if (key === 'Numpad3' && event.code === 'Numpad3') {
                    performAction(action);
                } else if (key === 'Numpad4' && event.code === 'Numpad4') {
                    performAction(action);
                } else if (key === 'Numpad5' && event.code === 'Numpad5') {
                    performAction(action);
                } else if (key === 'Numpad6' && event.code === 'Numpad6') {
                    performAction(action);
                } else if (key === 'F1' && event.code === 'F1') {
                    performAction(action);
                } else if (key === 'F2' && event.code === 'F2') {
                    performAction(action);
                } else if (key === 'F3' && event.code === 'F3') {
                    performAction(action);
                } else if (key === 'F4' && event.code === 'F4') {
                    performAction(action);
                } else if (key === 'F5' && event.code === 'F5') {
                    performAction(action);
                }
            }
        });
    }

    function performAction(action) {
        if (action.startsWith('card-')) {
            document.getElementById(action).click();
        } else if (action.startsWith('toggle-')) {
            document.getElementById(action).click();
        }
    }

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

    // Load shortcuts on page load
    loadShortcuts();
    applyShortcuts(JSON.parse(localStorage.getItem('shortcuts')) || {});
}