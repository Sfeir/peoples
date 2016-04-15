(function() {
    var deferredEvent;
    var installButton;
    var subscribeButton;
    var reg;
    var sub;
    var isSubscribed = false;


    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
      //.register('/swTest.js')
        .register('service-worker.js')
        .then(function(swreg) {
            console.log('Service Worker Registered');
            reg = swreg;

            //Check if user already subscribed
            reg.pushManager.getSubscription()
                .then(function(pushSubscription) {
                    if(pushSubscription){
                        sub = pushSubscription;
                        console.log('Subscribed! Endpoint:', sub.endpoint);
                        subscribeButton.classList.add('subscribe');
                        isSubscribed = true;
                    }
                    else{
                        subscribeButton.classList.remove('subscribe');
                        isSubscribed = false;
                    }
                    subscribeButton.classList.add('show');
                });


        /*

         TO SEND NOTIFICATIONS
           curl --header "Authorization: key=your_api_key" \
           --header Content-Type:"application/json" \
           https://gcm-http.googleapis.com/gcm/send \
           -d "{\"registration_ids\":[\"XXXXX\"]}"

         where XXXX is the id endpoint
         */

      });
    subscribeButton = document.getElementById('subscribeButton');
    installButton = document.getElementById('installButton');

    installButton.addEventListener("click", onInstall);

    subscribeButton.addEventListener("click", function (e) {
      if (isSubscribed) {
        unsubscribe();
      } else {
        subscribe();
      }
    });

    function subscribe() {
      reg.pushManager.subscribe({userVisibleOnly: true})
        .then(function(pushSubscription){
          sub = pushSubscription;
          console.log('Subscribed! Endpoint:', sub.endpoint);
          subscribeButton.classList.add('subscribe');
          isSubscribed = true;
        });
    }

    function unsubscribe() {
      sub.unsubscribe().then(function(event) {
        subscribeButton.classList.remove('subscribe');
        console.log('Unsubscribed!', event);
        isSubscribed = false;
      }).catch(function(error) {
        console.log('Error unsubscribing', error);
        subscribeButton.classList.remove('subscribe');
      });
    }

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      console.log('install ?');
      deferredEvent = e;
      //Show button
      installButton.classList.add('show');
    });

    function onInstall() {
      if (deferredEvent !== undefined) {
        // The user has had a postive interaction with our app and Chrome
        // has tried to prompt previously, so let's show the prompt.
        deferredEvent.prompt();

        // Follow what the user has done with the prompt.
        deferredEvent.userChoice.then(function (choiceResult) {

          console.log(choiceResult.outcome);

          if (choiceResult.outcome == 'dismissed') {
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
