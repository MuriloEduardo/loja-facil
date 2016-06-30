app.controller('teste-produtoCtrl', function($scope, Api, serialGenerator){

	// Necessario criar um variavel do timeOut
	// Para ser executada mesmo quando ainda nao setada
	var delaySave = undefined;

	// EVentos que vão ocorrendo na funcionamento de produtos
	// Desta forma fica organizada na coleção de eventos
	$scope.eventos = {
		loadSave: false,
		loadGet: false,
		save: false
	}

	// Objeto Produto atual
	// Esse sera o objeto model, que so ele sera salvo no banco
	// nada do scope vai ser salvo, somente manipulado com esse objeto
	var produtoAtual = {
		id: undefined,
		titulo: undefined,
		preco: undefined,
		quantidade: undefined,
		departamento: {
			id: undefined,
			titulo: undefined
		},
		categoria: {
			id: undefined,
			idDepto: undefined,
			titulo: undefined
		},
		fotos: []
	}

	// Este objeto vazio recebera os dados do banco e uma vez alimentado, so recebera
	// 'push's', atualizando assim todos os campos e poupando processamento do banco
	var produtoBd = [];

	// Um array de todas subpartes que existem em produtos. São elas:
	// Estoque, Produtos abandonados, departamentos e suas categorias
	$scope.partials = {
		departamentos: [],
		categorias: [],
		estoque: [],
		abandonados: []
	}

	// Método para atualiza os dados do form, com os dados do ObjetoAtual
	// e também inicia um timer de 3 segundos que após esse tempo, chama a função save
	// @param@ Precisa ser enviado o objeto do form
	$scope.update = function(objPrdtForm) {
		if(objPrdtForm){
			// Soberscreve todos os campos que foram preenchidos no form
			for(var index in objPrdtForm) { 
			    produtoAtual[index] = objPrdtForm[index];
			}

			// Espera 3 segundos para verificar se mais nenhum focusin ocorreu
			// caso ocorra, tudo continua normalmente, cancelando o timeOut
			// caso 3 segundos se passem sem nenhum focus do usuario, é salvo no banco de dados
			delaySave = setTimeout(function(){
				// Chama ação de salvar
				save();
			}, 3000);
		}
	}

	// Verifica se esta ou não vazio
	// @return@ true || false
	$scope.isEmpty = function(obj) {
	    return Object.keys(obj).length === 0;
	}

	// FUnção que sera para parar o delay de salvamento
	// sera disparada toda vez que der focous in, ou seja ainda nao parou de preencher informações
	// assim, diminui acessos ao banco
	$scope.continue = function() {
		if(delaySave) clearTimeout(delaySave);
	}

	// Monta o array de departamentos do produtoBd ja com seus push's efetuados
	var getDepartamento = function() {
		for (var i = 0; i < produtoBd.length; i++) {
			if(produtoBd[i].departamento){
				$scope.partials.departamentos.push(produtoBd[i].departamento);
			}
		}
	}

	// Monta o array de categorias do produtoBd ja com seus push's efetuados
	var getCategoria = function() {
		for (var i = 0; i < produtoBd.length; i++) {
			if(produtoBd[i].categoria){
				$scope.partials.categorias.push(produtoBd[i].categoria);
			}
		}
	}

	// Monta o array de estoque do produtoBd ja com seus push's efetuados
	// Para estar no estoque precisa ter um numero de campos preenchidos minimo
	var getEstoque = function() {
		for (var i = 0; i < produtoBd.length; i++) {
			if(Object.keys(produtoBd[i]).length >= 7){
				$scope.partials.estoque.push(produtoBd[i]);	
			}
		}
	}

	var pushEstoque = function(data) {
		delete $scope.produto;
		
		produtoAtual = {
			id: undefined,
			titulo: undefined,
			preco: undefined,
			quantidade: undefined,
			departamento: {
				id: undefined,
				titulo: undefined
			},
			categoria: {
				id: undefined,
				idDepto: undefined,
				titulo: undefined
			},
			fotos: []
		}

		$scope.partials.estoque.push(angular.copy(data));

		$scope.eventos = { loadSave: false, save: false }
	}

	// Monta o array de produtos abandonados do produtoBd ja com seus push's efetuados
	// Para estar nos produtos abandonados precisa não ter preenchidos um numero de campos minimo
	var getAbandonados = function() {
		for (var i = 0; i < produtoBd.length; i++) {
			if(Object.keys(produtoBd[i]).length < 7){
				$scope.partials.abandonados.push(produtoBd[i]);	
			}
		}
	}

	// Atualiza todas as sub partes de produtos
	var getAllPartials = function() {
		getDepartamento();
		getAbandonados();
		getCategoria();
		getEstoque();

		// Esconde loader de carregamento de dados
		$scope.eventos = { loadGet: false }
	}

	// Essa função, e somente essa função buscara os produtos
	// e alimentara a variavel produtoBd
	var getProdutos = function() {
		
		// Mostra loader de carregamento de dados
		$scope.eventos = { loadGet: true }

		Api.Produtos.query({}, function(data){
			for (var i = 0; i < data.length; i++) {
				produtoBd.push(data[i]);
			}
			getAllPartials();
		});
	}

	// Função de salvar Objeto-Atual [Somente ele sera salvo]
	var save = function() {

		console.log(produtoAtual)
		
		// Mostra loader do footer de cadastro
		$scope.eventos = { loadSave: true, save: false }

		Api.Produtos.save({id: produtoAtual.id}, produtoAtual, function(data){
			// Colocar o id criado no objeto atual, fara com que sempre que undefined, ele cria, se tiver ai ele passa
			// por parametro e apenas atualiza
			if(data._id) produtoAtual.id = data._id;

			// Ao trazer os dados do banco, tera de alimentar um produtoBd
			// Para não precisar carregar todos os produtos novamente 
			// apenas adiciona o retorno a esse produtoBd
			if(Object.keys(data).length >= 9){
				// Caso tenha mais ou 9 key's no objeto de retorno
				// dar push no objeto de estoque
				pushEstoque(data);
			}

			// Esconde loader do footer de cadastro
			$scope.eventos = { loadSave: false, save: true }
		});
	}

	$scope.newPartialDepto = function(obj) {
		if(typeof $scope.produto != 'undefined'){
		  $scope.produto.departamento.id = serialGenerator.generate(10);
		}

		$scope.update(obj);
	}
	$scope.setPartialDepto = function(obj) {
		$scope.produto = {
			departamento: {
				titulo: obj.titulo,
				id: serialGenerator.generate(10)
			}
		};
		$scope.update($scope.produto)
	}

	$scope.newPartialCateg = function(obj) {
		if(typeof $scope.produto != 'undefined'){
		  $scope.produto.categoria.id = serialGenerator.generate(10);
		}

		$scope.update(obj);
	}
	$scope.setPartialCateg = function(obj) {
		$scope.produto = {
			categoria: {
				titulo: obj.titulo,
				idDepto: $scope.produto.departamento.id,
				id: serialGenerator.generate(10)
			}
		};
		$scope.update($scope.produto)
	}

	getProdutos();
	$('[data-toggle="tooltip"]').tooltip();

	// Simula a coleção LOJA
	// Apenas simula
	$scope.loja = {
		configuracoes: {
			produtos: {
				estoqueExpandido: false,
				salvamentoAutomatico: true
			}
		}
	}
});