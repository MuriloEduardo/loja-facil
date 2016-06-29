app.controller('produtosCtrl', function($scope, Api, $timeout, $filter, $rootScope){

	var delaySave;
	var idProdutoCadastrando;
	$scope.produtoSalvo = false;
	$scope.loadingsaveProduto = 'fa-floppy-o';
	$scope.salvaAuto = true;
	$scope.estoque = [];
	$scope.abandonados = [];
	var counter = 0;
	$scope.leftColumWidth = '7';
	$scope.rightColumWidth = '5';

	$scope.departamentos = [
		{
			"id": 28,
			"titulo": "Departamento 1"	
		},
		{
			"id": 338,
			"titulo": "Departamento 2"	
		},
		{
			"id": 91,
			"titulo": "Departamento 3"	
		}
	];

	var getCategorias = [
		{
			"id": 1,
			"dptoId": 338,
			"titulo": "Categoria teste 1"
		},
		{
			"id": 36,
			"dptoId": 338,
			"titulo": "Categoria teste 2"
		},
		{
			"id": 67,
			"dptoId": 91,
			"titulo": "Categoria teste 3"
		},
		{
			"id": 167,
			"dptoId": 91,
			"titulo": "Categoria teste 4"
		},
		{
			"id": 23,
			"dptoId": 28,
			"titulo": "Categoria teste 5"
		},
		{
			"id": 50,
			"dptoId": 28,
			"titulo": "Categoria teste 6"
		}
	];

	$scope.getCategorias = function(id) {
		var found = $filter('filter')(getCategorias, {dptoId: id}, true);
		if (found.length) $scope.categorias = found;
	}
	
	$scope.salvaAutoFun = function() {
		if($scope.salvaAuto){
			$scope.salvaAuto = false;
		}else{
			$scope.salvaAuto = true;
		}
	}

	$scope.clickUpload = function(){
	    angular.element('#uploadImage').trigger('click');
	};

	var getProdutos = function() {
		$scope.getingProdutos = true;

		var myInterval = setInterval(function () {
		  ++counter;
		  console.log(counter)
		  if(counter > 5){
			clearInterval(myInterval);

			// Acao de coneccao lenta
			$rootScope.$root.lowerConnection();
			console.log($rootScope)
		  }
		}, 1000);

		Api.Produtos.query({}, function(data){
			for (var i=0; i < data.length; i++) {

				/*if(data[i].categoria)
					$scope.categorias.push(data[i].categoria);

				if(data[i].departamento)
					$scope.departamentos.push(data[i].departamento);*/

				if(Object.keys(data[i]).length >= 9){
					$scope.estoque.push(data[i]);
				}else{
					$scope.abandonados.push(data[i]);
				}
			}

			clearInterval(myInterval);
			$scope.getingProdutos = false;
		});
	}

	var validaFormularios = function(form){
		
		$('form[name="' + form + '"] input[required="true"]').each(function() {
			var t = $(this);
			if(!t.val()){
				t.addClass('cmperr').focus();
				retorno = false;
				return false;
			}else{
				t.removeClass('cmperr');
				retorno = true;
				return true;
			}
		});
	}

	$scope.isEmpty = function(obj) {
	    return Object.keys(obj).length === 0;
	}

	$scope.salvar = function() {
		if($scope.produto){
			if(Object.keys($scope.produto).length == 1){
				// Primeiro campo do produto que esta sendo cadastrado
				$scope.produtoSalvo = false;
				delaySave = setTimeout(function(){
					Api.Produtos.save({}, $scope.produto, function(data){
						if(data){
							idProdutoCadastrando = data._id;
						}
					});
				}, 1000);
			}else{
				delaySave = setTimeout(function(){
					$scope.loadingsaveProduto = 'fa-spinner fa-pulse fa-fw';
					Api.Produtos.save({id: idProdutoCadastrando}, $scope.produto, function(data){
						if(data.errors){
							console.log(data.errors)
							$scope.error = {
								show: true,
								msg: 'Erro! Tente atualizar, caso não resolva entre em contato com o suporte'
							}
							$scope.loadingsaveProduto = 'fa-floppy-o';
						}else if(data){
							////////////////////////////////////
							// completou cadastro do produto //
							//////////////////////////////////
							if(Object.keys(data).length >= 11){
								delete $scope.produto;
								$scope.estoque.push(data);
								$scope.produtoSalvo = true;
								$timeout(function(){
									$scope.produtoSalvo = false;
									$scope.loadingsaveProduto = 'fa-floppy-o';
								}, 3000);  
							}
						}
					});
				}, 1000);
			}
		}
	}

	$scope.stopSave = function() {
		if($scope.produto){
			$scope.loadingsaveProduto = 'fa-floppy-o';
			clearTimeout(delaySave);
		}
	}

	$scope.focus = function(el) {
		$('[ng-model="produto.' + el + '"]').focus();
	}

	$scope.delete = function(index) {
		var box = bootbox.confirm({
			message: 'Tem certeza? Não prefere completa-lo para fatura mais? :)',
			buttons: {
		        'cancel': {
		            label: 'Cancelar',
		            className: 'btn-default'
		        },
		        'confirm': {
		            label: 'Descartar',
		            className: 'btn-danger'
		        }
		    },
			callback: function(resposta) {
				if(resposta){
					Api.Produtos.delete({id: $scope.abandonados[index]._id}, function(data) {
						$scope.abandonados.splice(index, 1);
						box.show('Produto descartado');
					});
				}
			}
		})
	}

	$scope.retomar = function(obj) {
		idProdutoCadastrando = obj._id;

		$scope.produto = obj;

		$('input[ng-model="produto.titulo"]').focus();
	}

	$('[data-toggle="tooltip"]').tooltip();

	getProdutos();

	$scope.expandirEstoque = function() {
		if($scope.leftColumWidth == '7'){
			$scope.rightColumWidth = '7';
			$scope.leftColumWidth = '5';
		}else{
			$scope.rightColumWidth = '5';
			$scope.leftColumWidth = '7';
		}
	}
});