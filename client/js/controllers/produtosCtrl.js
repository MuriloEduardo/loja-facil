app.controller('produtosCtrl', function($scope, Api, $timeout, $filter, $rootScope, serialGenerator){

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
	$scope.titDepto = 'Qual o departamento?';
	$scope.titCateg = 'Qual a categoria?';
	$scope.departamentos = [];
	$scope.categorias = [];

	var getCategorias = function(id) {
		var found = $filter('filter')($scope.categorias, {dptoId: id}, true);
		delete $scope.categorias;
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
		  if(counter > 5){
			clearInterval(myInterval);

			// Acao de coneccao lenta
			$rootScope.$root.lowerConnection();
		  }
		}, 1000);

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
					$scope.loadingsaveProduto = 'fa-circle-o-notch fa-spin fa-fw';
					Api.Produtos.save({id: idProdutoCadastrando}, $scope.produto, function(data){
						if(data.errors){
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
								// Apenas retira letras, nenhuma ação
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

	$scope.selectForm = function(obj, id) {
		if(id){
			$scope.titDepto = obj.titulo;

			// Mostrar somente as categorias possiveis
			//getCategorias(obj.id);
		}else{
			$scope.titCateg = obj.titulo;
		}
	}

	$scope.newDepto = function(titulo) {
		$scope.produto.departamento = {
			id: serialGenerator.generate(10),
			titulo: titulo
		}
		$scope.departamentos.push(angular.copy($scope.produto.departamento));
		$scope.selectForm($scope.produto.departamento, true)

		$scope.salvar();

		setTimeout(function(){
			delete $scope.produto.departamento.titulo;
		}, 1100);
	}

	$scope.newCateg = function(titulo) {
		$scope.produto.categoria = {
			id: serialGenerator.generate(10),
			titulo: titulo,
			dptoId: $scope.produto.departamento.id
		}
		$scope.categorias.push(angular.copy($scope.produto.categoria));
		$scope.selectForm($scope.produto.categoria, false)

		$scope.salvar();

		setTimeout(function(){
			delete $scope.produto.categoria.titulo;
		}, 1100);
	}
});