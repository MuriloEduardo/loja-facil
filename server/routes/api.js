var Produtos = require('../models/produtos');

module.exports = function(router){
	router.post('/produtos', function(req, res){
		var produtos 		   = new Produtos();
		produtos.departamento  = req.body.departamento;
		produtos.categoria 	   = req.body.categoria;
		produtos.titulo 	   = req.body.titulo;
		produtos.preco 	   	   = req.body.preco;
		produtos.quantidade    = req.body.quantidade;

		produtos.save(function(err, data){
			if(err){
				console.log(err)
				throw err;
			}

			res.json(data);
		});
	});

	router.get('/produtos', function(req, res){
		Produtos.find({}, function(err, data){
			res.json(data);
		});
	});

	router.delete('/produtos', function(req, res){
		Produtos.remove({}, function(err){
			res.json({result: err ? 'error' : 'ok'});
		});
	});

	router.get('/produtos/:id', function(req, res){
		Produtos.findOne({_id: req.params.id}, function(err, data){
			res.json(data);
		});
	});

	router.delete('/produtos/:id', function(req, res){
		Produtos.remove({_id: req.params.id}, function(err){
			res.json({result: err ? 'error' : 'ok'});
		});
	});

	router.post('/produtos/:id', function(req, res){
		Produtos.findOne({_id: req.params.id}, function(err, data){
			
			var produtos = data;

			produtos.departamento  = req.body.departamento;
			produtos.categoria 	   = req.body.categoria;
			produtos.titulo 	   = req.body.titulo;
			produtos.preco 	   	   = req.body.preco;
			produtos.quantidade    = req.body.quantidade;

			produtos.save(function(err, data){
				if(err)
					throw err;

				res.json(data);
			});
		});
	});
};