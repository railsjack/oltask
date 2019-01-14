(function ($, console, doc) {

    window.ProfissionaisAvaliadosModel = kendo.observable({
        reviews: reviewsDoClienteDS,
        
        loaded: false,

        noReviews: false,

        error: false,

        init: function () {
            ProfissionaisAvaliadosModel.reviews.bind("change", function (e) {
                ProfissionaisAvaliadosModel.loaded = true;
                if (ProfissionaisAvaliadosModel.reviews.data().length === 0) {
                    ProfissionaisAvaliadosModel.set("noReviews", true);
                }
                app.hideLoading();
            });
            ProfissionaisAvaliadosModel.reviews.bind("error", function (e) {
                ProfissionaisAvaliadosModel.set("error", true);
                ProfissionaisAvaliadosModel.set("noReviews", false);
                app.hideLoading();

                if (e.xhr.status == 401) {
                    //o token expirou, volta para a tela de login.
                    app.navigate("#LoginView");
                };
            });
        },

        show: function () {
            if (!ProfissionaisAvaliadosModel.loaded) {
                app.showLoading();
                reviewsDoClienteDS.read();
            }
        },

    });

})(jQuery, console, document);