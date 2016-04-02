(function() {
    var deferredEvent;
    var installButton;

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            //.register('/swTest.js')
            .register('/service-worker.js')
            .then(function() {
                console.log('Service Worker Registered');
            });


        window.addEventListener("beforeinstallprompt", function(e) {
            installButton = document.getElementById('installButton');
            installButton.addEventListener("click", onInstall);
            e.preventDefault();
            console.log('install ?');
            deferredEvent = e;
            //Show button
            installButton.classList.add('show');
        });

        function onInstall() {
            if(deferredEvent !== undefined) {
                // The user has had a postive interaction with our app and Chrome
                // has tried to prompt previously, so let's show the prompt.
                deferredEvent.prompt();

                // Follow what the user has done with the prompt.
                deferredEvent.userChoice.then(function(choiceResult) {

                    console.log(choiceResult.outcome);

                    if(choiceResult.outcome == 'dismissed') {
                        console.log('User cancelled home screen install');
                    }
                    else {
                        console.log('User added to home screen');
                    }
                    installButton.classList.remove('show');
                    // We no longer need the prompt.  Clear it up.
                    deferredEvent = null;
                });
            }
        }
    }

})();

