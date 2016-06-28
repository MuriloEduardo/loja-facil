app.controller('produtosCtrl', function($scope, Api, $timeout){

	var delaySave;
	var idProdutoCadastrando;
	$scope.produtoSalvo = false;
	$scope.loadingsaveProduto = 'fa-floppy-o';
	$scope.salvaAuto = true;
	$scope.estoque = [];
	$scope.abandonados = [];
	$scope.categorias = [];
	$scope.departamentos = [];
	
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
		Api.Produtos.query({}, function(data){
			for (var i=0; i < data.length; i++) {

				if(data[i].categoria)
					$scope.categorias.push(data[i].categoria);

				if(data[i].departamento)
					$scope.departamentos.push(data[i].departamento);

				if(Object.keys(data[i]).length >= 9){
					$scope.estoque.push(data[i]);
				}else{
					$scope.abandonados.push(data[i]);
				}
			}
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
});