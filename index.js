const express = require('express');
const cors = require('cors');
const handlebars = require('express-handlebars');
const session = require('express-session');
const path = require('path');

const sequelize = require('./config/sequelize');
const connectMongoDB = require('./config/mongoose');

// Importar rotas da API
const alunosRoutes = require('./routes/Alunos');
const disciplinasRoutes = require('./routes/Disciplinas');
const matriculasRoutes = require('./routes/Matriculas');
const logsRoutes = require('./routes/Logs');

// Importar middleware
const registrarLogAcesso = require('./middleware/LogAcesso');
const { sessionControl, addSessionToLocals } = require('./middleware/SessionControl');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Handlebars com helpers
app.engine('handlebars', handlebars.engine({ 
    defaultLayout: 'main',
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set('view engine', 'handlebars');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar sessão
app.use(session({
    secret: 'sistema-academico-secreto-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 } // 30 minutos
}));

// Middleware de log e sessão para views
app.use(registrarLogAcesso);
app.use(addSessionToLocals);

// Rotas da API (prefixadas com /api)
app.use('/api/alunos', alunosRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api/matriculas', matriculasRoutes);
app.use('/api/logs', logsRoutes);

// Importar rotas de views
const viewRoutes = require('./routes/ViewRoutes');
app.use('/', viewRoutes);

// Rota de health check (API)
app.get('/api/health', async (req, res) => {
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