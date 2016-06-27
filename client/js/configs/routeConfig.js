app.config(function ($routeProvider, $locationProvider) {
	
	$routeProvider
	.when('/', {
		templateUrl: 'partials/home.html',
		controller: 'homeCtrl'
	})

	.when('/produtos', {
		templateUrl: 'partials/produtos.html',
		controller: 'produtosCtrl'
	})

	.when('/estoque', {
		templateUrl: 'partials/estoque.html',
		controller: 'estoqueCtrl'
	})

	.when('/layout', {
		templateUrl: 'partials/layout.html',
		controller: 'layoutCtrl'
	})

	.when('/pagamentos', {
		templateUrl: 'partials/pagamentos.html',
		controller: 'pagamentosCtrl'
	})

	.when('/clientes', {
		templateUrl: 'partials/clientes.html',
		controller: 'clientesCtrl'
	})

	.when('/pedidos', {
		templateUrl: 'partials/pedidos.html',
		controller: 'pedidosCtrl'
	})

	.when('/estatisticas', {
		templateUrl: 'partials/estatisticas.html',
		controller: 'estatisticasCtrl'
	})

	.when('/configuracoes', {
		templateUrl: 'partials/configuracoes.html',
		controller: 'configuracoesCtrl'
	})

	.otherwise({redirectTo: '/'});

	$locationProvider.html5Mode({enabled: true, requireBase: false});
});