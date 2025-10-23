const LogAcesso = require('../models/nosql/LogAcesso');

const registrarLogAcesso = async (req, res, next) => {
    try {
        // Pega o usuário da sessão se existir, senão usa 'usuario_anonimo'
        const usuario = req.session && req.session.usuario 
            ? req.session.usuario.email || req.session.usuario.nome 
            : 'usuario_anonimo';

        await LogAcesso.create({
            usuario: usuario,
            rotaAcessada: req.originalUrl
        });

        next();
    } catch (error) {
        console.error('Erro ao registrar log:', error);
        next(); // Não interrompe a requisição principal
    }
};

module.exports = registrarLogAcesso;