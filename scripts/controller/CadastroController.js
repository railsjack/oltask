(function ($, console, doc) {

    window.CadastroModel = kendo.observable({
        externalProvider: null,
        externalAccessToken: null,
        novoUsuario: {},

        reset: function() {
            this.set("externalProvider", null);
            this.set("externalAccessToken", null);
            this.set("novoUsuario", {});
        },

        initCadastroCliente: function () {
            var estados = $('#cadastroClienteForm #estados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: estadosDS,

            }).data("kendoDropDownList");

            var cidades = $('#cadastroClienteForm #cidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "estados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: cidadesDS,
            }).data("kendoDropDownList");

            var bairros = $('#cadastroClienteForm #bairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: bairrosDS,
            }).data("kendoDropDownList");
        },

        cadastraCliente: function (e) {
            var validator = $("#cadastroClienteForm").kendoValidator().data("kendoValidator");
            //if (validator.validate()) {
                if (!$("#cadastroClienteForm #checkboxTermosDeUso").is(":checked")) {
                    alert("Aceite os termos de uso.");
                    return;
                }

                this.novoUsuario.set("username", this.novoUsuario.Email);
                this.novoUsuario.set("Role", ROLE_CLIENTE);

                if (this.externalProvider == null) {
                    doCadastro(this.novoUsuario, ROLE_CLIENTE);
                } else {
                    doCadastroExterno(this.novoUsuario, ROLE_CLIENTE, this.externalProvider, this.externalAccessToken);
                }
            //} else {
            //    alert("Preencha os campos")
            //}
        },

        categorias: categoriasProfissionalDS,

        initCadastroProfissional: function () {
            var estados = $('#cadastroProfissionalForm #estados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: estados,
            }).data("kendoDropDownList");

            var cidades = $('#cadastroProfissionalForm #cidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "estados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: cidades,
            }).data("kendoDropDownList");

            var bairros = $('#cadastroProfissionalForm #bairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: bairros,
            }).data("kendoDropDownList");
        },

        cadastraProfissional: function (e) {
            CadastroProfissionalModel.novoProfissional.set("username", CadastroProfissionalModel.novoProfissional.Email);
            CadastroProfissionalModel.novoProfissional.set("Role", 2);
            CadastroProfissionalModel.novoProfissional.set("Gender", $("#cadastroProfissionalForm #gender").val());
            var novoProfissional = JSON.stringify(this.novoProfissional);
            $("#cadastro-profissional-categorias input:checked").each(function () {
                alert($(this).val());
            });


            //doCadastro(novoProfissional, 2);
        },

        initCadastroParceiro: function() {
            var estados = $('#cadastroParceiroForm #estados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: estadosDS,

            }).data("kendoDropDownList");

            var cidades = $('#cadastroParceiroForm #cidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "estados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: cidadesDS,
            }).data("kendoDropDownList");

            var bairros = $('#cadastroParceiroForm #bairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: bairrosDS,
            }).data("kendoDropDownList");
        },

        cadastraParceiro: function() {
            var validator = $("#cadastroParceiroForm").kendoValidator().data("kendoValidator");
            //if (validator.validate()) {
            if (!$("#cadastroParceiroForm #checkboxTermosDeUso").is(":checked")) {
                alert("Aceite os termos de uso.");
                return;
            }

            this.novoUsuario.set("username", this.novoUsuario.Email);
            this.novoUsuario.set("Role", ROLE_PARCEIRO);

            if (this.externalProvider == null) {
                doCadastro(this.novoUsuario, ROLE_PARCEIRO);
            } else {
                doCadastroExterno(this.novoUsuario, ROLE_PARCEIRO, this.externalProvider, this.externalAccessToken);
            }
            //} else {
            //    alert("Preencha os campos")
            //}
        },

        logar: function () {
            if (this.externalProvider == null) {
                obtainAccessToken("password", this.novoUsuario.username, this.novoUsuario.password, false);
            } else {
                externalLogin(this.externalAccessToken, this.externalProvider, null);
            }
        }

    });

    window.CadastroProfissionalModel = kendo.observable({
        categorias: categoriasProfissionalDS,

        estados: estadosDS,

        cidades: cidadesDS,

        bairros: bairrosDS,

        init: function () {
            var estados = $('#cadastroProfissionalForm #estados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: CadastroProfissionalModel.estados,
            }).data("kendoDropDownList");

            var cidades = $('#cadastroProfissionalForm #cidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "estados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: CadastroProfissionalModel.cidades,
            }).data("kendoDropDownList");

            var bairros = $('#cadastroProfissionalForm #bairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: CadastroProfissionalModel.bairros,
            }).data("kendoDropDownList");
        },

        show: function () {
        },

        cadastrar: function (e) {
            CadastroProfissionalModel.novoProfissional.set("username", CadastroProfissionalModel.novoProfissional.Email);
            CadastroProfissionalModel.novoProfissional.set("Role", 2);
            CadastroProfissionalModel.novoProfissional.set("Gender", $("#cadastroProfissionalForm #gender").val());
            var novoProfissional = JSON.stringify(this.novoProfissional);
            $("#cadastro-profissional-categorias input:checked").each(function () {
               alert( $(this).val());
            });


            //doCadastro(novoProfissional, 2);
        },

        logar: function () {
            doLogin("password", CadastroProfissionalModel.novoProfissional.username, CadastroProfissionalModel.novoProfissional.password);
        }

    });

    function doCadastro(user, role) {
        //alert(JSON.stringify(user));
        //return;
        app.showLoading();
        $.ajax({
            url: url + '/api/account/register',
            type: "POST",
            data: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' },
            success: function (data) {
                app.hideLoading();
                if (role === ROLE_CLIENTE) {
                    app.navigate("views/cliente/cadastroComSucesso.html");
                } else if (role === ROLE_PROFISSIONAL) {
                    app.navigate("views/profissional/cadastroComSucesso.html");
                } else if (role === ROLE_PARCEIRO) {
                    app.navigate("views/parceiro/cadastroComSucesso.html");
                }
                return false;
            },
            error: function (msg) {
                app.hideLoading();
                alert("Opss ocorreu um erro :(");
                return false;
            }
        });
    };

    function doCadastroExterno(user, role, provider, externalToken) {
        user.Provider = provider;
        user.externalAccessToken = externalToken;
        //alert(JSON.stringify(user));
        //return;
        app.showLoading();
        $.ajax({
            url: url + '/api/account/registerexternal',
            type: "POST",
            data: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' },
            success: function (data) {
                app.hideLoading();
                if (role === ROLE_CLIENTE) {
                    app.navigate("views/cliente/cadastroComSucesso.html");
                } else if (role === ROLE_PROFISSIONAL) {
                    app.navigate("views/profissional/cadastroComSucesso.html");
                } else if (role === ROLE_PARCEIRO) {
                    app.navigate("views/parceiro/cadastroComSucesso.html");
                }
                return false;
            },
            error: function (msg) {
                app.hideLoading();
                alert("Opss ocorreu um erro :(");
                return false;
            }
        });
    }

})(jQuery, console, document);