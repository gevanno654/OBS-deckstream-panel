//Camera & Scene
document.addEventListener('DOMContentLoaded', function() {
    let obs = new OBSWebSocket();
    let isConnected = false;
    let cameraIds = {
        'Camera 1': null,
        'Camera 2': null,
        'Camera 3': null,
        'Camera 4': null
    };
    let sourceIds = {
        'Thumbnail': null,
        'Bumper': null,
        'Persembahan': null
    };

    // Attempt to connect to OBS
    obs.connect('ws://localhost:4444', '12345678').then(() => {
        isConnected = true;
        console.log('Connected to OBS');

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

        // Get the scene item IDs for the sources in Main Scene
        Object.keys(sourceIds).forEach(sourceName => {
            obs.call('GetSceneItemId', {
                sceneName: 'Main Scene',
                sourceName: sourceName
            }).then(response => {
                sourceIds[sourceName] = response.sceneItemId;
                console.log(`${sourceName} item ID:`, sourceIds[sourceName]);
            }).catch(err => {
                console.error(`Error getting ${sourceName} item ID:`, err);
            });
        });

    }).catch(err => {
        console.error('Error connecting to OBS:', err);
    });

    document.querySelector('#card-nx').addEventListener('click', () => toggleCameraVisibility('Camera 1'));
    document.querySelector('#card-presbiter').addEventListener('click', () => toggleCameraVisibility('Camera 2'));
    document.querySelector('#card-prokantor').addEventListener('click', () => toggleCameraVisibility('Camera 3'));
    document.querySelector('#card-pujian').addEventListener('click', () => toggleCameraVisibility('Camera 4'));

    document.querySelector('#card-thumbnail').addEventListener('click', () => toggleSourceVisibility('Thumbnail'));
    document.querySelector('#card-bumper').addEventListener('click', () => toggleSourceVisibility('Bumper'));
    document.querySelector('#card-persembahan').addEventListener('click', () => toggleSourceVisibility('Persembahan'));
    document.querySelector('#card-main').addEventListener('click', turnOffMainSceneSources);

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

    function turnOffMainSceneSources() {
        if (!isConnected) {
            console.error('Not connected to OBS');
            return;
        }

        ['Thumbnail', 'Bumper', 'Persembahan'].forEach(sourceName => {
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
});