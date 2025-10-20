const express = require('express');
const router = express.Router();
const { Aluno, Disciplina, Usuario } = require('../models/sql');
const LogAcesso = require('../models/nosql/LogAcesso');
const { sessionControl, isAdmin } = require('../middleware/SessionControl');

// Aplicar controle de sessão
router.use(sessionControl);

// ==================== AUTENTICAÇÃO ====================

// Página de login
router.get('/login', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/home');
    }
    res.render('usuario/login', { layout: 'noMenu' });
});

// Processar login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ where: { email, senha } });
        
        if (usuario) {
            req.session.usuario = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                admin: usuario.admin
            };
            res.redirect('/home');
        } else {
            res.render('usuario/login', { 
                layout: 'noMenu',
                erro: 'Email ou senha inválidos'
            });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('usuario/login', { 
            layout: 'noMenu',
            erro: 'Erro ao fazer login'
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Redirect root to login or home
router.get('/', (req, res) => {
    if (req.session.usuario) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

// ==================== HOME ====================

router.get('/home', (req, res) => {
    res.render('home');
});

// ==================== ALUNOS ====================

// Listar alunos
router.get('/alunos', async (req, res) => {
    try {
        const alunos = await Aluno.findAll({
            include: [{
                model: Disciplina,
                as: 'disciplinas',
                through: { attributes: [] }
            }]
        });
        res.render('aluno/alunoList', { alunos });
    } catch (error) {
        console.error('Erro ao listar alunos:', error);
        res.render('aluno/alunoList', { alunos: [] });
    }
});

// Formulário criar aluno
router.get('/alunos/criar', isAdmin, (req, res) => {
    res.render('aluno/alunoCreate');
});

// Criar aluno
router.post('/alunos/criar', isAdmin, async (req, res) => {
    try {
        await Aluno.create(req.body);
        res.redirect('/alunos');
    } catch (error) {
        console.error('Erro ao criar aluno:', error);
        res.render('aluno/alunoCreate', { erro: 'Erro ao criar aluno' });
    }
});

// Formulário editar aluno
router.get('/alunos/editar/:id', isAdmin, async (req, res) => {
    try {
        const aluno = await Aluno.findByPk(req.params.id);
        if (!aluno) {
            return res.redirect('/alunos');
        }
        res.render('aluno/alunoUpdate', { aluno });
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        res.redirect('/alunos');
    }
});

// Editar aluno
router.post('/alunos/editar/:id', isAdmin, async (req, res) => {
    try {
        await Aluno.update(req.body, { where: { id: req.params.id } });
        res.redirect('/alunos');
    } catch (error) {
        console.error('Erro ao editar aluno:', error);
        res.redirect('/alunos');
    }
});

// Gerenciar disciplinas do aluno
router.get('/alunos/gerenciar-disciplinas/:id', isAdmin, async (req, res) => {
    try {
        const aluno = await Aluno.findByPk(req.params.id, {
            include: [{
                model: Disciplina,
                as: 'disciplinas',
                through: { attributes: [] }
            }]
        });
        
        const todasDisciplinas = await Disciplina.findAll();
        
        res.render('aluno/alunoGerenciarDisciplinas', { 
            aluno: aluno.toJSON(),
            todasDisciplinas 
        });
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        res.redirect('/alunos');
    }
});

// ==================== DISCIPLINAS ====================

// Listar disciplinas
router.get('/disciplinas', async (req, res) => {
    try {
        const disciplinas = await Disciplina.findAll({
            include: [{
                model: Aluno,
                as: 'alunos',
                through: { attributes: [] }
            }]
        });
        res.render('disciplina/disciplinaList', { disciplinas });
    } catch (error) {
        console.error('Erro ao listar disciplinas:', error);
        res.render('disciplina/disciplinaList', { disciplinas: [] });
    }
});

// Formulário criar disciplina
router.get('/disciplinas/criar', isAdmin, (req, res) => {
    res.render('disciplina/disciplinaCreate');
});

// Criar disciplina
router.post('/disciplinas/criar', isAdmin, async (req, res) => {
    try {
        await Disciplina.create(req.body);
        res.redirect('/disciplinas');
    } catch (error) {
        console.error('Erro ao criar disciplina:', error);
        res.render('disciplina/disciplinaCreate', { erro: 'Erro ao criar disciplina' });
    }
});

// Formulário editar disciplina
router.get('/disciplinas/editar/:id', isAdmin, async (req, res) => {
    try {
        const disciplina = await Disciplina.findByPk(req.params.id);
        if (!disciplina) {
            return res.redirect('/disciplinas');
        }
        res.render('disciplina/disciplinaUpdate', { disciplina });
    } catch (error) {
        console.error('Erro ao buscar disciplina:', error);
        res.redirect('/disciplinas');
    }
});

// Editar disciplina
router.post('/disciplinas/editar/:id', isAdmin, async (req, res) => {
    try {
        await Disciplina.update(req.body, { where: { id: req.params.id } });
        res.redirect('/disciplinas');
    } catch (error) {
        console.error('Erro ao editar disciplina:', error);
        res.redirect('/disciplinas');
    }
});

// Gerenciar alunos da disciplina
router.get('/disciplinas/gerenciar-alunos/:id', isAdmin, async (req, res) => {
    try {
        const disciplina = await Disciplina.findByPk(req.params.id, {
            include: [{
                model: Aluno,
                as: 'alunos',
                through: { attributes: [] }
            }]
        });
        
        const todosAlunos = await Aluno.findAll();
        
        res.render('disciplina/disciplinaGerenciarAlunos', { 
            disciplina: disciplina.toJSON(),
            todosAlunos 
        });
    } catch (error) {
        console.error('Erro ao buscar disciplina:', error);
        res.redirect('/disciplinas');
    }
});

// ==================== MATRÍCULAS (Admin Only) ====================

router.get('/matriculas', isAdmin, async (req, res) => {
    try {
        // Buscar todos os alunos com suas disciplinas
        const alunos = await Aluno.findAll({
            include: [{
                model: Disciplina,
                as: 'disciplinas',
                through: { attributes: [] }
            }]
        });
        
        // Criar lista de matrículas
        const matriculas = [];
        alunos.forEach(aluno => {
            if (aluno.disciplinas && aluno.disciplinas.length > 0) {
                aluno.disciplinas.forEach(disciplina => {
                    matriculas.push({
                        aluno: {
                            id: aluno.id,
                            nome: aluno.nome,
                            email: aluno.email
                        },
                        disciplina: {
                            id: disciplina.id,
                            nome: disciplina.nome,
                            codigo: disciplina.codigo,
                            cargaHoraria: disciplina.cargaHoraria
                        }
                    });
                });
            }
        });
        
        res.render('matricula/matriculaList', { matriculas });
    } catch (error) {
        console.error('Erro ao listar matrículas:', error);
        res.render('matricula/matriculaList', { matriculas: [] });
    }
});

// ==================== LOGS (Admin Only) ====================

router.get('/logs', isAdmin, async (req, res) => {
    try {
        const logs = await LogAcesso.find()
            .sort({ timestamp: -1 })
            .limit(100);
        
        res.render('log/logList', { 
            logs: logs.map(log => ({
                _id: log._id.toString().substring(0, 8),
                metodo: log.metodo,
                url: log.url,
                ip: log.ip,
                userAgent: log.userAgent.substring(0, 50) + '...',
                timestamp: new Date(log.timestamp).toLocaleString('pt-BR')
            }))
        });
    } catch (error) {
        console.error('Erro ao listar logs:', error);
        res.render('log/logList', { logs: [] });
    }
});

module.exports = router;

