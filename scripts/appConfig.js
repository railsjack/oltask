var url = 'http://consvita.w06.wh-2.com/oltaskapi/api/';

var TAREFA_CONCLUIDA = 1;
var TAREFA_PENDENTE = 2;
var TAREFA_AGUARDANDO_ESCOLHA = 3; 
var TAREFA_AGENDADA = 4;
var TAREFA_CANCELADA = 5;


var QUOTE_ABERTO = 1;
var QUOTE_APROVADO = 2;
var QUOTE_REJEITADO = 3;
var QUOTE_CANCELADO = 4;
var QUOTE_CONCLUIDO = 5;

var ROLE_PROFISSIONAL = 2;
var ROLE_CLIENTE = 3;
var ROLE_PARCEIRO = 1;

var app, access_token, inAppBrowserRef;
var account, userName, userID, userRole;
var initialView = "LoginView";

var cadastroGender, cadastroFirstName, cadastroLastName, cadastroEmail;
