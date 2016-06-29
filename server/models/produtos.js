var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var produtosSchema = mongoose.Schema({
	fotos: [],
	lojaId: Number,
	departamento: {
		id: String,
		titulo: String
	},
	categoria: {
		id: String,
		titulo: String,
		dptoId: String
	},
	descricao: String,
	peculiaridades: {
		cor: String,
		quantidade: Number
	},
	preco: Number,
	criado: { type: Date, default: Date.now },
	editado: String,
	quantidade: Number,
	titulo: String,
});

module.exports = mongoose.model('Produtos', produtosSchema);