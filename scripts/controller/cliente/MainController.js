(function ($, console, doc) {

    window.ClienteMainModel = kendo.observable({
        data: tarefasAguardandoEscolhaDS,

        loaded: false,

        noTasks: false,

        error: false,

        init: function() {
            ClienteMainModel.data.bind("change", function (e) {
                ClienteMainModel.set("loaded", true);
                if (ClienteMainModel.data.data().length === 0) {
                    ClienteMainModel.set("noTasks", true);
                }
                app.hideLoading();
            });
            ClienteMainModel.data.bind("error", function (e) {
                ClienteMainModel.set("error", true);
                ClienteMainModel.set("noTasks", false);
                app.hideLoading();

                if (e.xhr.status == 401) {
                    //o token expirou, volta para a tela de login.
                    app.navigate("#LoginView");
                };
            });
        },

        show: function() {
            var agendaBadge = $('#agendaBadge');
            var tarefasPublicadasBadge = $('#tarefasPublicadasBadge');
            var negociosFechadosBadge = $('#negociosFechadosBadge');

            if (ClienteMainModel.loaded === false) {
                app.showLoading();
                tarefasAguardandoEscolhaDS.read();
            };

            /*$.ajax({
                url: url + 'api/ServiceCount',
                type: "GET",
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                success: function (data) {
                    agendaBadge.text(data[1].total + data[3].total);
                    tarefasPublicadasBadge.text(data[0].total);
                    negociosFechadosBadge.text(data[2].total);
    
                    if ((data[1].total + data[3].total) > 0)
                        agendaBadge.show();
    
                    if (data[0].total > 0)
                        tarefasPublicadasBadge.show();
    
                    if (data[2].total > 0)
                        negociosFechadosBadge.show();
    
                    return false;
                },
                error: function (msg) {
                    agendaBadge.hide();
                    tarefasPublicadasBadge.hide();
                    negociosFechadosBadge.hide();
                    return false;
                }
                
            });*/
        },

        agendar: function (taskID, quoteId) {
            var dataSet = ClienteMainModel.data.view();
            var tarefa = null;
            var quote = null;
            var schedule = null;

            for (i = 0; i < dataSet.length ; i++) {
                if (dataSet[i].service_Id == taskID) {
                    tarefa = dataSet[i];
                    break;
                }
            }

            if (tarefa == null) return;

            for (i = 0; i < tarefa.quotes.length ; i++) {
                if (tarefa.quotes[i].quote_Id == quoteId) {
                    quote = tarefa.quotes[i];
                    break;
                }
            }

            if (quote == null) return;

            var schedule_Id = quote.appointment_Id;
            for (i = 0; i < tarefa.schedules.length ; i++) {
                if (tarefa.schedules[i].schedule_Id == schedule_Id) {
                    schedule = tarefa.schedules[i];
                    break;
                }
            }

            if (schedule == null) return;

            //SOMENTE PARA TESTE LOCAL, COMENTAR EM PRODUÇÂO
            //agendaTarefaLocal(tarefa, quote, schedule);

            //DESCOMENTAR EM PRODUÇÃO
            agendaTarefa(tarefa, quote, schedule);
        }

    });

    function agendaTarefa(tarefa, quote, schedule) {
        app.showLoading();
        $.ajax({
            url: url + 'api/quotes/' + quote.quote_Id,
            type: "PUT",
            data: "{\"service_Id\":" + tarefa.service_Id + ",\"appointment_Id\":" + schedule.schedule_Id + ",\"serviceProvider_Id\":" + quote.serviceProvider_Id + ",\"status\":" + 2 + "}",
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
            success: function (data) {
                tarefa.set("status", TAREFA_AGENDADA);
                tarefa.set("selected_quoteId", quote.quote_Id);
                tarefasAguardandoEscolhaDS.remove(tarefa);
                tarefasAgendadasDS.add(tarefa);

                app.hideLoading();

                ClienteAgendamentoModel.set("tarefa", tarefa);
                ClienteAgendamentoModel.set("quote", quote);
                ClienteAgendamentoModel.set("schedule", schedule);
                app.navigate('views/cliente/agendamento.html');
                return false;
            },
            error: function (msg) {
                navigator.notification.alert("Ocorreu um Erro.", null, "Erro", "OK");
                app.hideLoading();
                return false;
            }
        });
    }

    function agendaTarefaLocal(tarefa, quote, schedule) {
        tarefa.set("status", TAREFA_AGENDADA);
        tarefa.set("selected_quoteId", quote.quote_Id);

        for (i = 0; i < aguardandoEscolha.length ; i++) {
            if (aguardandoEscolha[i].service_Id == tarefa.service_Id) {
                aguardandoEscolha.splice(i, 1);
                break;
            }
        }
        agendadas.push(tarefa);

        tarefasAguardandoEscolhaDS.remove(tarefa);
        tarefasAgendadasDS.add(tarefa);
        
        ClienteAgendamentoModel.set("tarefa", tarefa);
        ClienteAgendamentoModel.set("quote", quote);
        ClienteAgendamentoModel.set("schedule", schedule);
        app.navigate('views/cliente/agendamento.html');
    }

})(jQuery, console, document);