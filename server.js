var express    = require('express');
var bodyParser = require('body-parser');
var ejs        = require('ejs');
var app        = express();
var path       = require('path');
var mongoose   = require('mongoose');
var configDB   = require('./server/config/database');
var port       = process.env.PORT || 8080;

mongoose.connect(configDB.url, function(err, res) {
	if(err){
		console.log('Nao foi possivel conectar a:' + configDB.url + ' com o erro: ' + err);
	}else{
		console.log('Conectado a ' + configDB.url);
	}
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'client', 'views'));

app.use(express.static(path.resolve(__dirname, 'client')));

// CRUD
var api = express.Router();
require('./server/routes/api')(api);
app.use('/api', api);

app.listen(port, function(){
	console.log('Rodando na porta ' + port);
});

app.get('/*', function(req, res){
	res.render('index.ejs');
});