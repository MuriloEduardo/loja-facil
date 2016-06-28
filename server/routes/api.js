var Produtos  = require('../models/produtos');
var multer    = require('multer');
var fs        = require('fs');

var storage  = multer.diskStorage({
    destination: function (req, file, cb) {
        var imagesPathDestin = './server/uploads/imagens/' + req.params.path;
        
        if (!fs.existsSync(imagesPathDestin)) fs.mkdirSync(imagesPathDestin);

    	cb(null, imagesPathDestin);
    },
    filename: function (req, file, cb) {
        var fileName = file.originalname.split('.')[0];
        var fileType = file.originalname.split('.')[1];
        
        cb(null, fileName + '.' + fileType + '@' + req.params.name + Date.now() + '.' + fileType);
    }
});
var upload   = multer({ storage: storage });

module.exports = function(router){

	router.post('/produtos', function(req, res){
		var produtos 		   = new Produtos();
		produtos.departamento  = req.body.departamento;
		produtos.categoria 	   = req.body.categoria;
		produtos.titulo 	   = req.body.titulo;
		produtos.preco 	   	   = req.body.preco;
		produtos.quantidade    = req.body.quantidade;

		produtos.save(function(err, data){
			if(err)
				res.json(err);
			else
				res.json(data);
		});
	});

	router.post('/upload/imagens/:path/:name', upload.single('file'), function (req, res, next) {
		res.json({success: true});
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