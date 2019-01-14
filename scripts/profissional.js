(function () {

    window.ProfissionalPropostas = kendo.observable({
        tarefasPublicadasPorCategoria: tarefasPublicadasPorCategoriaDS,

        selectedJob: null,
       
        selectedJobGetDate: function () {
            if (ProfissionalPropostas.get("selectedJob") != null) {
                if (ProfissionalPropostas.get("selectedJob").schedules[0] != null) {
                    return kendo.toString(kendo.parseDate(ProfissionalPropostas.get("selectedJob").schedules[0].startAt), "dd/MM/yyyy");
                }
            }
        },
        selectedJobGetOption1: function () {
            if (ProfissionalPropostas.get("selectedJob") != null) {
                if (ProfissionalPropostas.get("selectedJob").schedules[0] != null) { 
                    return kendo.toString(kendo.parseDate(ProfissionalPropostas.get("selectedJob").schedules[0].startAt), "HH':'mm") + " às " + kendo.toString(kendo.parseDate(ProfissionalPropostas.get("selectedJob").schedules[0].entAt), "HH':'mm");
                }
            }
        },
        selectedJobGetOption2: function () {
            if (ProfissionalPropostas.get("selectedJob") != null) {
                if (ProfissionalPropostas.get("selectedJob").schedules[1] != null) {
                    return kendo.toString(kendo.parseDate(ProfissionalPropostas.get("selectedJob").schedules[1].startAt), "HH':'mm") + " às " + kendo.toString(kendo.parseDate(ProfissionalPropostas.get("selectedJob").schedules[1].entAt), "HH':'mm");
                }
            }
        },
        confirmar: function () {
            if ($('#modalview-enviarProposta [name=dateOption]:checked').val() == null) {
                alert("Selecione uma opção de horário");
                return;
            }
            if ($('#modalview-enviarProposta [name=propostaValor]').val() > 0) {
                
                var job = ProfissionalPropostas.get("selectedJob");

                var quote = {
                    "service_Id": job.service_Id,
                    "visitValue": $('#modalview-enviarProposta [name=propostaValor]').val(),
                    "appointment_Id": job.schedules[$('#modalview-enviarProposta [name=dateOption]:checked').val()].appointment_Id,
                    "serviceProvider_Id": userID,
                    "status": 1
                };
                $.ajax({
                    url: url + 'api/quotes',
                    type: "POST",
                    data: JSON.stringify(quote),
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                    success: function (data) {
                        $('.km-loader').hide();
                        alert("Proposta enviada com sucesso");
                        $("#modalview-enviarProposta [name=dateOption]:checked").attr("checked", false);
                        $("#modalview-enviarProposta [name=propostaValor]").val("");
                        $("#modalview-enviarProposta").kendoMobileModalView("close");
                        return false;
                    },
                    error: function (msg) {
                        $('.km-loader').hide();
                        alert("Opss ocorreu um erro :(");
                        return false;
                    }
                });


            } else {
                alert("Forneça um valor");
                return;
            }
           

            
        }
    });


    window.AgendaDeTarefas = kendo.observable({
        data: agendaProfissionalDS,

        init: function () {
            
        },

        show: function () {

        }
    });

}());