(function ($, console, doc) {

    window.NovaTarefaModel = kendo.observable({

        estados: estadosDS,

        cidades: cidadesDS,

        bairros: bairrosDS,

        categoriasDeTarefas: categoriasDeTarefaDS,

        novaTarefa: null,

        init: function () {
            var estados = $('#novaTarefaForm #estados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: NovaTarefaModel.estados,
            }).data("kendoDropDownList");

            var cidades = $('#novaTarefaForm #cidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "estados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: NovaTarefaModel.cidades,
            }).data("kendoDropDownList");

            var bairros = $('#novaTarefaForm #bairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: NovaTarefaModel.bairros,
            }).data("kendoDropDownList");
            
            $('#novaTarefaForm #categorias').kendoDropDownList({
                optionLabel: "Selecione a categoria...",
                dataTextField: "categorie",
                dataValueField: "categorie_Id",
                dataSource: NovaTarefaModel.categoriasDeTarefas,
            });
        },

        show: function () {
            NovaTarefaModel.set("novaTarefa", {
                Service: {},
                Schedules: [{}, {}],
                Address: {},
                urgent: false
            });
        },

        publicar: function () {
            var validator = $("#novaTarefaForm").kendoValidator({
                rules: {
                    requiredIfNotUrgent: function (input) {
                        if (input.is("[data-required-if-not-urgent]") && input.val()==null  && NovaTarefaModel.novaTarefa.urgent != true) {
                            return false;
                        }
                        return true;
                    }
                }
            }).data("kendoValidator");

            if (validator.validate()) {
                this.novaTarefa.Service.set("Customer_Id", 1);
                this.novaTarefa.Service.set("Categorie_Id", 1);
                this.novaTarefa.Service.set("Status", TAREFA_PENDENTE);
                this.novaTarefa.Address.set("Neighborhood_Id", $('#bairros').val());

                var dataAtual = new Date();
                if (!this.novaTarefa.urgent) {
                    var dataInicio1, dataFim1, dataInicio2, dataFim2;
                    dataInicio1 = $('#novaTarefaForm #data').val() + 'T' + $('#novaTarefaForm #horaInicio1').val();
                    dataFim1 = $('#novaTarefaForm #data').val() + 'T' + $('#novaTarefaForm #horaFim1').val();
                    dataInicio2 = $('#novaTarefaForm #data').val() + 'T' + $('#novaTarefaForm #horaInicio2').val();
                    dataFim2 = $('#novaTarefaForm #data').val() + 'T' + $('#novaTarefaForm #horaFim2').val();

                    if (kendo.parseDate(dataFim1) < dataAtual || kendo.parseDate(dataFim2) < dataAtual) {
                        navigator.notification.alert("Escolha uma data futura.", null, "Aviso", "OK");
                        return;
                    }
                    if (dataFim1 <= dataInicio1) {
                        navigator.notification.alert("A hora de inicio deve ser menor do que a hora final.", null, "Aviso", "OK");
                        return;
                    }
                    if (dataFim2 <= dataInicio2) {
                        navigator.notification.alert("A hora de inicio deve ser menor do que a hora final.", null, "Aviso", "OK");
                        return;
                    }

                    this.novaTarefa.Schedules[0].set("startAt", dataInicio1);
                    this.novaTarefa.Schedules[0].set("entAt", dataFim1);
                    this.novaTarefa.Schedules[1].set("startAt", dataInicio2);
                    this.novaTarefa.Schedules[1].set("entAt", dataFim2);
                } else {                    
                    var inicio = kendo.toString(dataAtual, "yyyy'-'MM'-'dd'T'HH':'mm':'ss");
                    dataAtual.setHours(dataAtual.getHours() + 1);
                    var fim = kendo.toString(dataAtual, "yyyy'-'MM'-'dd'T'HH':'mm':'ss");

                    this.novaTarefa.set("Schedules", [{ startAt: inicio, endAt: fim }]);
                }
                
                var novaTarefa = JSON.stringify(this.novaTarefa);

                publicaTarefa();
                //publicaTarefaLocal();
            } else {
                navigator.notification.alert("Preencha todos os campos.", null, "Aviso", "OK");
            };
        }

    });

    function publicaTarefaLocal() {
        var tarefa = {
            service_Id: 1,
            title: NovaTarefaModel.novaTarefa.Service.Title,
            description: NovaTarefaModel.novaTarefa.Service.Description,
            schedules: NovaTarefaModel.novaTarefa.Schedules,
            status: NovaTarefaModel.novaTarefa.status,
            urgent: NovaTarefaModel.novaTarefa.urgent
        }

        pendentes.push(tarefa);
        tarefasPendentesDS.add(tarefa);
        app.navigate('views/cliente/main.html');
    }

    function publicaTarefa() {
        //alert(JSON.stringify(NovaTarefaModel.novaTarefa.Schedules));
        //return;
        app.showLoading();
        $.ajax({
            url: url + 'api/ServiceScheduleAddress',
            type: "POST",
            data: JSON.stringify(NovaTarefaModel.novaTarefa),
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
            success: function (data) {
                var tarefa = {
                    service_Id: 1,
                    status: TAREFA_PENDENTE,
                    title: NovaTarefaModel.novaTarefa.Service.Title,
                    description: NovaTarefaModel.novaTarefa.Service.Description,
                    schedules: NovaTarefaModel.novaTarefa.Schedules
                }
                for (i = 0 ; i < tarefa.schedules.length ; i++) {
                    tarefa.schedules[i].endAt = tarefa.schedules[i].entAt
                }
                tarefasPendentesDS.add(tarefa);
                app.hideLoading();
                app.navigate('views/cliente/main.html');
                return false;
            },
            error: function (msg) {
                app.hideLoading();
                navigator.notification.alert("Ocorreu um Erro.", null, "Aviso", "OK");
                return false;
            }
        });
    }

})(jQuery, console, document);