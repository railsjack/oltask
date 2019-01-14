(function ($, console, doc) {

    window.IndicarOLTaskModel = kendo.observable({
        email:null,

        open: function () {
            IndicarOLTaskModel.set("email", "");
        },
        close: function() {
            $("#modalview-indicarOLTask").kendoMobileModalView("close");
        },
        indicarOLTaskEmail: function() {
            var validator = $("#indicarOLTaskForm").kendoValidator().data("kendoValidator");
            if (validator.validate()) {
                enviaConvite(this.email);
            } else {
                navigator.notification.alert("Digite um email válido.", null, "Aviso", "OK");
            }
        }
    });

    function enviaConvite(email) {
        var data = {
            message_Id: 22,
            messageTo: email,
            condition: 1,
            status: 0,
        };
        $('.km-loader').show();
        $.ajax({
            url: url + 'api/queues',
            type: "post",
            dataType: 'json',
            data: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
            success: function (data) {
                $('.km-loader').hide();
                IndicarOLTaskModel.close();
                return false;
            },
            error: function (msg) {
                navigator.notification.alert("Ocorreu um Erro.", null, "Aviso", "OK");
                $('.km-loader').hide();
                return false;
            }
        });
    }

})(jQuery, console, document);
