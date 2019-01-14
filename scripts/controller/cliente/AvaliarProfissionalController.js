(function($, console, doc) {

    window.AvaliarProfissionalModel = kendo.observable({
        tarefa: null,

        quote: null,

        schedule: null,

        date: function () {
            if (AvaliarProfissionalModel.get('schedule') != null)
                return kendo.toString(kendo.parseDate(AvaliarProfissionalModel.schedule.startAt), "dd/MM/yyyy") + " | " +
                   kendo.toString(kendo.parseDate(AvaliarProfissionalModel.schedule.startAt), "HH':'mm") + " às " +
                   kendo.toString(kendo.parseDate(AvaliarProfissionalModel.schedule.endAt), "HH':'mm");
            return "";
        },

        visitValue: function () {
            if (AvaliarProfissionalModel.get('schedule') != null) {
                var teste = kendo.toString(AvaliarProfissionalModel.quote.visitValue, "0.00");
                return "R$ " + teste;
            }
            return "";
        },

        init: function () {

        },
        show: function (args) {
            var dataSet = tarefasAgendadasDS.view();
            var taskId = args.view.params.taskId;
            var quoteId = args.view.params.quoteId;
            var scheduleId = args.view.params.scheduleId;

            AvaliarProfissionalModel.set("tarefa", null);
            AvaliarProfissionalModel.set("quote", null);
            AvaliarProfissionalModel.set("schedule", null);

            for (var i = 0; i < dataSet.length; i++) {
                if (dataSet[i].service_Id == taskId) {
                    AvaliarProfissionalModel.set("tarefa", dataSet[i]);
                    break;
                }
            };

            if (AvaliarProfissionalModel.tarefa != null) {
                for (var i = 0; i < AvaliarProfissionalModel.tarefa.quotes.length; i++) {
                    if (AvaliarProfissionalModel.tarefa.quotes[i].quote_Id == quoteId) {
                        AvaliarProfissionalModel.set("quote", AvaliarProfissionalModel.tarefa.quotes[i]);
                    }
                }
                for (var i = 0; i < AvaliarProfissionalModel.tarefa.schedules.length; i++) {
                    if (AvaliarProfissionalModel.tarefa.schedules[i].schedule_Id == scheduleId) {
                        AvaliarProfissionalModel.set("schedule", AvaliarProfissionalModel.tarefa.schedules[i]);
                    }
                }
            }

            if (AvaliarProfissionalModel.tarefa == null || AvaliarProfissionalModel.quote == null || AvaliarProfissionalModel.schedule == null) {
                app.navigate("#:back");
            } else {
                $("#avaliarProfissionalView #pontualidade-nota").rating('update', 0);
                $("#avaliarProfissionalView #agilidade-nota").rating('update', 0);
                $("#avaliarProfissionalView #atencao-nota").rating('update', 0);
                $("#avaliarProfissionalView #organizacao-nota").rating('update', 0);
                $("#avaliarProfissionalView #preco-nota").rating('update', 0);
                $('#avaliarProfissionalView #notafinal').rating('update', 0);
            }
        },

        enviar: function () {
            var total = Number($("#avaliarProfissionalView #pontualidade-nota").val());
            total = total + Number($("#avaliarProfissionalView #agilidade-nota").val());
            total = total + Number($("#avaliarProfissionalView #atencao-nota").val());
            total = total + Number($("#avaliarProfissionalView #organizacao-nota").val());
            total = total + Number($("#avaliarProfissionalView #preco-nota").val());

            enviaReview(1, AvaliarProfissionalModel.tarefa, AvaliarProfissionalModel.quote);

            total = total / 5;
            AvaliarProfissionalModel.tarefa.set("review", total);
        }
    });

    function enviaReview(dimension, tarefa, quote) {
        var score;
        if (dimension == 1) {
            app.showLoading();
            score = Number($("#avaliarProfissionalView #pontualidade-nota").val());
        } else if (dimension == 2) {
            score = Number($("#avaliarProfissionalView #agilidade-nota").val());
        } else if (dimension == 3) {
            score = Number($("#avaliarProfissionalView #atencao-nota").val());
        } else if (dimension == 4) {
            score = Number($("#avaliarProfissionalView #organizacao-nota").val());
        } else if (dimension == 5) {
            score = Number($("#avaliarProfissionalView #preco-nota").val());
        }

        $.ajax({
            url: url + 'api/reviews/',
            type: "POST",
            data: "{\"service_Id\":" + tarefa.service_Id + ",\"customer_Id\":" + userID + ",\"serviceProvider_Id\":" + quote.serviceProvider_Id + ",\"dimension\":" + dimension + ",\"score\":" + score + ",\"type\":1}",
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
            success: function (data) {
                if (dimension != 5) {
                    enviaReview(dimension + 1, tarefa, quote);
                } else {
                    app.hideLoading();
                    app.navigate("#:back");
                }
            },
            error: function (msg) {
                navigator.notification.alert("Ocorreu um Erro.", null, "Erro", "OK");
                app.hideLoading();
                return false;
            }
        });
    }

})(jQuery, console, document);