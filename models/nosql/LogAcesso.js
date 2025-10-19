const mongoose = require('mongoose');

const logAcessoSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    rotaAcessada: {
        type: String,
        required: true
    },
    dataHora: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'logs_acesso'
});

module.exports = mongoose.model('LogAcesso', logAcessoSchema);