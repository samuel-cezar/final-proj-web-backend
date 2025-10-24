const mongoose = require('mongoose');

const palavraChaveSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    descricao: {
        type: String,
        trim: true
    }
}, {
    collection: 'palavras_chave',
    timestamps: true
});

module.exports = mongoose.model('PalavraChave', palavraChaveSchema);

