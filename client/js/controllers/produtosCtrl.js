app.controller('produtosCtrl', function($scope, $filter, Api, $timeout){

	var delaySave;
	var idProdutoCadastrando;
	$scope.produtoSalvo = false;
	$scope.loadingsaveProduto = 'fa-floppy-o';
	$scope.estoque = [];
	$scope.categorias = [];
	$scope.departamentos = [];
	$scope.abandonados = [];
	$scope.produtosBD = [];

	$(function() {
	    Api.Produtos.query({}, function(data){
			for (var i=0; i < data.length; i++) {
				$scope.produtosBD.push(data[i]);
				if(Object.keys(data[i]).length >= 7){
					$scope.estoque.push(data[i]);
				}else{
					$scope.abandonados.push(data[i]);
				}
			}
		});
	});

	var carregaCategorias = function() {
		for (var i=0; i < $scope.produtosBD.length; i++) {
			$scope.categorias.push($scope.produtosBD[i].categoria);
		}
	}

	var carregaDepartamentos = function() {
		console.log($scope.produtosBD)
		for (var i=0; i < $scope.produtosBD.length; i++) {
			$scope.departamentos.push($scope.produtosBD[i].departamento);
		}
	}

	carregaCategorias();
	carregaDepartamentos();

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

	$scope.salvar = function() {
		// SO validar no ultimo campo
		//validaFormularios('passo-1')
		//if(retorno){
		//$filter('currency')(produto.preco, 'R$ ');
		$scope.loadingsaveProduto = 'fa-spinner fa-pulse fa-fw';
		if($scope.produto){
			if(Object.keys($scope.produto).length == 1){
				// Primeiro campo do produto que esta sendo cadastrado
				$scope.produtoSalvo = false;
				delaySave = setTimeout(function(){
					Api.Produtos.save({}, $scope.produto, function(data){
						if(data){
							idProdutoCadastrando = data._id;
							$scope.loadingsaveProduto = 'fa-check';
						}
					});
				}, 1000);
			}else{
				delaySave = setTimeout(function(){
					Api.Produtos.save({id: idProdutoCadastrando}, $scope.produto, function(data){
						if(data){
							$scope.loadingsaveProduto = 'fa-check';
							////////////////////////////////////
							// completou cadastro do produto //
							//////////////////////////////////
							if(Object.keys(data).length >= 9){
								$scope.estoque.push(data);
								$scope.produtoSalvo = true;
								delete $scope.produto;
								$timeout(function(){
									$scope.produtoSalvo = false;
									$scope.loadingsaveProduto = 'fa-floppy-o';
									carregaCategorias();
									carregaDepartamentos();
								}, 2500);  
							}
						}
					});
				}, 1000);
			}
		}else{
			$scope.loadingsaveProduto = 'fa-floppy-o';
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

	$('[data-toggle="tooltip"]').tooltip();
});