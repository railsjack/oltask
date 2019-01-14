$(function () {

    function LocationChange(url, provider) {
        console.log("in location change");
        url = decodeURIComponent(url);
        console.log("Checking location: " + url);

        jso_checkfortoken(provider, url, function () {
            console.log("Closing InAppBrowser, because a valid response was detected.");
            inAppBrowserRef.close();
        });
    };

    var fbButton = document.getElementById("fbButton");

    fbButton.addEventListener("click", function () {
        /*
         * Register a handler that detects redirects and
         * lets JSO to detect incomming OAuth responses and deal with the content.
        */
        jso_registerRedirectHandler(function (url) {
            window.$windowScope = window.auth;
            inAppBrowserRef = window.open(url, "_blank");
            inAppBrowserRef.addEventListener('loadstop', function (e) { LocationChange(e.url, 'facebook') }, false);
        });

        /*
        * Configura oauth do facebook
        */
        jso_configure({
            "facebook": {
                client_id: "687687548024294",
                redirect_uri: "http://consvita.w06.wh-2.com/sociallogin/authcomplete2.html",
                authorization: "https://www.facebook.com/dialog/oauth",
                presenttoken: "qs"
            }
        }, { "debug": true });

        /*
        *  Mostra a lista de tokens salvos no console se o debuf estiver ativado;
        */
        jso_dump();

        /*
        *  Busca o token do facebook;
        */
        $.oajax({
            url: "https://graph.facebook.com/me",
            jso_provider: "facebook",
            jso_scopes: ["user_about_me", "email"],
            jso_allowia: true,
            dataType: 'json',
            success: function (response) {
                //alert(JSON.stringify(response));
                externalLogin(jso_getToken("facebook", ["user_about_me", "email"]), "Facebook", response);
            }
        });

    });

    var googleButton = document.getElementById("googleButton");

    googleButton.addEventListener("click", function () {
        /*
         * Register a handler that detects redirects and
         * lets JSO to detect incomming OAuth responses and deal with the content.
        */
        jso_registerRedirectHandler(function (url) {
            window.$windowScope = window.auth;
            inAppBrowserRef = window.open(url, "_blank");
            inAppBrowserRef.addEventListener('loadstop', function (e) { LocationChange(e.url, 'google') }, false);
        });

        /*
        * Configura oauth do google
        */
        jso_configure({
            "google": {
                client_id: "935227833100-moj5b1tr5187tekfng1k7oseqhnm7vk9.apps.googleusercontent.com",
                client_secret: 'ZrIkMiPyL98-NzjvvGcvZ8gv',
                redirect_uri: "http://www.facebook.com/connect/login_success.html",
                authorization: "https://accounts.google.com/o/oauth2/auth",
                scopes: { request: ["https://www.googleapis.com/auth/userinfo.profile"] }
            }
        }, { "debug": true });

        /*
        *  Mostra a lista de tokens salvos no console se o debuf estiver ativado;
        */
        jso_dump();

        /*
        *  Busca o token do google;
        */
        $.oajax({
            url: "https://www.googleapis.com/oauth2/v1/userinfo",
            jso_provider: "google",
            jso_scopes: ["https://www.googleapis.com/auth/userinfo.email"],
            jso_allowia: true,
            dataType: 'json',
            success: function (data) {
                externalLogin(jso_getToken("google", ["https://www.googleapis.com/auth/userinfo.email"]), "Google");
            }
        });
    });

});
    