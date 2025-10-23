const LogAcesso = require('../models/nosql/LogAcesso');

class LogsController {
    // GET /api/logs
    async index(req, res) {
        try {
            const { usuario, dataInicio, dataFim, page = 1, limit = 10 } = req.query;

            let filtro = {};

            if (usuario) {
                filtro.usuario = { $regex: usuario, $options: 'i' };
            }

            if (dataInicio || dataFim) {
                filtro.dataHora = {};
                if (dataInicio) filtro.dataHora.$gte = new Date(dataInicio);
                if (dataFim) filtro.dataHora.$lte = new Date(dataFim);
            }

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { dataHora: -1 }
            };

            const logs = await LogAcesso.find(filtro)
                .sort(options.sort)
                .limit(options.limit)
                .skip((options.page - 1) * options.limit);

            const total = await LogAcesso.countDocuments(filtro);

            res.json({
                logs,
                paginacao: {
                    pagina: options.page,
                    limite: options.limit,
                    total,
                    paginas: Math.ceil(total / options.limit)
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new LogsController();

