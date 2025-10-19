const LogAcesso = require('../models/nosql/LogAcesso');

const registrarLogAcesso = async (req, res, next) => {
    try {
        // Usuário fictício (poderia vir de autenticação)
        const usuario = req.headers['user'] || 'usuario_anonimo';

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