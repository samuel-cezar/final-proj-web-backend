const { Aluno, Disciplina, Usuario } = require('../models/sql');
const LogAcesso = require('../models/nosql/LogAcesso');

class ViewsController {
    // ==================== AUTENTICAÇÃO ====================

    // GET /login
    loginForm(req, res) {
        if (req.session.usuario) {
            return res.redirect('/home');
        }
        res.render('usuario/login', { layout: 'noMenu' });
    }

    // POST /login
    async login(req, res) {
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
    }

    // GET /logout
    logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }

    // GET /
    root(req, res) {
        if (req.session.usuario) {
            res.redirect('/home');
        } else {
            res.redirect('/login');
        }
    }

    // ==================== HOME ====================

    // GET /home
    home(req, res) {
        res.render('home');
    }

    // ==================== ALUNOS ====================

    // GET /alunos
    async alunosList(req, res) {
        try {
            const alunos = await Aluno.findAll({
                include: [{
                    model: Disciplina,
                    as: 'disciplinas',
                    through: { attributes: [] }
                }]
            });
            const alunosPlain = alunos.map(a => a.toJSON());
            res.render('aluno/alunoList', { alunos: alunosPlain });
        } catch (error) {
            console.error('Erro ao listar alunos:', error);
            res.render('aluno/alunoList', { alunos: [] });
        }
    }

    // GET /alunos/criar
    alunoCreateForm(req, res) {
        res.render('aluno/alunoCreate');
    }

    // POST /alunos/criar
    async alunoCreate(req, res) {
        try {
            await Aluno.create(req.body);
            res.redirect('/alunos');
        } catch (error) {
            console.error('Erro ao criar aluno:', error);
            res.render('aluno/alunoCreate', { erro: 'Erro ao criar aluno' });
        }
    }

    // GET /alunos/editar/:id
    async alunoEditForm(req, res) {
        try {
            const aluno = await Aluno.findByPk(req.params.id);
            if (!aluno) {
                return res.redirect('/alunos');
            }
            res.render('aluno/alunoUpdate', { aluno: aluno.toJSON() });
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            res.redirect('/alunos');
        }
    }

    // POST /alunos/editar/:id
    async alunoEdit(req, res) {
        try {
            await Aluno.update(req.body, { where: { id: req.params.id } });
            res.redirect('/alunos');
        } catch (error) {
            console.error('Erro ao editar aluno:', error);
            res.redirect('/alunos');
        }
    }

    // GET /alunos/gerenciar-disciplinas/:id
    async alunoGerenciarDisciplinas(req, res) {
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
                todasDisciplinas: todasDisciplinas.map(d => d.toJSON())
            });
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            res.redirect('/alunos');
        }
    }

    // ==================== DISCIPLINAS ====================

    // GET /disciplinas
    async disciplinasList(req, res) {
        try {
            const disciplinas = await Disciplina.findAll({
                include: [{
                    model: Aluno,
                    as: 'alunos',
                    through: { attributes: [] }
                }]
            });
            const disciplinasPlain = disciplinas.map(d => d.toJSON());
            res.render('disciplina/disciplinaList', { disciplinas: disciplinasPlain });
        } catch (error) {
            console.error('Erro ao listar disciplinas:', error);
            res.render('disciplina/disciplinaList', { disciplinas: [] });
        }
    }

    // GET /disciplinas/criar
    disciplinaCreateForm(req, res) {
        res.render('disciplina/disciplinaCreate');
    }

    // POST /disciplinas/criar
    async disciplinaCreate(req, res) {
        try {
            await Disciplina.create(req.body);
            res.redirect('/disciplinas');
        } catch (error) {
            console.error('Erro ao criar disciplina:', error);
            res.render('disciplina/disciplinaCreate', { erro: 'Erro ao criar disciplina' });
        }
    }

    // GET /disciplinas/editar/:id
    async disciplinaEditForm(req, res) {
        try {
            const disciplina = await Disciplina.findByPk(req.params.id);
            if (!disciplina) {
                return res.redirect('/disciplinas');
            }
            res.render('disciplina/disciplinaUpdate', { disciplina: disciplina.toJSON() });
        } catch (error) {
            console.error('Erro ao buscar disciplina:', error);
            res.redirect('/disciplinas');
        }
    }

    // POST /disciplinas/editar/:id
    async disciplinaEdit(req, res) {
        try {
            await Disciplina.update(req.body, { where: { id: req.params.id } });
            res.redirect('/disciplinas');
        } catch (error) {
            console.error('Erro ao editar disciplina:', error);
            res.redirect('/disciplinas');
        }
    }

    // GET /disciplinas/gerenciar-alunos/:id
    async disciplinaGerenciarAlunos(req, res) {
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
                todosAlunos: todosAlunos.map(a => a.toJSON())
            });
        } catch (error) {
            console.error('Erro ao buscar disciplina:', error);
            res.redirect('/disciplinas');
        }
    }

    // ==================== MATRÍCULAS ====================

    // GET /matriculas
    async matriculasList(req, res) {
        try {
            const alunos = await Aluno.findAll({
                include: [{
                    model: Disciplina,
                    as: 'disciplinas',
                    through: { attributes: [] }
                }]
            });
            
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
    }

    // ==================== LOGS ====================

    // GET /logs
    async logsList(req, res) {
        try {
            const logs = await LogAcesso.find()
                .sort({ dataHora: -1 })
                .limit(100);
            
            res.render('log/logList', { 
                logs: logs.map(log => ({
                    _id: log._id.toString().substring(0, 8),
                    usuario: log.usuario,
                    rotaAcessada: log.rotaAcessada,
                    dataHora: new Date(log.dataHora).toLocaleString('pt-BR')
                }))
            });
        } catch (error) {
            console.error('Erro ao listar logs:', error);
            res.render('log/logList', { logs: [] });
        }
    }
}

module.exports = new ViewsController();

