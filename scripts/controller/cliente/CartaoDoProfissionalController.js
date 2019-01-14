(function($, console, doc) {

    window.CartaoDoProfissionalModel = kendo.observable({
        serviceProvider: null,

        email1: function () {
            if (CartaoDoProfissionalModel.get('serviceProvider') != null) {
                return CartaoDoProfissionalModel.serviceProvider.email.split("@")[0];
            }
            return null;
        },

        email2: function () {
            if (CartaoDoProfissionalModel.get('serviceProvider') != null) {
                return '@' + CartaoDoProfissionalModel.serviceProvider.email.split("@")[1];
            }
            return null;
        },

        averageReview: function () {
            if (CartaoDoProfissionalModel.get('serviceProvider') != null && CartaoDoProfissionalModel.get('serviceProvider').averageReview != null) {
                return (CartaoDoProfissionalModel.serviceProvider.averageReview / 5 * 100) + "%";
            }
            return "0%";
        },

        showCartao: function (providerId) {
            $('.km-loader').show();
            /*$.ajax({
                url: url + 'api/ServiceProviders/' + providerId,
                type: "GET",
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                success: function (data) {
                    $('.km-loader').hide();
                    //alert(JSON.stringify(data));
                    CartaoDoProfissionalModel.set("serviceProvider", data[0]);
                    $("#modalview-cartaoDoProfissional").kendoMobileModalView("open")
                    ajustaDialogHeight($("#modalview-cartaoDoProfissional"));
                    return false;
                },
                error: function (msg) {
                    $('.km-loader').hide();
                    return false;
                }
            });*/

            //dados locais de teste
            CartaoDoProfissionalModel.set("serviceProvider", profissionais[providerId-1]);
            $("#modalview-cartaoDoProfissional").kendoMobileModalView("open")
            ajustaDialogHeight($("#modalview-cartaoDoProfissional"));
            $('.km-loader').hide();
        },
    });

})(jQuery, console, document);