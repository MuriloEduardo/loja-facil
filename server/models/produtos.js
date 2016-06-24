var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var produtosSchema = mongoose.Schema({
	departamento: String,
	categoria: String,
	preco: String,
	quantidade: Number,
	titulo: String
});

module.exports = mongoose.model('Produtos', produtosSchema);