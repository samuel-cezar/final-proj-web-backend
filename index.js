const express = require('express');
const cors = require('cors');

const sequelize = require('./config/sequelize');
const connectMongoDB = require('./config/mongoose');

// Importar rotas
const alunosRoutes = require('./routes/Alunos');
const disciplinasRoutes = require('./routes/Disciplinas');
const matriculasRoutes = require('./routes/Matriculas');
const logsRoutes = require('./routes/Logs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/alunos', alunosRoutes);
app.use('/disciplinas', disciplinasRoutes);
app.use('/matriculas', matriculasRoutes);
app.use('/logs', logsRoutes);

// Rota de health check
app.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({
            status: 'OK',
            databases: {
                sql: 'Conectado',
                nosql: 'Conectado'
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Inicialização dos bancos e servidor
const startServer = async () => {
    try {
        // Conectar bancos
        await sequelize.authenticate();
        console.log('PostgreSQL conectado com sucesso');

        await connectMongoDB();

        // Sincronizar modelos SQL
        await sequelize.sync({ force: false });
        console.log('Modelos SQL sincronizados');

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();

// Tratamento de erros
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;