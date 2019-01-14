(function ($, console, doc) {

    window.ClienteTarefasModel = kendo.observable({

        tarefasAgendadas: tarefasAgendadasDS,

        tarefasPendentes: tarefasPendentesDS,

        tarefasConcluidas: tarefasConcluidasDS,

        tarefaSelecionada: null,

        agendadasLoaded: false,

        agendadasError: false,

        agendadasNoTasks : false,

        pendentesLoaded: false,

        pendentesError: false,

        pendentesNoTasks: false,

        concluidasLoaded: false,

        concluidasError: false,

        concluidasNoTasks: false,

        init: function () {
            _agendadasElem = $("#clienteTarefasView #agendadas");
            _pendentesElem = $("#clienteTarefasView #pendentes");
            _concluidasElem = $("#clienteTarefasView #concluidas");

            ClienteTarefasModel.tarefasAgendadas.bind("change", function (e) {
                if (ClienteTarefasModel.tarefasAgendadas.data().length === 0) {
                    ClienteTarefasModel.set("agendadasNoTasks", true);
                }
                app.hideLoading();
            });
            ClienteTarefasModel.tarefasAgendadas.bind("error", function (e) {
                ClienteTarefasModel.set("agendadasError", true);
                ClienteTarefasModel.set("agendadasNoTasks", false);
                app.hideLoading();

                if (e.xhr.status == 401) {
                    //o token expirou, volta para a tela de login.
                    app.navigate("#LoginView");
                };
            });

            ClienteTarefasModel.tarefasPendentes.bind("change", function (e) {
                if (ClienteTarefasModel.tarefasPendentes.data().length === 0) {
                    ClienteTarefasModel.set("pendentesNoTasks", true);
                }
                app.hideLoading();
            });
            ClienteTarefasModel.tarefasPendentes.bind("error", function (e) {
                ClienteTarefasModel.set("pendentesError", true);
                ClienteTarefasModel.set("pendentesNoTasks", false);
                app.hideLoading();

                if (e.xhr.status == 401) {
                    //o token expirou, volta para a tela de login.
                    app.navigate("#LoginView");
                };
            });

            ClienteTarefasModel.tarefasConcluidas.bind("change", function (e) {
                if (ClienteTarefasModel.tarefasConcluidas.data().length === 0) {
                    ClienteTarefasModel.set("concluidasNoTasks", true);
                }
                app.hideLoading();
            });
            ClienteTarefasModel.tarefasConcluidas.bind("error", function (e) {
                ClienteTarefasModel.set("concluidasError", true);
                ClienteTarefasModel.set("concluidasNoTasks", false);
                app.hideLoading();

                if (e.xhr.status == 401) {
                    //o token expirou, volta para a tela de login.
                    app.navigate("#LoginView");
                };
            });

            $("#clienteTarefasView #btnTarefasViewToggle").data("kendoMobileButtonGroup").bind("select", function (e) {
                ClienteTarefasModel.tarefasViewChanged(e.sender.selectedIndex);
            });
        },

        show: function () {
            ClienteTarefasModel.tarefasViewChanged($("#clienteTarefasView #btnTarefasViewToggle").data("kendoMobileButtonGroup").current().index());
        },

        tarefasViewChanged: function (index) {
            var isAgendadas = (index === 0);
            var isPendentes = (index === 1);

            $('.km-content:visible').data('kendoMobileScroller').reset();
            $("#clienteTarefasView").find(".km-scroller-pull").remove();

            if (isAgendadas) {
                mostraTarefasAgendadas();
            } else if (isPendentes) {
                mostraTarefasPendentes();
            } else {
                mostraTarefasConcluidas();
            }
        },

        edit: function (e) {
            selecionaTarefa(e.target);
            
            //ajusta o tamanho do modal dinamicamente
            var modal = $("#modalview-republicarTarefa");
            ajustaDialogHeight(modal);

            var data = kendo.toString(kendo.parseDate(ClienteTarefasModel.tarefaSelecionada.schedules[0].startAt), "yyyy-MM-dd");
            var horaInicio1 = kendo.toString(kendo.parseDate(ClienteTarefasModel.tarefaSelecionada.schedules[0].startAt), "HH':'mm");
            var horaFim1 = kendo.toString(kendo.parseDate(ClienteTarefasModel.tarefaSelecionada.schedules[0].endAt), "HH':'mm");
            var horaInicio2 = kendo.toString(kendo.parseDate(ClienteTarefasModel.tarefaSelecionada.schedules[1].startAt), "HH':'mm");
            var horaFim2 = kendo.toString(kendo.parseDate(ClienteTarefasModel.tarefaSelecionada.schedules[1].endAt), "HH':'mm");
            $('#modalview-republicarTarefa #data').val(data);
            $('#modalview-republicarTarefa #horaInicio1').val(horaInicio1);
            $('#modalview-republicarTarefa #horaFim1').val(horaFim1);
            $('#modalview-republicarTarefa #horaInicio2').val(horaInicio2);
            $('#modalview-republicarTarefa #horaFim2').val(horaFim2);
        },

        closeDialog: function () {
            $("#modalview-republicarTarefa").kendoMobileModalView("close");
        },

        republicar: function (e) {
            var data = $('#modalview-republicarTarefa #data').val();
            var horaInicio1 = data + "T" + $('#modalview-republicarTarefa #horaInicio1').val();
            var horaFim1 = data + "T" + $('#modalview-republicarTarefa #horaFim1').val();
            var horaInicio2 = data + "T" + $('#modalview-republicarTarefa #horaInicio2').val();
            var horaFim2 = data + "T" + $('#modalview-republicarTarefa #horaFim2').val();

            if (horaFim1 <= horaInicio1) {
                alert("A hora de inicio deve ser menor do que a hora final.")
                return;
            }
            if (horaFim2 <= horaInicio2) {
                alert("A hora de inicio deve ser menor do que a hora final.")
                return;
            }
            var dataAtual = new Date();
            if (kendo.parseDate(horaFim1) < dataAtual || kendo.parseDate(horaFim2) < dataAtual) {
                alert("Escolha uma data futura.")
                return;
            }

            ClienteTarefasModel.tarefaSelecionada.set("schedules[0].startAt", horaInicio1);
            ClienteTarefasModel.tarefaSelecionada.set("schedules[0].endAt", horaFim1);
            ClienteTarefasModel.tarefaSelecionada.set("schedules[1].startAt", horaInicio2);
            ClienteTarefasModel.tarefaSelecionada.set("schedules[1].endAt", horaFim2);
            ClienteTarefasModel.tarefaSelecionada.set("status", TAREFA_PENDENTE);
            ClienteTarefasModel.tarefaSelecionada.set("selected_quoteId", null);
            
            republicaTarefaSelecionadaLocal();
            this.closeDialog();
        },

        cancela: function(elem) {
            selecionaTarefa(elem);
            //nao Utilizar cancelaTarefaSelecionadaLocal em producao utilizar cancelaTarefaSelecionada
            navigator.notification.confirm("Deseja realmente cancelar a tarefa " + ClienteTarefasModel.tarefaSelecionada.title, cancelaTarefaSelecionada, "Atenção", ["Sim", "Não"])
        },

        concluir: function (elem) {
            selecionaTarefa(elem);
            concluiTarefaSelecionada();
        }

    });

    function mostraTarefasAgendadas() {
        _agendadasElem.show();
        _pendentesElem.hide();
        _concluidasElem.hide();

        //remove o wrapper que esta sendo recriado toda vez que a lista é criada
        if ($("#clienteTarefasView #agendadas-list").parent().hasClass("km-listview-wrapper")) {
            var content = $("#clienteTarefasView #agendadas-list").parent();
            var parent = content.parent();
            content.remove();
            parent.append(content.html());
        };

        $("#clienteTarefasView #agendadas-list").kendoMobileListView({
            dataSource: tarefasAgendadasDS,
            template: $("#agendadas-template").text(),
            pullToRefresh: true,
            autoBind: false
        });

        if (ClienteTarefasModel.agendadasLoaded === false) {
            app.showLoading();
            tarefasAgendadasDS.read();
            ClienteTarefasModel.set("agendadasLoaded", true);
        } else {
            $('#clienteTarefasView #agendadas-list').data('kendoMobileListView').refresh();
        }
    };

    function mostraTarefasPendentes() {
        _agendadasElem.hide();
        _pendentesElem.show();
        _concluidasElem.hide();

        //remove o wrapper que esta sendo recriado toda vez que a lista é criada
        if ($("#clienteTarefasView #pendentes-list").parent().hasClass("km-listview-wrapper")) {
            var content = $("#clienteTarefasView #pendentes-list").parent();
            var parent = content.parent();
            content.remove();
            parent.append(content.html());
        };

        $("#clienteTarefasView #pendentes-list").kendoMobileListView({
            dataSource: tarefasPendentesDS,
            template: $("#pendentes-template").text(),
            pullToRefresh: true,
            autoBind: false
        });

        if (ClienteTarefasModel.pendentesLoaded === false) {
            app.showLoading();
            tarefasPendentesDS.read();
            ClienteTarefasModel.set("pendentesLoaded", true);
        } else {
            $('#clienteTarefasView #pendentes-list').data('kendoMobileListView').refresh();
        }
    }

    function mostraTarefasConcluidas() {
        _agendadasElem.hide();
        _pendentesElem.hide();
        _concluidasElem.show();

        //remove o wrapper que esta sendo recriado toda vez que a lista é criada
        if ($("#clienteTarefasView #concluidas-list").parent().hasClass("km-listview-wrapper")) {
            var content = $("#clienteTarefasView #concluidas-list").parent();
            var parent = content.parent();
            content.remove();
            parent.append(content.html())
        };

        $("#clienteTarefasView #concluidas-list").kendoMobileListView({
            dataSource: tarefasConcluidasDS,
            template: $("#concluidas-template").text(),
            pullToRefresh: true,
            autoBind: false
        });

        if (ClienteTarefasModel.concluidasLoaded === false) {
            app.showLoading();
            tarefasConcluidasDS.read();
            ClienteTarefasModel.set("concluidasLoaded", true);
        } else {
            $('#clienteTarefasView #concluidas-list').data('kendoMobileListView').refresh();
        }
    };

    function selecionaTarefa(elem) {
        var lv = $(elem).parents('ul:first').data('kendoMobileListView');
        var dataSource = lv.dataSource;

        var li = $(elem).parents('li:first');
        var uid = li.data('uid');
        ClienteTarefasModel.set("tarefaSelecionada", dataSource.getByUid(uid));
    }

    function cancelaTarefaSelecionada(number) {
        if (number === 1) {
            var tarefa = ClienteTarefasModel.tarefaSelecionada;
            app.showLoading();
            $.ajax({
                url: url + 'api/services/' + tarefa.service_Id,
                type: "PUT",
                data: "{\"customer_Id\":" + tarefa.customer_Id + ",\"categorie_Id\":" + tarefa.categorie_Id + ",\"status\":" + TAREFA_CANCELADA + "}",
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                success: function (data) {
                    if (tarefa.status === TAREFA_PENDENTE) {
                        tarefasPendentesDS.remove(tarefa);
                    } else if (tarefa.status === TAREFA_AGENDADA) {
                        tarefasAgendadasDS.remove(tarefa);
                    } else if (tarefa.status === TAREFA_AGUARDANDO_ESCOLHA) {
                        tarefasAguardandoEscolhaDS.remove(tarefa);
                    }
                    app.hideLoading();
                    return false;
                },
                error: function (msg) {
                    navigator.notification.alert("Ocorreu um Erro.", null, "Erro", "OK");
                    app.hideLoading();
                    return false;
                }
            });
        }
    }

    //TESTE NAO USER ESTA FUNCAO EM PRODUCAO
    function cancelaTarefaSelecionadaLocal(number) {
        if (number === 1) {
            var tarefa = ClienteTarefasModel.tarefaSelecionada;
            app.showLoading();
            for (i = 0; i < aguardandoEscolha.length ; i++) {
                if (aguardandoEscolha[i].service_Id == tarefa.service_Id) {
                    aguardandoEscolha.splice(i, 1);
                    break;
                }
            }
            for (i = 0; i < agendadas.length ; i++) {
                if (agendadas[i].service_Id == tarefa.service_Id) {
                    agendadas.splice(i, 1);
                    break;
                }
            }
            for (i = 0; i < pendentes.length ; i++) {
                if (pendentes[i].service_Id ==tarefa.service_Id) {
                    pendentes.splice(i, 1);
                    break;
                }
            }

            if (tarefa.status === TAREFA_PENDENTE) {
                tarefasPendentesDS.remove(tarefa);
            } else if (tarefa.status === TAREFA_AGENDADA) {
                tarefasAgendadasDS.remove(tarefa);
            } else if (tarefa.status === TAREFA_AGUARDANDO_ESCOLHA) {
                tarefasAguardandoEscolhaDS.remove(tarefa);
            }
            
            app.hideLoading();
        }
    }

    function republicaTarefaSelecionada() {
        //TODO
    }

    function republicaTarefaSelecionadaLocal() {
        var tarefa = ClienteTarefasModel.tarefaSelecionada;
        tarefasAgendadasDS.remove(tarefa);
        tarefasPendentesDS.remove(tarefa);
        tarefasPendentesDS.add(tarefa);

        for (i = 0; i < agendadas.length ; i++) {
            if (agendadas[i].service_Id == tarefa.service_Id) {
                agendadas.splice(i, 1);
                break;
            }
        }
        for (i = 0; i < pendentes.length ; i++) {
            if (pendentes[i].service_Id == tarefa.service_Id) {
                pendentes.splice(i, 1);
                break;
            }
        }
        pendentes.push(tarefa);
    }

    function concluiTarefaSelecionada() {
        var tarefa = ClienteTarefasModel.tarefaSelecionada;
        app.showLoading();
        $.ajax({
            url: url + 'api/services/' + tarefa.service_Id,
            type: "PUT",
            data: "{\"customer_Id\":" + tarefa.customer_Id + ",\"categorie_Id\":" + tarefa.categorie_Id + ",\"status\":" + TAREFA_CONCLUIDA + "}",
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
            success: function (data) {
                tarefasAgendadasDS.remove(tarefa);
                tarefasConcluidasDS.add(tarefa);
                app.hideLoading();
            },
            error: function (msg) {
                navigator.notification.alert("Ocorreu um Erro.", null, "Erro", "OK");
                app.hideLoading();
            }
        });
    }

    function concluiTarefaSelecionadaLocal() {
        var tarefa = ClienteTarefasModel.tarefaSelecionada;
        tarefa.set("status", TAREFA_CONCLUIDA);

        tarefasAgendadasDS.remove(tarefa);
        tarefasConcluidasDS.add(tarefa);

        for (i = 0; i < agendadas.length ; i++) {
            if (agendadas[i].service_Id == tarefa.service_Id) {
                agendadas.splice(i, 1);
                break;
            }
        }
        concluidas.push(tarefa);

    }

    //publica os metodos para que possam ser chamados por uma tela, ou javascript
    $.extend(window, {
        cancelarTarefa: ClienteTarefasModel.cancela,
        concluirTarefa: ClienteTarefasModel.concluir
    });

})(jQuery, console, document);