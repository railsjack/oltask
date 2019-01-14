(function ($, console, doc) {

    window.ClienteConfiguracoesModel = kendo.observable({
        /*account: {
            state_Id: 1,
            state_name: "Metro Manila",
            city_Id: 44,
            city_name: "Foz do Iguaçu",
            neighborhood_Id: 16,
            neighborhood_name: "Centro",
            birthday: "1988-05-07",
            email: "josé@hotmail.com",
            phone: "99999999",
            cel: "99999999"
        },*/
        account: {},

        password: null,

        newPassword: null,

        confirmNewPassword: null,

        formattedBirthday: function () {
            if (this.get("account") != null && this.get("account.birthday") != null) {
                return kendo.toString(kendo.parseDate(this.get("account.birthday")), "D");
            }
            return "";
        },

        init: function () {
            ClienteConfiguracoesModel.set("account", account);
            var estados = $('#clienteConfiguracoesView [name=estado]').val(ClienteConfiguracoesModel.account.state_Id).kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: estadosDS,
            }).data("kendoDropDownList");

            var cidades = $('#clienteConfiguracoesView [name=cidade]').val(ClienteConfiguracoesModel.account.city_Id).kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "clienteConfigEstados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: cidadesDS,
            }).data("kendoDropDownList");

            var bairros = $('#clienteConfiguracoesView [name=bairro]').val(ClienteConfiguracoesModel.account.neighborhood_Id).kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "clienteConfigCidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: bairrosDS,
            }).data("kendoDropDownList");  
        },

        reseta: function() {
            this.set("password", null);
            this.set("newPassword", null);
            this.set("confirmNewPassword", null);
        },

        editingAccount: false,

        editarAccount: function () {
            this.set("editingAccount", true);

            $('#clienteConfiguracoesView [name=estado]').data("kendoDropDownList").select(function (dataItem) {
                return dataItem.state_Id === this.account.state_Id;
            });
            $('#clienteConfiguracoesView [name=cidade]').data("kendoDropDownList").select(function (dataItem) {
                return dataItem.city_Id === this.account.city_Id;
            });
            $('#clienteConfiguracoesView [name=bairro]').data("kendoDropDownList").select(function (dataItem) {
                return dataItem.neighborhood_Id === this.account.neighborhood_Id;
            });
           
            $("#clienteConfiguracoesView [name=birthday]").val(this.account.birthday);
            $("#clienteConfiguracoesView [name=email]").val(this.account.email);
            $("#clienteConfiguracoesView [name=phone]").val(this.account.phone);
            $("#clienteConfiguracoesView [name=cel]").val(this.account.cel);
        },

        cancelar: function() {
            this.set("editingAccount", false);
        },

        showConfirmDialog: function () {
            this.reseta();
            var modal = $("#modalview-alterarDadosConfirmacao");
            modal.kendoMobileModalView("open");
            ajustaDialogHeight(modal);
        },

        closeConfirmDialog: function() {
            var modal = $("#modalview-alterarDadosConfirmacao");
            modal.kendoMobileModalView("close");
        },

        salvarAccount: function() {
            var estadoDropDownList = $('#clienteConfiguracoesView [name=estado]').data("kendoDropDownList");
            this.set("account.state_Id", estadoDropDownList.dataItem().state_Id);
            this.set("account.state_name", estadoDropDownList.dataItem().state1);
            var cidadeDropDownList = $('#clienteConfiguracoesView [name=cidade]').data("kendoDropDownList");
            this.set("account.city_Id", cidadeDropDownList.dataItem().city_Id);
            this.set("account.city_name", cidadeDropDownList.dataItem().city1);
            var bairroDropDownList = $('#clienteConfiguracoesView [name=bairro]').data("kendoDropDownList");
            this.set("account.neighborhood_Id", bairroDropDownList.dataItem().neighborhood_Id);
            this.set("account.neighborhood_name", bairroDropDownList.dataItem().neighborhood1);

            this.set("account.birthday", $("#clienteConfiguracoesView [name=birthday]").val());
            this.set("account.email", $("#clienteConfiguracoesView [name=email]").val());
            this.set("account.phone", $("#clienteConfiguracoesView [name=phone]").val());
            this.set("account.cel", $("#clienteConfiguracoesView [name=cel]").val());

            atualizaAccount();
        },

        showAlterarSenhaDialog: function () {
            this.reseta();
            var modal = $("#modalview-alterarSenha");
            modal.kendoMobileModalView("open");
            ajustaDialogHeight(modal);
        },

        closeAlterarSenhaDialog: function () {
            var modal = $("#modalview-alterarSenha");
            modal.kendoMobileModalView("close");
        },

        alterarSenha: function () {
            var validator = $("#alterarSenhaForm").kendoValidator({
                rules: {
                    equal: function (input) {
                        if (input.is("[data-equal-msg]") && input.val() != null) {
                            var value = input.val(),
                                        otherValue = $("#alterarSenhaForm [name='" + input.data("equal-field") + "']").val();
                            return otherValue != null && value === otherValue;
                        }
                        return true;
                    }
                }
            }).data("kendoValidator");

            if (validator.validate()) {
                atualizaSenha();
            };
        }
    });

    function atualizaAccount() {
        alert(ClienteConfiguracoesModel.password);
    };

    function atualizaSenha() {
        var changePasswordJson = {
            UserName : ClienteConfiguracoesModel.account.userName,
            OldPassword : ClienteConfiguracoesModel.password,
            NewPassword : ClienteConfiguracoesModel.newPassword,
            ConfirmPassword : ClienteConfiguracoesModel.confirmNewPassword
        }

        app.showLoading();
        $.ajax({
            url: url + '/api/account/ChangePassword',
            type: "POST",
            data: JSON.stringify(changePasswordJson),
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
            success: function (data) {
                navigator.notification.alert("Sua senha foi alterada com sucesso.", null, "Aviso", "OK");
                ClienteConfiguracoesModel.closeAlterarSenhaDialog();
                app.hideLoading();
            },
            error: function (response) {
                navigator.notification.alert("A senha está está incorreta", null, "Erro", "OK");
                app.hideLoading();
            }
        });
    }

})(jQuery, console, document);
