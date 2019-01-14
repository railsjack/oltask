var estadosDS = new kendo.data.DataSource({
    transport: {
        read: {
            url: url + 'api/statesNoAuth',
            type: "GET",
        }
    }
});

var cidadesDS = new kendo.data.DataSource({
    transport: {
        read: {
            type: "GET",
            url: url + 'api/citiesNoAuth',
        }
    }
});

var bairrosDS = new kendo.data.DataSource({
    transport: {
        read: {
            type: "GET",
            url: url + 'api/neighborhoodsNoAuth',
        }
    }
});

/* CATEGORIAS DE TAREFAS */
var categoriasDeTarefaDS = new kendo.data.DataSource({
    transport: {
        read: {
            url: url + 'api/categories',
            type: "GET",
            beforeSend: function (req) {
                req.setRequestHeader('Authorization', 'Bearer ' + access_token);
            }
        }
    },

    schema: {
        data: function (response) {
            return response;
        }
    },

    error: function (e) {
        $('.km-loader').hide();
        if (e.xhr.status == 401) {
            //o token expirou, volta para a tela de login.
            app.navigate("#LoginView");
        };
    }
});

/* Categorias de profissionais*/
var categoriasProfissionalDS = new kendo.data.DataSource({
    transport: {
        read: {
            type: "GET",

            url: url + 'api/CategoriesNoAuth'


        }
    },
    schema: {
        data: function (response) {
            return response;
        }
    },

    change: function (data) {
        $('.km-loader').hide();
    },

    error: function (e) {
        $('.km-loader').hide();
        if (e.xhr.status == 401) {
            //o token expirou, volta para a tela de login.
            app.navigate("#LoginView");
        };
    }
});
/* ******************************************* */

/* Tarefas publicadas separadas por categorias */
var tarefasPublicadasPorCategoriaDS = new kendo.data.DataSource({
    transport: {
        read: {
            type: "GET",

            url: url + 'api/ServiceProviderServiceCategory?userid=' + '914d4f5f-6240-4f49-909b-49dead918178',//serID,
            beforeSend: function (req) {
                req.setRequestHeader('Authorization', 'Bearer ' + access_token);
            }


        }
    },
    schema: {
        data: function (response) {
            return response;
        }
    },

    change: function (data) {
        $('.km-loader').hide();
    },

    error: function (e) {
        $('.km-loader').hide();
       
        if (e.xhr.status == 401) {
            //o token expirou, volta para a tela de login.
            app.navigate("#LoginView");
        };
    }
});



/* ******************************************* */
/*var tarefasPublicadasPorCategoria = [{ "service_Id": 1, "title": "Instalação de Ar-Condicionado", "description": "instalar ar condicionado no quarto", "customerName": "João cliente", "image": "http://www.soshollywood.com.br/wp-content/uploads/2009/07/charliesheen-1024x775.jpg", "date": "03/06/2015", "schedule1": "14:00 às 15:00", "schedule2": "09:00 às 10:00", "review": 3, "categorie_Id": 1 },
    { "service_Id": 2, "title": "Cortar grama", "description": "carpir um lote", "customerName": "Paulo Paulada", "image": "http://www.soshollywood.com.br/wp-content/uploads/2009/07/charliesheen-1024x775.jpg", "date": "15/06/2015", "schedule1": "19:00 às 20:00", "schedule2": "07:00 às 08:00", "review": 3.5, "categorie_Id": 1 },
{ "service_Id": 3, "title": "Limpar piscina", "description": "cuidar da piscina enquanto eu viajo", "customerName": "Carlos Confiança", "image": "http://www.soshollywood.com.br/wp-content/uploads/2009/07/charliesheen-1024x775.jpg", "date": "10/06/2015", "schedule1": "14:00 às 15:00", "schedule2": "11:00 às 12:00", "review": 3, "categorie_Id": 1 }];
*/


var profissionais = [{ "serviceProvider_Id": 1, "name": "Deborah Ann Woll", "image": "http://www.antonycabeleireiros.com.br/wp-content/uploads/2011/07/Sem-t-25C3-25ADtulo-5.jpg", "age": 26, "tasks": 17, "city": "Rio de Janeiro", "state": "RJ", "phone": "45 99999999", "email": "deborah@hotmail.com", "averageReview": 5 },
{ "serviceProvider_Id": 2, "name": "Charlie Sheen", "image": "http://www.soshollywood.com.br/wp-content/uploads/2009/07/charliesheen-1024x775.jpg", "age": 37, "tasks": 12, "city": "Rio de Janeiro", "state": "RJ", "phone": "45 88888888", "ddd": "61", "email": "charliesheen@gmail.com", "averageReview": 3.5 },
{ "serviceProvider_Id": 3, "name": "Jessica Alba", "image": "http://i3.mirror.co.uk/incoming/article3920822.ece/ALTERNATES/s1023/Jessica-Alba.png", "age": 22, "tasks": 11, "city": "Rio de Janeiro", "state": "RJ", "phone": "45 77777777", "email": "jessicaalba@hotmail.com", "averageReview": 4.5 },
{ "serviceProvider_Id": 4, "name": "Zé Sem Foto", "age": 45, "tasks": 9, "city": "Rio de Janeiro", "state": "RJ", "phone": "45 66666666", "email": "zesemfoto@yahoo.com", "averageReview": 5 },
{ "serviceProvider_Id": 5, "name": "Scarlett Johansson", "image": "http://vignette3.wikia.nocookie.net/marvel/images/7/74/Scarlett-johansson-006.jpg/revision/latest?cb=20141117203240&path-prefix=pt-br", "age": 27, "tasks": 55, "city": "Foz do Iguaçu", "state": "PR", "phone": "45 55555555", "email": "scarlet@hotmail.com" }]


/* data source de teste */
var aguardandoEscolha = [{
    "service_Id": 1, "title": "Tarefa Aguardando 1", "description": "Descrição da tarefa Aguardando 1.", "status": TAREFA_AGUARDANDO_ESCOLHA, "selected_quoteId": null, "schedules": [{ "schedule_Id": 1, "startAt": "2015-05-18T00:00:00", "endAt": "2015-05-18T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-05-18T00:00:00", "endAt": "2015-05-18T00:00:00", "obs": null }],
    "quotes": [{ "quote_Id": 1, "visitValue": 50, "appointment_Id": 1, "serviceProvider_Id": 1, "serviceProvider_Image": "http://www.antonycabeleireiros.com.br/wp-content/uploads/2011/07/Sem-t-25C3-25ADtulo-5.jpg", "serviceProvider_Name": "Deborah Ann Woll", "averageReview": 5, "status": 1 },
                   { "quote_Id": 2, "visitValue": 69.90, "appointment_Id": 2, "serviceProvider_Id": 2, "serviceProvider_Image": "http://www.soshollywood.com.br/wp-content/uploads/2009/07/charliesheen-1024x775.jpg", "serviceProvider_Name": "Charlie Sheen", "averageReview": 3.5, "status": 1 },
                    { "quote_Id": 3, "visitValue": 39.90, "appointment_Id": 2, "serviceProvider_Id": 3, "serviceProvider_Image": "http://i3.mirror.co.uk/incoming/article3920822.ece/ALTERNATES/s1023/Jessica-Alba.png", "serviceProvider_Name": "Jessica Alba", "averageReview": 4.5, "status": 1 }]
    },
    {
        "service_Id": 2, "title": "Tarefa Aguardando 2", "description": "Descrição da tarefa Aguardando 2.", "status": TAREFA_AGUARDANDO_ESCOLHA, "selected_quoteId": null, "schedules": [{ "schedule_Id": 1, "startAt": "2015-05-25T00:00:00", "endAt": "2015-05-25T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-05-25T00:00:00", "endAt": "2015-05-25T00:00:00", "obs": null }],
        "quotes": [{ "quote_Id": 4, "visitValue": 100, "appointment_Id": 1, "serviceProvider_Id": 4, "serviceProvider_Image": null, "serviceProvider_Name": "Zé Sem Foto", "averageReview": 5, "status": 1 },
        { "quote_Id": 5, "visitValue": 119.90, "appointment_Id": 2, "serviceProvider_Id": 5, "serviceProvider_Image": "http://vignette3.wikia.nocookie.net/marvel/images/7/74/Scarlett-johansson-006.jpg/revision/latest?cb=20141117203240&path-prefix=pt-br", "serviceProvider_Name": "Scarlett Johansson", "status": 1 }]
    },
   {
       "service_Id": 3, "title": "Tarefa Aguardando 3", "description": "Descrição da tarefa Aguardando 3.", "status": TAREFA_AGUARDANDO_ESCOLHA, "selected_quoteId": null, "schedules": [{ "schedule_Id": 1, "startAt": "2015-05-15T00:00:00", "endAt": "2015-05-15T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-05-15T00:00:00", "endAt": "2015-05-15T00:00:00", "obs": null }],
       "quotes": [{ "quote_Id": 6, "visitValue": 49.99, "appointment_Id": 1, "serviceProvider_Id": 2, "serviceProvider_Image": "http://www.soshollywood.com.br/wp-content/uploads/2009/07/charliesheen-1024x775.jpg", "serviceProvider_Name": "Charlie Sheen", "averageReview": 3.5, "status": 1 }]
   }];
/* Tarefas Aguardando Seleção do profissional Data Source */
var tarefasAguardandoEscolhaDS = new kendo.data.DataSource({
    data: aguardandoEscolha,

    transport: {
        read: {
            type: "GET",
            url: url + 'api/customerschedule',
            data: function () {
                return {
                    id: userID,
                    status: TAREFA_AGUARDANDO_ESCOLHA
                }
            },
            beforeSend: function (req) {
                req.setRequestHeader('Authorization', 'Bearer ' + access_token);
            }
        }
    },

    schema: {
        data: function (response) {
            return response;
        }
    },

    /*sort: {
        field: "schedules[0].startAt",
        dir: "asc"
    }*/

});

/* data source de teste */
var agendadas = [{ "service_Id": 21, "title": "Tarefa Agendada 1", "description": "Descrição da tarefa agendada 1.", "status": TAREFA_AGENDADA, "selected_quoteId": 1, "schedules": [{ "schedule_Id": 1, "startAt": "2015-04-15T00:00:00", "endAt": "2015-04-15T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-04-15T00:00:00", "endAt": "2015-04-15T00:00:00", "obs": null }], "quotes": [{ "quote_Id": 1, "visitValue": 50, "appointment_Id": 1, "serviceProvider_Id": 1, "serviceProvider_Image": "http://www.antonycabeleireiros.com.br/wp-content/uploads/2011/07/Sem-t-25C3-25ADtulo-5.jpg", "serviceProvider_Name": "Deborah Ann Woll", "averageReview": 5, "status": 2 }] },
                  { "service_Id": 22, "title": "Tarefa Agendada 2", "description": "Descrição da tarefa agendada 2.", "status": TAREFA_AGENDADA, "selected_quoteId": 1, "schedules": [{ "schedule_Id": 1, "startAt": "2015-04-25T00:00:00", "endAt": "2015-04-25T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-04-25T00:00:00", "endAt": "2015-04-25T00:00:00", "obs": null }], "quotes": [{ "quote_Id": 1, "visitValue": 100, "appointment_Id": 1, "serviceProvider_Id": 2, "serviceProvider_Image": "http://www.soshollywood.com.br/wp-content/uploads/2009/07/charliesheen-1024x775.jpg", "serviceProvider_Name": "Charlie Sheen", "averageReview": 3.5, "status": 2 }] },
                  { "service_Id": 23, "title": "Tarefa Agendada 3", "description": "Descrição da tarefa agendada 3.", "status": TAREFA_AGENDADA, "selected_quoteId": 1, "schedules": [{ "schedule_Id": 1, "startAt": "2015-05-15T00:00:00", "endAt": "2015-05-15T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-05-15T00:00:00", "endAt": "2015-05-15T00:00:00", "obs": null }], "quotes": [{ "quote_Id": 1, "visitValue": 75, "appointment_Id": 1, "serviceProvider_Id": 3, "serviceProvider_Image": "http://i3.mirror.co.uk/incoming/article3920822.ece/ALTERNATES/s1023/Jessica-Alba.png", "serviceProvider_Name": "Jessica Alba", "averageReview": 4.5, "status": 1 }] },
                  { "service_Id": 24, "title": "Tarefa Agendada 4", "description": "Descrição da tarefa agendada 4.", "status": TAREFA_AGENDADA, "selected_quoteId": 1, "schedules": [{ "schedule_Id": 1, "startAt": "2015-05-25T00:00:00", "endAt": "2015-05-25T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-05-25T00:00:00", "endAt": "2015-05-25T00:00:00", "obs": null }], "quotes": [{ "quote_Id": 1, "visitValue": 89, "appointment_Id": 1, "serviceProvider_Id": 4, "serviceProvider_Image": null, "serviceProvider_Name": "Zé Sem Foto", "averageReview": 4.8, "status": 1 }] },
                  { "service_Id": 25, "title": "Tarefa Agendada 5", "description": "Descrição da tarefa agendada 5.", "status": TAREFA_AGENDADA, "selected_quoteId": 1, "schedules": [{ "schedule_Id": 1, "startAt": "2015-05-01T00:00:00", "endAt": "2015-05-01T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-05-01T00:00:00", "endAt": "2015-05-01T00:00:00", "obs": null }], "quotes": [{ "quote_Id": 1, "visitValue": 200, "appointment_Id": 1, "serviceProvider_Id": 5, "serviceProvider_Image": "http://vignette3.wikia.nocookie.net/marvel/images/7/74/Scarlett-johansson-006.jpg/revision/latest?cb=20141117203240&path-prefix=pt-br", "serviceProvider_Name": "Scarlett Johansson", "averageReview": 2, "status": 1 }] }, ];

/* Tarefas Agendadas Data Source */
var tarefasAgendadasDS = new kendo.data.DataSource({
    data: agendadas,
    
    transport: {
        read: {
            type: "GET",
            url: url + 'api/customerschedule',
            data: function () {
                return {
                    id: userID,
                    status: TAREFA_AGENDADA
                }
            },
            beforeSend: function (req) {
                req.setRequestHeader('Authorization', 'Bearer ' + access_token);
            }
        }
    },

    schema: {
        data: function (response) {
            return response;
        }
    },

    /*sort: {
        field: "schedules[0].startAt",
        dir: "asc"
    }*/

});


var agendaProfissionalDS = new kendo.data.DataSource({
    transport: {
        read: {
            type: "GET",
            url: url + 'api/ServiceProviderSchedule/15',

            beforeSend: function (req) {
                req.setRequestHeader('Authorization', 'Bearer ' + access_token);
            }
        }
    },

    schema: {
        data: function (response) {
            return response;
        }
    },

    change: function (data) {
        $('.km-loader').hide();
    },

    error: function (e) {
        $('.km-loader').hide();
        if (e.xhr.status == 401) {
            //o token expirou, volta para a tela de login.
            app.navigate("#LoginView");
        };
    }

});

/* data source de teste */
var pendentes = [{ "service_Id": 31, "title": "Tarefa Pendente 1", "description": "Descrição da tarefa Pendente 1.", "status": TAREFA_PENDENTE, "schedules": [{ "schedule_Id": 1, "startAt": "2015-04-20T10:00:00", "endAt": "2015-04-20T11:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-04-15T14:00:00", "endAt": "2015-04-15T16:00:00", "obs": null }], "quotes": [] },
                  { "service_Id": 32, "title": "Tarefa Pendente 2", "description": "Descrição da tarefa Pendente 2.", "status": TAREFA_PENDENTE, "schedules": [{ "schedule_Id": 1, "startAt": "2015-05-15T09:00:00", "endAt": "2015-05-15T10:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-05-15T16:00:00", "endAt": "2015-05-15T18:00:00", "obs": null }], "quotes": [] },
                  { "service_Id": 33, "title": "Tarefa Pendente 3", "description": "Descrição da tarefa Pendente 3.", "status": TAREFA_PENDENTE, "schedules": [{ "schedule_Id": 1, "startAt": "2015-03-18T18:00:00", "endAt": "2015-03-18T19:30:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-03-15T17:00:00", "endAt": "2015-03-15T19:00:00", "obs": null }], "quotes": [] },
                  { "service_Id": 34, "title": "Tarefa Pendente 4", "description": "Descrição da tarefa Pendente 4.", "status": TAREFA_PENDENTE, "schedules": [{ "schedule_Id": 1, "startAt": "2015-06-25T13:00:00", "endAt": "2015-06-25T15:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-06-15T19:00:00", "endAt": "2015-06-15T21:20:00", "obs": null }], "quotes": [] },
                  { "service_Id": 35, "title": "Tarefa Pendente 5", "description": "Descrição da tarefa Pendente 5.", "status": TAREFA_PENDENTE, "schedules": [{ "schedule_Id": 1, "startAt": "2015-05-30T15:00:00", "endAt": "2015-05-30T19:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-05-15T20:00:00", "endAt": "2015-05-15T22:00:00", "obs": null }], "quotes": [] }, ];
/* Tarefas Pendentes (Sem nenhuma proposta de profissional) Data Source */
var tarefasPendentesDS = new kendo.data.DataSource({
    data: pendentes,
    transport: {
        read: {
            type: "GET",
            url: url + 'api/customerschedule',
            data: function () {
                return {
                    id: userID,
                    status: TAREFA_PENDENTE
                }
            },
            beforeSend: function (req) {
                req.setRequestHeader('Authorization', 'Bearer ' + access_token);
            }
        }
    },

    schema: {
        data: function (response) {
            return response;
        }
    },

    /*sort: {
        field: "schedules[0].startAt",
        dir: "asc"
    }*/

});


/* data source de teste */
var concluidas = [{ "service_Id": 41, "title": "Tarefa Concluida 1", "description": "Descrição da tarefa concluida 1.", "status": TAREFA_CONCLUIDA, "review": 2, "selected_quoteId": 1, "schedules": [{ "schedule_Id": 1, "startAt": "2015-04-15T00:00:00", "endAt": "2015-04-15T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-04-15T11:00:00", "endAt": "2015-04-15T12:00:00", "obs": null }], "quotes": [{ "quote_Id": 1, "visitValue": 50, "appointment_Id": 1, "serviceProvider_Id": 1, "serviceProvider_Name": "Deborah Ann Woll", "serviceProvider_Image": "http://www.antonycabeleireiros.com.br/wp-content/uploads/2011/07/Sem-t-25C3-25ADtulo-5.jpg", "averageReview": 5, "status": 1 }] },
                  { "service_Id": 42, "title": "Tarefa Concluida 2", "description": "Descrição da tarefa concluida 2.", "status": TAREFA_CONCLUIDA, "review": 3.4, "selected_quoteId": 1, "schedules": [{ "schedule_Id": 1, "startAt": "2015-04-15T00:00:00", "endAt": "2015-04-15T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-04-15T11:00:00", "endAt": "2015-04-15T12:00:00", "obs": null }], "quotes": [{ "quote_Id": 1, "visitValue": 50, "appointment_Id": 1, "serviceProvider_Id": 2, "serviceProvider_Name": "Charlie Sheen", "serviceProvider_Image": "http://www.soshollywood.com.br/wp-content/uploads/2009/07/charliesheen-1024x775.jpg", "averageReview": 3.5, "status": 1 }] },
                  { "service_Id": 43, "title": "Tarefa Concluida 3", "description": "Descrição da tarefa concluida 3.", "status": TAREFA_CONCLUIDA, "review": 4.6, "selected_quoteId": 1, "schedules": [{ "schedule_Id": 1, "startAt": "2015-04-15T00:00:00", "endAt": "2015-04-15T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-04-15T11:00:00", "endAt": "2015-04-15T12:00:00", "obs": null }], "quotes": [{ "quote_Id": 1, "visitValue": 50, "appointment_Id": 1, "serviceProvider_Id": 3, "serviceProvider_Name": "Jessica Alba", "serviceProvider_Image": "http://i3.mirror.co.uk/incoming/article3920822.ece/ALTERNATES/s1023/Jessica-Alba.png", "averageReview": 4.5, "status": 1 }] },
                  { "service_Id": 44, "title": "Tarefa Concluida 4", "description": "Descrição da tarefa concluida 4.", "status": TAREFA_CONCLUIDA, "review": 5, "selected_quoteId": 1, "schedules": [{ "schedule_Id": 1, "startAt": "2015-04-15T00:00:00", "endAt": "2015-04-15T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-04-15T11:00:00", "endAt": "2015-04-15T12:00:00", "obs": null }], "quotes": [{ "quote_Id": 1, "visitValue": 50, "appointment_Id": 1, "serviceProvider_Id": 4, "serviceProvider_Image": null, "serviceProvider_Name": "Zé Sem Foto", "averageReview": 4.8, "status": 1 }] },
                  { "service_Id": 45, "title": "Tarefa Concluida 5", "description": "Descrição da tarefa concluida 5.", "status": TAREFA_CONCLUIDA, "review": 1.8, "selected_quoteId": 1, "schedules": [{ "schedule_Id": 1, "startAt": "2015-04-15T00:00:00", "endAt": "2015-04-15T00:00:00", "obs": null }, { "schedule_Id": 2, "startAt": "2015-04-15T11:00:00", "endAt": "2015-04-15T12:00:00", "obs": null }], "quotes": [{ "quote_Id": 1, "visitValue": 50, "appointment_Id": 1, "serviceProvider_Id": 5, "serviceProvider_Image": "http://vignette3.wikia.nocookie.net/marvel/images/7/74/Scarlett-johansson-006.jpg/revision/latest?cb=20141117203240&path-prefix=pt-br", "serviceProvider_Name": "Scarlett Johansson", "averageReview": 2, "status": 1 }] }, ];

/* Tarefas concluidas */
var tarefasConcluidasDS = new kendo.data.DataSource({
    data: concluidas,
    
    transport: {
        read: {
            type: "GET",
            url: url + 'api/customerschedule',
            data: function () {
                return {
                    id: userID,
                    status: TAREFA_CONCLUIDA
                }
            },
            beforeSend: function (req) {
                req.setRequestHeader('Authorization', 'Bearer ' + access_token);
            }
        }
    },

    schema: {
        data: function (response) {
            return response;
        }
    }

});


/* data source de teste */
var reviews = [{ "serviceProvider_Id": 1, "name": "Deborah Ann Woll", "image": "http://www.antonycabeleireiros.com.br/wp-content/uploads/2011/07/Sem-t-25C3-25ADtulo-5.jpg", "categorie": "Instalação", "score": 5, "globalScore": 5 },
                { "serviceProvider_Id": 2, "name": "Charlie Sheen", "image": "http://www.soshollywood.com.br/wp-content/uploads/2009/07/charliesheen-1024x775.jpg", "categorie": "Construção", "score": 3.5, "globalScore": 4 },
                { "serviceProvider_Id": 3, "name": "Jessica Alba", "image": "http://i3.mirror.co.uk/incoming/article3920822.ece/ALTERNATES/s1023/Jessica-Alba.png", "categorie": "Encanador", "score": 1.2, "globalScore": 2 },
                { "serviceProvider_Id": 4, "name": "Zé Sem Foto", "categorie": "Hidráulica", "score": 4.8, "globalScore": 5 },
                { "serviceProvider_Id": 5, "name": "Scarlett Johansson", "image": "http://vignette3.wikia.nocookie.net/marvel/images/7/74/Scarlett-johansson-006.jpg/revision/latest?cb=20141117203240&path-prefix=pt-br", "categorie": "Instalção", "score": 2.2, "globalScore": 3 }];
var reviewsDoClienteDS = new kendo.data.DataSource({
    data: reviews,

    transport: {
        read: {
            type: "GET",
            url: function () { return url + 'api/ServiceReview/' + userID },
            beforeSend: function (req) {
                req.setRequestHeader('Authorization', 'Bearer ' + access_token);
            }
        }
    },

    schema: {
        data: function (response) {
            return response;
        }
    },
});