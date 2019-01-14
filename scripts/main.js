(function () {

    var onDeviceReady = function () {
        access_token = localStorage.getItem("token");
        userName = localStorage.getItem("userName");
        userID = localStorage.getItem("userID");
        userRole = localStorage.getItem("userRole");

        if (access_token != null && userID != null && userName != null && userRole != null) {
            if (userRole === ROLE_CLIENTE) {
                initialView = "views/cliente/main.html";
            } else if (userRole === ROLE_PROFISSIONAL) {
                initialView = "views/profissional/main.html";
            }
        };

        //inicia a aplicação
        app = new kendo.mobile.Application(document.body, {
            skin: "flat", layout: "default-layout", transition: "fade", initial: initialView
        });

        kendo.culture("pt-BR");

        navigator.splashscreen.hide();

    };


    document.addEventListener("deviceready", onDeviceReady, 'false');

    function onBack(e) {
        e.preventDefault();
        setTimeout((function () {
            app.navigate("#:back");
        }), 200);
    };

    function logout() {
        localStorage.clear();
        jso_wipe();
        app.navigate("#LoginView");
    };

    //publica os metodos para que possam ser chamados por uma tela, ou javascript
    $.extend(window, {
        onBack: onBack,
        logout: logout
    });


    onDeviceReady();

}());

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//substitui a imagem se a mesma estiver quebrada ou nao existir
function imageError(image) {
    image.src = "images/user_icon.png";
    return true;
};

//Ajusta o tamanho do dialog modal
function ajustaDialogHeight(modal) {
    var height = modal.find('div.km-header').outerHeight(true);
    
    $.each(modal.find('div.km-scroll-container > *'), function (index, elem) {
        var jqElem = $(elem);
        if (jqElem.is(":visible")) {
            height += jqElem.outerHeight(true);
        }
    });
   
    modal.height(height);
    modal.parent().parent().height(height);
}

function findQuoteById(array, id) {
    for (i = 0; i < array.length; i++) {
        if (array[i].quote_Id === id) {
            return array[i];
        }
    }
    return null;
};

function findScheduleById(array, id) {
    for (i = 0; i < array.length; i++) {
        if (array[i].schedule_Id === id) {
            return array[i];
        }
    }
    return null;
};