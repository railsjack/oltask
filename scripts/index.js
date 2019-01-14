var access_token;
var url = 'http://consvita.w06.wh-2.com/oltaskapi/api/';
(function () {
    
    var TAREFA_CONCLUIDA = 1, TAREFA_PENDENTE = 2, TAREFA_AGUARDANDO = 3, TAREFA_AGENDADA = 4, TAREFA_CANCELADA = 5;
    var PROFISSIONAL = 3, CLIENTE = 2, PARCEIRO = 1;

    var userName, userID, userRole;
    var app,  inAppBrowserRef;
    var cadastroGender, cadastroFirstName, cadastroLastName, cadastroEmail;
    var initialView = "LoginView";

    document.addEventListener("deviceready", function () {
        access_token = localStorage.getItem("token");
        userName = localStorage.getItem("userName");
        userID = localStorage.getItem("userID");
        userRole = localStorage.getItem("userRole");

        if (access_token != null && userID != null && userName != null && userRole != null) {
            if (userRole === 3) {
                initialView = "UI/cliente/main.html";
            } else if (userRole === 2) {
                initialView = "UI/profissional/agendaDeTarefas.html";
            }
        };

        /*
        * Register a handler that detects redirects and
        * lets JSO to detect incomming OAuth responses and deal with the content.
        */
        jso_registerRedirectHandler(function (url) {
            window.$windowScope = window.auth;
            inAppBrowserRef = window.open(url, "_blank");
            inAppBrowserRef.addEventListener('loadstop', function (e) { LocationChange(e.url) }, false);
        });
        function LocationChange(url) {
            console.log("in location change");
            url = decodeURIComponent(url);
            console.log("Checking location: " + url);

            jso_checkfortoken('facebook', url, function () {
                console.log("Closing InAppBrowser, because a valid response was detected.");
                inAppBrowserRef.close();
            });
        };
    
        var fbButton = document.getElementById("fbButton");
        var googleButton = document.getElementById("googleButton");

        fbButton.addEventListener("click", function () {
            /*
            * Configure the OAuth providers to use.
            */
            jso_configure({
                "facebook": {
                    client_id: "813572795401298",
                    //redirect_uri: "http://www.facebook.com/connect/login_success.html",
                    redirect_uri:"http://consvita.w06.wh-2.com/sociallogin/authcomplete2.html",
                    authorization: "https://www.facebook.com/dialog/oauth",
                    presenttoken: "qs"
                }
            }, { "debug": true });

            // jso_dump displays a list of cached tokens using outputlog if debugging is enabled.
            jso_dump();

            $.oajax({
                url: "https://graph.facebook.com/me",
                jso_provider: "facebook",
                jso_scopes: ["user_about_me", "publish_stream","email"],
                jso_allowia: true,
                dataType: 'json',
                success: function (response) {
                    alert(JSON.stringify(response));
                    //alert(jso_getToken("facebook", ["user_about_me", "publish_stream", "email"]));
                    //cadastroEmail = data.email;
                    //cadastroFirstName = data.first_name;
                    //cadastroLastName = data.last_name;
                    //cadastroGender = data.gender;
                    //app.navigate('UI/cliente/main.html');
                }
            });
            
        });

        googleButton.addEventListener("click", function () {
            jso_configure({
                "google": {
                    client_id: "935227833100-moj5b1tr5187tekfng1k7oseqhnm7vk9.apps.googleusercontent.com",
                    client_secret: 'ZrIkMiPyL98-NzjvvGcvZ8gv',
                    redirect_uri: "http://www.facebook.com/connect/login_success.html",
                    authorization: "https://accounts.google.com/o/oauth2/auth",
                    scopes: { request: ["https://www.googleapis.com/auth/userinfo.profile"] }
                }
            }, { "debug": true });

            jso_dump();
            $.oajax({
                url: "https://www.googleapis.com/oauth2/v1/userinfo",
                jso_provider: "google",
                jso_scopes: ["https://www.googleapis.com/auth/userinfo.email"],
                jso_allowia: true,
                dataType: 'json',
                success: function (data) {
                    alert(jso_getToken("google", ["https://www.googleapis.com/auth/userinfo.email"]));
                }
            });
        });

        //inicia a aplicação
        app = new kendo.mobile.Application(document.body, {
            skin: "flat", layout: "default-layout", transition: "fade", initial: initialView
        });

        navigator.splashscreen.hide();

    }, 'false');   

   //document.addEventListener("backbutton", function (e) {

        //Get pathname / url
        //var pathname = window.location.pathname;

        //If the pathname / url corresponds to your homepage's one:
       // if (pathname == homepage_pathname) {
        //e.preventDefault();
        //alert(window.location.pathname);
        //}
        //else {
            //navigator.app.backHistory();
        //}
    //}, false);

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

    function ajustaDialogHeight(modal) {
        //Get header height.
        var height = modal.find('div.km-header').outerHeight(true);
        //Get all direct descendants of the km-scroll-container that are visible and add their heights.
        $.each(modal.find('div.km-scroll-container > *'), function (index, elem) {
            var jqElem = $(elem);
            if (jqElem.is(":visible")) {
                height += jqElem.outerHeight(true);
            }
        });
        //Dynamically resize the dialog's height.
        modal.height(height);
        modal.parent().parent().height(height);
    }

    function doLogin(grantType, userName, password, showError) {
        $('.km-loader').show();
        $.ajax({
            url: url + 'token',
            type: "POST",
            data: 'grant_type=' + grantType + '&username=' + userName + '&password=' + password,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            success: function (data) {
                access_token = data.access_token;
                localStorage.setItem("token", access_token);
                localStorage.setItem("userName", userName);

                $.ajax({
                    url: url + 'api/account/?username=' + 'kevin',
                    type: "GET",
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    success: function (data) {
                        userID = data.id;
                        userRole = data.aspNetRoleId;
                        localStorage.setItem("userID", userID);
                        localStorage.setItem("userRole", userRole);
                        $('.km-loader').hide();
                        if (userRole === CLIENTE) {
                            $('body').addClass('cliente');
                            $('body').removeClass('profissional');
                            app.navigate('UI/cliente/main.html');
                        } else if (userRole === PROFISSIONAL) {
                            $('body').removeClass('cliente');
                            $('body').addClass('profissional');
                            app.navigate('UI/profissional/agendaDeTarefas.html');
                        } else if (userRole === PARCEIRO) {

                        }
                    },
                    error: function () {
                        $('.km-loader').hide();
                        if (!showError)
                            app.navigate("#LoginView");
                    }
                });
            },

            error: function (msg) {
                $('.km-loader').hide();
                if (showError) {
                    navigator.notification.alert("Login ou Senha inválida.", null, "Aviso", "OK");
                } else {
                    app.navigate("#LoginView");
                }
            }
        });
    };

    function doCadastro(user, role) {
        $('.km-loader').show();
        $.ajax({
            url: url + '/api/account/register',
            type: "POST",
            data: user,
            headers: { 'Content-Type': 'application/json' }, //, 'Authorization': 'Bearer ' + access_token 
            success: function (data) {
                $('.km-loader').hide();
                if (role === 3) {
                    app.navigate("UI/cliente/cadastroComSucesso.html");
                } else if (role === 2) {
                    app.navigate("UI/profissional/cadastroComSucesso.html");
                }
                return false;
            },
            error: function (msg) {
                $('.km-loader').hide();
                alert("Opss ocorreu um erro :( "+msg.stringify);
                return false;
            }
        });
    }

    window.LoginModel = kendo.observable({
        login: function () {
            var validator = $("#loginForm").data("kendoValidator");

            if (!validator.validate()) {
                navigator.notification.alert("Preencha o Login e a Senha.", null, "Aviso", "OK");
                return false;
            }

            doLogin("password", LoginModel.username, LoginModel.password, true);
        }
    });

    window.CadastroClienteModel = kendo.observable({
        estados: estadosDS,

        cidades: cidadesDS,

        bairros: bairrosDS,

        novoCliente: {
        },

        init: function() {
            var estados = $('#cadastroClienteForm #estados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: NovaTarefa.estados,
            }).data("kendoDropDownList");

            var cidades = $('#cadastroClienteForm #cidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "estados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: NovaTarefa.cidades,
            }).data("kendoDropDownList");

            var bairros = $('#cadastroClienteForm #bairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: NovaTarefa.bairros,
            }).data("kendoDropDownList");
        },

        show: function () {
        },

        cadastrar: function (e) {
            var validator = $("#cadastroClienteForm").kendoValidator().data("kendoValidator");
            if (validator.validate()) {
                if (!$("#cadastroClienteCheckboxTermosDeUso").is(":checked")) {
                    alert("Aceite os termos de uso.");
                    return;
                }
                CadastroClienteModel.novoCliente.set("username", CadastroClienteModel.novoCliente.Email);
                CadastroClienteModel.novoCliente.set("Role", 3);

                var novoCliente = JSON.stringify(this.novoCliente);
                doCadastro(novoCliente, 3);
            } else {
                alert("Preencha os campos")
            }
        },

        logar: function () {
            doLogin("password", CadastroClienteModel.novoCliente.username, CadastroClienteModel.novoCliente.password);
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

    window.CadastroProfissionalModel = kendo.observable({
        categoriasProfissional: categoriasProfissionalDS,

        estados: estadosDS,

        cidades: cidadesDS,

        bairros: bairrosDS,

        novoProfissional: {
        },

        init: function () {
            var estados = $('#cadastroProfissionalForm #estados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: NovaTarefa.estados,
            }).data("kendoDropDownList");

            var cidades = $('#cadastroProfissionalForm #cidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "estados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: NovaTarefa.cidades,
            }).data("kendoDropDownList");

            var bairros = $('#cadastroProfissionalForm #bairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: NovaTarefa.bairros,
            }).data("kendoDropDownList");
        },

        show: function () {
        },

        cadastrar: function (e) {
            CadastroProfissionalModel.novoProfissional.set("username", CadastroProfissionalModel.novoProfissional.Email);
            CadastroProfissionalModel.novoProfissional.set("Role", 2);
            CadastroProfissionalModel.novoProfissional.set("Gender", $("#cadastroProfissionalForm #gender").val());
            var novoProfissional = JSON.stringify(this.novoProfissional);
            $("#cadastroProfissionalForm input[name=categorie]:checked").each(function (){
                alert($(this).val());
            });
            
            //doCadastro(novoProfissional, 2);
        },

        logar: function () {
            doLogin("password", CadastroProfissionalModel.novoProfissional.username, CadastroProfissionalModel.novoProfissional.password);
        }

    });

    window.NovaTarefa = kendo.observable({

        estados: estadosDS,

        cidades: cidadesDS,

        bairros: bairrosDS,

        categoriasDeTarefaDS: new kendo.data.DataSource({
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
        }),

        novaTarefa: {
        },

        init : function() {
            var estados = $('#novaTarefaForm #estados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: NovaTarefa.estados,
            }).data("kendoDropDownList");

            var cidades = $('#novaTarefaForm #cidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "estados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: NovaTarefa.cidades,
            }).data("kendoDropDownList");

            var bairros = $('#novaTarefaForm #bairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: NovaTarefa.bairros,
            }).data("kendoDropDownList");

            $('#novaTarefaForm #categorias').kendoDropDownList({
                optionLabel: "Selecione a categoria...",
                dataTextField: "categorie",
                dataValueField: "categorie_Id",
                dataSource: NovaTarefa.categoriasDeTarefaDS,
            });
        },

        show: function () {
            NovaTarefa.set("novaTarefa", {
                Service: {},
                Schedules: [{
                    StartAt: "1/1/2015",
                    EntAt: "1/1/2015",
                    Scheduled: 1
                }, {
                    StartAt: "1/1/2015",
                    EntAt: "1/1/2015",
                    Scheduled: 1
                }],
                Address: {}
            });
        },

        publicar: function () {
            var validator = $("#novaTarefaForm").kendoValidator().data("kendoValidator");
            if (validator.validate()) {
                this.novaTarefa.Service.set("Customer_Id", userID);
                this.novaTarefa.Service.set("Categorie_Id", $('#categorias').val());
                this.novaTarefa.Service.set("Status", TAREFA_PENDENTE);
                this.novaTarefa.Address.set("Neighborhood_Id", $('#bairros').val());
                var dataInicio1 = new Date($('#data').val() + ' ' + $('#horaInicio1').val());
                var dataFim1 = new Date($('#data').val() + ' ' + $('#horaFim1').val());
                var dataInicio2 = new Date($('#data').val() + ' ' + $('#horaInicio2').val());
                var dataFim2 = new Date($('#data').val() + ' ' + $('#horaFim2').val());
                this.novaTarefa.Schedules[0].set("StartAt", dataInicio1);
                this.novaTarefa.Schedules[0].set("EntAt", dataFim1);
                this.novaTarefa.Schedules[1].set("StartAt", dataInicio2);
                this.novaTarefa.Schedules[1].set("EntAt", dataFim2);
                var novaTarefa = JSON.stringify(this.novaTarefa);

                $('.km-loader').show();
                $.ajax({
                    url: url + 'api/ServiceScheduleAddress',
                    type: "POST",
                    data: novaTarefa,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                    success: function (data) {
                        var tarefa = { title: NovaTarefa.novaTarefa.Service.Title, description: NovaTarefa.novaTarefa.Service.Description, schedules : NovaTarefa.novaTarefa.Schedules }
                        tarefasPendentesDS.add(tarefa);
                        $('.km-loader').hide();
                        app.navigate('UI/cliente/main.html');
                        return false;
                    },
                    error: function (msg) {
                        navigator.notification.alert("Ocorreu um Erro.", null, "Aviso", "OK");
                        $('.km-loader').hide();
                        return false;
                    }
                });
            } else {
                navigator.notification.alert("Preencha todos os campos.", null, "Aviso", "OK");
            };
        }

    });

    

    /* Tarefas Aguardando Data Source */
    var tarefasAguardandoEscolhaDS = new kendo.data.DataSource({
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

    /* Tarefas Agendadas Data Source */
    var tarefasAgendadasDS = new kendo.data.DataSource({
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

    /* Tarefas Pendentes Data Source */
    var tarefasPendentesDS = new kendo.data.DataSource({
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

    var tarefasConcluidasDS = new kendo.data.DataSource({
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

    window.ClienteMainModel = kendo.observable({
        data: tarefasAguardandoEscolhaDS,

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

            AgendamentoModel.set("tarefa", tarefa);
            AgendamentoModel.set("quote", quote);
            AgendamentoModel.set("schedule", schedule);
            app.navigate('UI/cliente/agendamento.html');
        }

    });

    window.AgendamentoModel = kendo.observable({
        tarefa: null,
        quote: null,
        schedule: null,
        data: function () {
            if (AgendamentoModel.get("schedule") != null) {
                return "Data: " + kendo.toString(kendo.parseDate(AgendamentoModel.schedule.startAt), "dd/MM/yyyy");
            }
            return null;
        },
        horario: function() {
            if (AgendamentoModel.get("schedule") != null) {
                return "Horário: " + kendo.toString(kendo.parseDate(AgendamentoModel.schedule.startAt), "HH':'mm")
                + " às " + kendo.toString(kendo.parseDate(AgendamentoModel.schedule.endAt), "HH':'mm");
            }
            return null;
        },
        valor: function () {
            if (AgendamentoModel.get("quote") != null) {
                return "Valor R$ " + kendo.toString(AgendamentoModel.quote.visitValue, "0.00");
            }
            return null;
        }
    });
 
    window.TarefasModel = kendo.observable({

        tarefasAgendadas: tarefasAgendadasDS,

        tarefasPendentes: tarefasPendentesDS,

        tarefasConcluidas: tarefasConcluidasDS,

        tarefaAgendada: null,

        init: function() {
            _agendadasElem  = $("#agendadas");
            _pendentesElem  = $("#pendentes");
            _concluidasElem = $("#concluidas");


            $("#btnTarefasViewToggle").data("kendoMobileButtonGroup").bind("select", function (e) {
                TarefasModel.tarefasViewChanged(e.sender.selectedIndex);
            });
        },

        show: function () {
            TarefasModel.tarefasViewChanged($("#btnTarefasViewToggle").data("kendoMobileButtonGroup").current().index());
        },

        edit: function (e) {
            var tasksStatus = e.target.attr("data-status");
            var dataSet;
            if (tasksStatus == 2)
                dataSet = tarefasPendentesDS.view();
            else
                dataSet = tarefasAgendadasDS.view();

            var curID;
            curID = e.target.attr("data-taskId");

            for (var i = 0; i < dataSet.length; i++) {
                if (dataSet[i].service_Id == curID) {
                    TarefasModel.set("tarefaAgendada", dataSet[i]);
                    break;
                }
            };

            //ajusta o tamanho do modal dinamicamente
            var modal = $("#modalview-publicarTarefa");
            ajustaDialogHeight(modal);

            var data = kendo.toString(kendo.parseDate(TarefasModel.tarefaAgendada.schedules[0].startAt), "yyyy-MM-dd");
            var horaInicio1 = kendo.toString(kendo.parseDate(TarefasModel.tarefaAgendada.schedules[0].startAt), "HH':'mm");
            var horaFim1 = kendo.toString(kendo.parseDate(TarefasModel.tarefaAgendada.schedules[0].endAt), "HH':'mm");
            var horaInicio2 = kendo.toString(kendo.parseDate(TarefasModel.tarefaAgendada.schedules[1].startAt), "HH':'mm");
            var horaFim2 = kendo.toString(kendo.parseDate(TarefasModel.tarefaAgendada.schedules[1].endAt), "HH':'mm");
            $('#modalview-publicarTarefa #data').val(data);
            $('#modalview-publicarTarefa #horaInicio1').val(horaInicio1);
            $('#modalview-publicarTarefa #horaFim1').val(horaFim1);
            $('#modalview-publicarTarefa #horaInicio2').val(horaInicio2);
            $('#modalview-publicarTarefa #horaFim2').val(horaFim2);
        },

        republicar: function (e) {
            alert(TarefasModel.tarefaAgendada.schedules[0].startAt);
        },

        tarefasViewChanged: function (index) {
            var isAgendadas = (index === 0);
            var isPendentes = (index === 1);

            $('.km-content:visible').data('kendoMobileScroller').reset();
            $("#tarefasView").find(".km-scroller-pull").remove();

            if (isAgendadas) {
                mostraTarefasAgendadas();
            } else if (isPendentes) {
                mostraTarefasPendentes();
            } else {
                mostraTarefasConcluidas();
            }
        }

    });

    window.AvaliacaoModel = kendo.observable({
        tarefa: null,

        quote: null,

        schedule: null,

        date: function () {
            if (AvaliacaoModel.get('schedule') != null)
                return kendo.toString(kendo.parseDate(AvaliacaoModel.schedule.startAt), "dd/MM/yyyy") + " | " +
                   kendo.toString(kendo.parseDate(AvaliacaoModel.schedule.startAt), "HH':'mm") + " às " +
                   kendo.toString(kendo.parseDate(AvaliacaoModel.schedule.endAt), "HH':'mm");
            return "";
        },

        visitValue: function() {
            if (AvaliacaoModel.get('schedule') != null) {
                var teste = kendo.toString(AvaliacaoModel.quote.visitValue, "0.00");
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

            AvaliacaoModel.set("tarefa", null);
            AvaliacaoModel.set("quote", null);
            AvaliacaoModel.set("schedule", null);

            for (var i = 0; i < dataSet.length; i++) {
                if (dataSet[i].service_Id == taskId) {
                    AvaliacaoModel.set("tarefa", dataSet[i]);
                    break;
                }
            };

            if (AvaliacaoModel.tarefa != null) {
                for (var i = 0; i < AvaliacaoModel.tarefa.quotes.length; i++) {
                    if (AvaliacaoModel.tarefa.quotes[i].quote_Id == quoteId) {
                        AvaliacaoModel.set("quote", AvaliacaoModel.tarefa.quotes[i]);
                    }
                }
                for (var i = 0; i < AvaliacaoModel.tarefa.schedules.length; i++) {
                    if (AvaliacaoModel.tarefa.schedules[i].schedule_Id == scheduleId) {
                        AvaliacaoModel.set("schedule", AvaliacaoModel.tarefa.schedules[i]);
                    }
                }
            }

            if (AvaliacaoModel.tarefa != null && AvaliacaoModel.quote != null && AvaliacaoModel.schedule != null) {
                //AvaliacaoModel.set("quote.serviceProvider_Name", "lolzin");
                //tarefasAgendadasDS.cancelChanges();
            } else {
                app.navigate("#:back");
            }
        }
    });

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

        showCartao: function (providerId) {
            $('.km-loader').show();
            $.ajax({
                url: url + 'api/ServiceProviders/'+providerId,
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
            });
        },
    });

    function onClienteMainShow() {
        var agendaBadge = $('#agendaBadge');
        var tarefasPublicadasBadge = $('#tarefasPublicadasBadge');
        var negociosFechadosBadge = $('#negociosFechadosBadge');

        if (tarefasAguardandoEscolhaDS.data().length === 0) {
            $('.km-loader').show();
            tarefasAguardandoEscolhaDS.read();
        };

        $.ajax({
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
        });
    };

    function mostraTarefasAgendadas() {
        _agendadasElem.show();
        _pendentesElem.hide();
        _concluidasElem.hide();

        //remove o wrapper que esta sendo recriado toda vez que a lista é criada
        if ($("#agendadas-list").parent().hasClass("km-listview-wrapper")) {
            var content = $("#agendadas-list").parent();
            var parent = content.parent();
            content.remove();
            parent.append(content.html());
        };

        $("#agendadas-list").kendoMobileListView({
            dataSource: tarefasAgendadasDS,
            template: $("#agendadas-template").text(),
            pullToRefresh: true,
            autoBind: false
        });

        if (tarefasAgendadasDS.data().length === 0) {
            $('.km-loader').show();
            tarefasAgendadasDS.read();
        } else {
            $('#agendadas-list').data('kendoMobileListView').refresh();
        }
    };

    function mostraTarefasPendentes() {
        _agendadasElem.hide();
        _pendentesElem.show();
        _concluidasElem.hide();

        //remove o wrapper que esta sendo recriado toda vez que a lista é criada
        if ($("#pendentes-list").parent().hasClass("km-listview-wrapper")) {
            var content = $("#pendentes-list").parent();
            var parent = content.parent();
            content.remove();
            parent.append(content.html());
        };

        $("#pendentes-list").kendoMobileListView({
            dataSource: tarefasPendentesDS,
            template: $("#pendentes-template").text(),
            pullToRefresh: true,
            autoBind: false
        });

        if (tarefasPendentesDS.data().length === 0) {
            $('.km-loader').show();
            tarefasPendentesDS.read();
        } else {
            $('#pendentes-list').data('kendoMobileListView').refresh();
        }
    }

    function mostraTarefasConcluidas() {
        _agendadasElem.hide();
        _pendentesElem.hide();
        _concluidasElem.show();

        //remove o wrapper que esta sendo recriado toda vez que a lista é criada
        if ($("#concluidas-list").parent().hasClass("km-listview-wrapper")) {
            var content = $("#concluidas-list").parent();
            var parent = content.parent();
            content.remove();
            parent.append(content.html())
        };

        $("#concluidas-list").kendoMobileListView({
            dataSource: tarefasConcluidasDS,
            template: $("#concluidas-template").text(),
            pullToRefresh: true,
            autoBind: false
        });

        if (tarefasConcluidasDS.data().length === 0) {
            $('.km-loader').show();
            tarefasConcluidasDS.read();
        } else {
            $('#concluidas-list').data('kendoMobileListView').refresh();
        }
    };

    function onBack(e) {
        e.preventDefault();
        setTimeout((function () {
            app.navigate("#:back");
        }), 100);
    }

    function logout() {
        localStorage.clear();
        app.navigate("#LoginView");
    };

    $.extend(window, {
        onCadastroClienteInit: CadastroClienteModel.init,
        onCadastroClienteShow: CadastroClienteModel.show,

        onCadastroProfissionalInit: CadastroProfissionalModel.init,
        onCadastroProfissionalShow: CadastroProfissionalModel.show,

        onClienteMainShow: onClienteMainShow,

        onTarefasInit: TarefasModel.init,
        onTarefasShow: TarefasModel.show,

        onNovaTarefaInit: NovaTarefa.init,
        onNovaTarefaShow: NovaTarefa.show,

        onAvaliacaoInit: AvaliacaoModel.init,
        onAvaliacaoShow: AvaliacaoModel.show,

        onBack: onBack,
        logout: logout
    });

}());

function teste() {
    alert("poxa vida");
};

function findQuoteById(array, id) {
    for (i = 0; i < array.length; i++) {
        return array[i];
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
