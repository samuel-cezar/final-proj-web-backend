const { Aluno, Disciplina, Usuario, Projeto, Conhecimento, ProjetoPalavraChave, AlunoConhecimento, ProjetoAluno } = require('../models/sql');
const LogAcesso = require('../models/nosql/LogAcesso');
const PalavraChave = require('../models/nosql/PalavraChave');

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
            const usuario = await Usuario.findOne({ 
                where: { email, senha },
                include: [{
                    model: Aluno,
                    as: 'aluno',
                    required: false
                }]
            });
            
            if (usuario) {
                req.session.usuario = {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    admin: usuario.admin,
                    alunoId: usuario.aluno?.id // ID do aluno vinculado, se existir
                };
                // Também adicionar diretamente para facilitar acesso
                req.session.userId = usuario.aluno?.id || null;
                
                console.log('Login realizado:', {
                    usuarioId: usuario.id,
                    alunoId: usuario.aluno?.id,
                    sessionUserId: req.session.userId
                });
                
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
            res.render('homePublica', { layout: 'noMenu' });
        }
    }

    // ==================== HOME ====================

    // GET /home
    async home(req, res) {
        try {
            // Se não estiver logado, redirecionar para home pública
            if (!req.session.usuario) {
                return res.redirect('/');
            }

            // Se não for aluno, apenas renderizar home básico
            if (!req.session.userId) {
                return res.render('home', {
                    projetos: [],
                    conhecimentos: [],
                    totalProjetos: 0,
                    totalConhecimentos: 0
                });
            }

            // Buscar aluno com projetos (buscar todos e limitar no JS, pois belongsToMany não suporta separate)
            const aluno = await Aluno.findByPk(req.session.userId, {
                include: [{
                    model: Projeto,
                    as: 'projetos',
                    through: { attributes: [] }
                }]
            });

            // Buscar conhecimentos do aluno
            const alunoComConhecimentos = await Aluno.findByPk(req.session.userId, {
                include: [{
                    model: Conhecimento,
                    as: 'conhecimentos',
                    through: { attributes: ['nivel'] }
                }]
            });

            // Ordenar e limitar projetos (5 mais recentes)
            const projetosOrdenados = (aluno?.projetos || [])
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            // Limitar conhecimentos (5 primeiros por nome)
            const conhecimentosLimitados = (alunoComConhecimentos?.conhecimentos || [])
                .sort((a, b) => a.nome.localeCompare(b.nome))
                .slice(0, 5);

            res.render('home', {
                projetos: projetosOrdenados.map(p => p.toJSON()),
                conhecimentos: conhecimentosLimitados.map(c => ({
                    id: c.id,
                    nome: c.nome,
                    descricao: c.descricao,
                    nivel: c.AlunoConhecimento?.nivel || 0
                })),
                totalProjetos: aluno?.projetos?.length || 0,
                totalConhecimentos: alunoComConhecimentos?.conhecimentos?.length || 0
            });
        } catch (error) {
            console.error('Erro ao carregar home:', error);
            res.render('home', {
                projetos: [],
                conhecimentos: [],
                totalProjetos: 0,
                totalConhecimentos: 0
            });
        }
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
            const { nome, email, dataNascimento, matricula, curso, senha, confirmarSenha, admin } = req.body;

            // Validar senhas
            if (senha !== confirmarSenha) {
                return res.render('aluno/alunoCreate', { 
                    erro: 'As senhas não coincidem' 
                });
            }

            if (senha.length < 6) {
                return res.render('aluno/alunoCreate', { 
                    erro: 'A senha deve ter no mínimo 6 caracteres' 
                });
            }

            // Verificar se email já existe
            const usuarioExistente = await Usuario.findOne({ where: { email } });
            if (usuarioExistente) {
                return res.render('aluno/alunoCreate', { 
                    erro: 'Este email já está cadastrado no sistema' 
                });
            }

            // Criar usuário primeiro
            const usuario = await Usuario.create({
                nome,
                email,
                senha,
                admin: admin === 'true' || admin === true
            });

            // Criar aluno vinculado ao usuário
            await Aluno.create({
                nome,
                email,
                dataNascimento,
                matricula: matricula || null,
                curso: curso || null,
                usuarioId: usuario.id
            });

            res.redirect('/alunos');
        } catch (error) {
            console.error('Erro ao criar aluno:', error);
            res.render('aluno/alunoCreate', { 
                erro: `Erro ao criar aluno: ${error.message}` 
            });
        }
    }

    // GET /alunos/editar/:id
    async alunoEditForm(req, res) {
        try {
            const aluno = await Aluno.findByPk(req.params.id, {
                include: [{
                    model: Usuario,
                    as: 'usuario'
                }]
            });
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
            const { nome, email, dataNascimento, matricula, curso, novaSenha, confirmarNovaSenha, admin } = req.body;

            // Validar senhas se fornecidas
            if (novaSenha || confirmarNovaSenha) {
                if (novaSenha !== confirmarNovaSenha) {
                    const aluno = await Aluno.findByPk(req.params.id, {
                        include: [{ model: Usuario, as: 'usuario' }]
                    });
                    return res.render('aluno/alunoUpdate', { 
                        aluno: aluno.toJSON(),
                        erro: 'As senhas não coincidem' 
                    });
                }

                if (novaSenha.length < 6) {
                    const aluno = await Aluno.findByPk(req.params.id, {
                        include: [{ model: Usuario, as: 'usuario' }]
                    });
                    return res.render('aluno/alunoUpdate', { 
                        aluno: aluno.toJSON(),
                        erro: 'A senha deve ter no mínimo 6 caracteres' 
                    });
                }
            }

            // Atualizar dados do aluno
            await Aluno.update({
                nome,
                email,
                dataNascimento,
                matricula: matricula || null,
                curso: curso || null
            }, { where: { id: req.params.id } });

            // Buscar e atualizar usuário associado
            const aluno = await Aluno.findByPk(req.params.id);
            if (aluno && aluno.usuarioId) {
                const updateData = {
                    nome,
                    email,
                    admin: admin === 'true' || admin === true
                };

                // Adicionar senha apenas se foi fornecida
                if (novaSenha) {
                    updateData.senha = novaSenha;
                }

                await Usuario.update(updateData, { where: { id: aluno.usuarioId } });
            }

            res.redirect('/alunos');
        } catch (error) {
            console.error('Erro ao editar aluno:', error);
            const aluno = await Aluno.findByPk(req.params.id, {
                include: [{ model: Usuario, as: 'usuario' }]
            });
            res.render('aluno/alunoUpdate', { 
                aluno: aluno ? aluno.toJSON() : null,
                erro: `Erro ao editar aluno: ${error.message}` 
            });
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

    // ==================== PROJETOS ====================

    // GET /projetos
    async projetosList(req, res) {
        try {
            const projetos = await Projeto.findAll({
                include: [{
                    model: Aluno,
                    as: 'desenvolvedores',
                    through: { attributes: [] }
                }],
                order: [['createdAt', 'DESC']]
            });

            // Buscar palavras-chave para cada projeto
            const projetosComPalavras = await Promise.all(
                projetos.map(async (projeto) => {
                    const palavrasChaveRel = await ProjetoPalavraChave.findAll({
                        where: { projetoId: projeto.id }
                    });

                    const palavrasChaveIds = palavrasChaveRel.map(rel => rel.palavraChaveId);
                    const palavrasChave = await PalavraChave.find({
                        _id: { $in: palavrasChaveIds }
                    });

                    const projetoJson = projeto.toJSON();
                    return {
                        ...projetoJson,
                        palavrasChave: palavrasChave,
                        ehMeuProjeto: projetoJson.desenvolvedores?.some(d => d.id === req.session.userId)
                    };
                })
            );

            res.render('projeto/projetoList', { projetos: projetosComPalavras });
        } catch (error) {
            console.error('Erro ao listar projetos:', error);
            res.render('projeto/projetoList', { projetos: [] });
        }
    }

    // GET /projetos/meus
    async meusProjetosList(req, res) {
        try {
            const alunoLogadoId = req.session.userId;
            const isAdmin = req.session.admin;
            
            const aluno = await Aluno.findByPk(alunoLogadoId, {
                include: [{
                    model: Projeto,
                    as: 'projetos',
                    include: [{
                        model: Aluno,
                        as: 'desenvolvedores',
                        attributes: ['id', 'nome'],
                        through: { attributes: [] }
                    }]
                }]
            });

            // Buscar todos os alunos para o modal
            const todosAlunos = await Aluno.findAll({
                attributes: ['id', 'nome', 'email'],
                order: [['nome', 'ASC']]
            });

            // Buscar palavras-chave e preparar exibição de desenvolvedores
            const projetosComPalavras = await Promise.all(
                (aluno?.projetos || []).map(async (projeto) => {
                    const palavrasChaveRel = await ProjetoPalavraChave.findAll({
                        where: { projetoId: projeto.id }
                    });

                    const palavrasChaveIds = palavrasChaveRel.map(rel => rel.palavraChaveId);
                    const palavrasChave = await PalavraChave.find({
                        _id: { $in: palavrasChaveIds }
                    });

                    const desenvolvedores = projeto.desenvolvedores || [];
                    const criador = desenvolvedores.find(d => d.id === projeto.criadoPorId);
                    const criadorNome = criador?.nome || 'Desconhecido';
                    
                    // Lógica de exibição: até 3 nomes, ou "Criador +N"
                    let desenvolvedoresTexto = '';
                    if (desenvolvedores.length <= 3) {
                        desenvolvedoresTexto = desenvolvedores.map(d => d.nome).join(', ');
                    } else {
                        const outros = desenvolvedores.length - 1;
                        desenvolvedoresTexto = `${criadorNome} +${outros}`;
                    }

                    const ehCriador = projeto.criadoPorId === alunoLogadoId;
                    const podeGerenciar = ehCriador || isAdmin;

                    return {
                        ...projeto.toJSON(),
                        palavrasChave: palavrasChave,
                        desenvolvedoresTexto,
                        ehCriador,
                        podeGerenciar,
                        ehMeuProjeto: true
                    };
                })
            );

            res.render('projeto/projetoList', { 
                projetos: projetosComPalavras,
                todosAlunos: todosAlunos.map(a => a.toJSON()),
                apenasMeus: true 
            });
        } catch (error) {
            console.error('Erro ao listar meus projetos:', error);
            res.render('projeto/projetoList', { 
                projetos: [], 
                todosAlunos: [],
                apenasMeus: true 
            });
        }
    }

    // GET /projetos/criar
    async projetoCreateForm(req, res) {
        try {
            const palavrasChave = await PalavraChave.find().sort({ nome: 1 });
            res.render('projeto/projetoCreate', { 
                palavrasChave: palavrasChave.map(p => ({
                    id: p._id.toString(),
                    nome: p.nome,
                    categoria: p.categoria
                }))
            });
        } catch (error) {
            console.error('Erro ao carregar formulário:', error);
            res.render('projeto/projetoCreate', { palavrasChave: [] });
        }
    }

    // POST /projetos/criar
    async projetoCreate(req, res) {
        try {
            const { nome, resumo, linkExterno, palavrasChaveIds } = req.body;

            // Verificar se usuário tem aluno vinculado
            if (!req.session.userId) {
                const palavrasChave = await PalavraChave.find().sort({ nome: 1 });
                return res.render('projeto/projetoCreate', { 
                    erro: 'Seu usuário não possui um perfil de aluno vinculado. Entre em contato com o administrador.',
                    palavrasChave: palavrasChave.map(p => ({
                        id: p._id.toString(),
                        nome: p.nome,
                        descricao: p.descricao
                    }))
                });
            }

            const projeto = await Projeto.create({ 
                nome, 
                resumo, 
                linkExterno,
                criadoPorId: req.session.userId 
            });

            // Adicionar aluno como desenvolvedor usando tabela intermediária
            await ProjetoAluno.create({
                projetoId: projeto.id,
                alunoId: req.session.userId
            });

            // Adicionar palavras-chave
            if (palavrasChaveIds) {
                const ids = Array.isArray(palavrasChaveIds) ? palavrasChaveIds : [palavrasChaveIds];
                const relacoes = ids.map(id => ({
                    projetoId: projeto.id,
                    palavraChaveId: id
                }));
                await ProjetoPalavraChave.bulkCreate(relacoes);
            }

            res.redirect('/projetos/meus');
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
            const palavrasChave = await PalavraChave.find().sort({ nome: 1 });
            res.render('projeto/projetoCreate', { 
                erro: 'Erro ao criar projeto',
                palavrasChave: palavrasChave.map(p => ({
                    id: p._id.toString(),
                    nome: p.nome,
                    descricao: p.descricao
                }))
            });
        }
    }

    // GET /projetos/editar/:id
    async projetoEditForm(req, res) {
        try {
            const projeto = await Projeto.findByPk(req.params.id, {
                include: [{
                    model: Aluno,
                    as: 'desenvolvedores',
                    through: { attributes: [] }
                }]
            });

            if (!projeto) {
                return res.redirect('/projetos/meus');
            }

            // Verificar se é desenvolvedor
            const ehDev = projeto.desenvolvedores.some(d => d.id === req.session.userId);
            if (!ehDev) {
                return res.redirect('/projetos/meus');
            }

            // Buscar palavras-chave atuais
            const palavrasChaveRel = await ProjetoPalavraChave.findAll({
                where: { projetoId: projeto.id }
            });
            const palavrasChaveAtuaisIds = palavrasChaveRel.map(r => r.palavraChaveId);

            // Buscar todas as palavras-chave
            const todasPalavrasChave = await PalavraChave.find().sort({ nome: 1 });

            res.render('projeto/projetoUpdate', {
                projeto: projeto.toJSON(),
                palavrasChave: todasPalavrasChave.map(p => ({
                    id: p._id.toString(),
                    nome: p.nome,
                    categoria: p.categoria,
                    selecionado: palavrasChaveAtuaisIds.includes(p._id.toString())
                }))
            });
        } catch (error) {
            console.error('Erro ao buscar projeto:', error);
            res.redirect('/projetos/meus');
        }
    }

    // POST /projetos/editar/:id
    async projetoEdit(req, res) {
        try {
            const { nome, resumo, linkExterno, palavrasChaveIds } = req.body;

            await Projeto.update(
                { nome, resumo, linkExterno },
                { where: { id: req.params.id } }
            );

            // Atualizar palavras-chave
            await ProjetoPalavraChave.destroy({ where: { projetoId: req.params.id } });

            if (palavrasChaveIds) {
                const ids = Array.isArray(palavrasChaveIds) ? palavrasChaveIds : [palavrasChaveIds];
                const relacoes = ids.map(id => ({
                    projetoId: req.params.id,
                    palavraChaveId: id
                }));
                await ProjetoPalavraChave.bulkCreate(relacoes);
            }

            res.redirect('/projetos/meus');
        } catch (error) {
            console.error('Erro ao editar projeto:', error);
            res.redirect('/projetos/meus');
        }
    }

    // GET /projetos/gerenciar-desenvolvedores/:id
    async projetoGerenciarDesenvolvedores(req, res) {
        try {
            const projeto = await Projeto.findByPk(req.params.id, {
                include: [{
                    model: Aluno,
                    as: 'desenvolvedores',
                    through: { attributes: [] }
                }]
            });

            if (!projeto) {
                return res.redirect('/projetos/meus');
            }

            res.render('projeto/projetoGerenciarDesenvolvedores', {
                projeto: projeto.toJSON()
            });
        } catch (error) {
            console.error('Erro ao buscar projeto:', error);
            res.redirect('/projetos/meus');
        }
    }

    // GET /projetos/palavra-chave/:palavraChaveId
    async projetosPorPalavraChave(req, res) {
        try {
            const palavraChaveId = req.params.palavraChaveId;
            const todasPalavrasChave = await PalavraChave.find().sort({ nome: 1 });

            let projetos = [];
            let palavraChaveSelecionada = null;

            if (palavraChaveId) {
                // Buscar palavra-chave selecionada
                palavraChaveSelecionada = await PalavraChave.findById(palavraChaveId);

                if (palavraChaveSelecionada) {
                    // Buscar projetos que têm esta palavra-chave
                    const projetosPalavraChave = await ProjetoPalavraChave.findAll({
                        where: { palavraChaveId: palavraChaveId }
                    });

                    const projetoIds = projetosPalavraChave.map(p => p.projetoId);

                    if (projetoIds.length > 0) {
                        const projetosEncontrados = await Projeto.findAll({
                            where: { id: projetoIds },
                            include: [{
                                model: Aluno,
                                as: 'desenvolvedores',
                                through: { attributes: [] }
                            }],
                            order: [['createdAt', 'DESC']]
                        });

                        // Buscar palavras-chave para cada projeto
                        projetos = await Promise.all(
                            projetosEncontrados.map(async (projeto) => {
                                const palavrasChaveRel = await ProjetoPalavraChave.findAll({
                                    where: { projetoId: projeto.id }
                                });

                                const palavrasChaveIds = palavrasChaveRel.map(rel => rel.palavraChaveId);
                                const palavrasChave = await PalavraChave.find({
                                    _id: { $in: palavrasChaveIds }
                                });

                                return {
                                    ...projeto.toJSON(),
                                    palavrasChave: palavrasChave
                                };
                            })
                        );
                    }
                }
            }

            res.render('projeto/projetosPorPalavraChave', {
                palavrasChave: todasPalavrasChave.map(p => ({
                    _id: p._id.toString(),
                    nome: p.nome,
                    descricao: p.descricao,
                    selecionada: p._id.toString() === palavraChaveId
                })),
                palavraChaveSelecionada: palavraChaveSelecionada ? {
                    nome: palavraChaveSelecionada.nome
                } : null,
                projetos: projetos
            });
        } catch (error) {
            console.error('Erro ao filtrar projetos por palavra-chave:', error);
            res.render('projeto/projetosPorPalavraChave', {
                palavrasChave: [],
                projetos: [],
                erro: 'Erro ao carregar projetos'
            });
        }
    }

    // ==================== PALAVRAS-CHAVE ====================

    // GET /palavras-chave
    async palavrasChaveList(req, res) {
        try {
            const palavrasChave = await PalavraChave.find().sort({ nome: 1 });
            res.render('palavrachave/palavraChaveList', {
                palavrasChave: palavrasChave.map(p => ({
                    _id: p._id.toString(),
                    nome: p.nome,
                    descricao: p.descricao
                }))
            });
        } catch (error) {
            console.error('Erro ao listar palavras-chave:', error);
            res.render('palavrachave/palavraChaveList', { palavrasChave: [], erro: 'Erro ao listar palavras-chave' });
        }
    }

    // GET /palavras-chave/criar
    palavraChaveCreateForm(req, res) {
        res.render('palavrachave/palavraChaveCreate');
    }

    // POST /palavras-chave/criar
    async palavraChaveCreate(req, res) {
        try {
            const { nome, descricao } = req.body;
            await PalavraChave.create({ nome, descricao });
            res.redirect('/palavras-chave');
        } catch (error) {
            console.error('Erro ao criar palavra-chave:', error);
            res.render('palavrachave/palavraChaveCreate', { 
                erro: 'Erro ao criar palavra-chave. Verifique se o nome já existe.' 
            });
        }
    }

    // GET /palavras-chave/editar/:id
    async palavraChaveEditForm(req, res) {
        try {
            const palavraChave = await PalavraChave.findById(req.params.id);
            if (!palavraChave) {
                return res.redirect('/palavras-chave');
            }
            res.render('palavrachave/palavraChaveUpdate', {
                palavraChave: {
                    _id: palavraChave._id.toString(),
                    nome: palavraChave.nome,
                    descricao: palavraChave.descricao
                }
            });
        } catch (error) {
            console.error('Erro ao buscar palavra-chave:', error);
            res.redirect('/palavras-chave');
        }
    }

    // POST /palavras-chave/editar/:id
    async palavraChaveEdit(req, res) {
        try {
            const { nome, descricao } = req.body;
            await PalavraChave.findByIdAndUpdate(req.params.id, { nome, descricao });
            res.redirect('/palavras-chave');
        } catch (error) {
            console.error('Erro ao editar palavra-chave:', error);
            const palavraChave = await PalavraChave.findById(req.params.id);
            res.render('palavrachave/palavraChaveUpdate', {
                palavraChave: {
                    _id: palavraChave._id.toString(),
                    nome: palavraChave.nome,
                    descricao: palavraChave.descricao
                },
                erro: 'Erro ao editar palavra-chave'
            });
        }
    }

    // ==================== CONHECIMENTOS ====================

    // GET /conhecimentos/meus
    async meusConhecimentosList(req, res) {
        try {
            const aluno = await Aluno.findByPk(req.session.userId, {
                include: [{
                    model: Conhecimento,
                    as: 'conhecimentos',
                    through: { attributes: ['nivel'] }
                }]
            });

            const conhecimentosDisponiveis = await Conhecimento.findAll({
                order: [['nome', 'ASC']]
            });

            const conhecimentosComNivel = aluno?.conhecimentos?.map(c => ({
                id: c.id,
                nome: c.nome,
                descricao: c.descricao,
                nivel: c.AlunoConhecimento?.nivel || 0
            })) || [];

            res.render('conhecimento/conhecimentoList', {
                meusConhecimentos: conhecimentosComNivel,
                todosConhecimentos: conhecimentosDisponiveis.map(c => c.toJSON())
            });
        } catch (error) {
            console.error('Erro ao listar conhecimentos:', error);
            res.render('conhecimento/conhecimentoList', {
                meusConhecimentos: [],
                todosConhecimentos: []
            });
        }
    }

    // GET /conhecimentos/admin (Admin)
    async conhecimentosAdminList(req, res) {
        try {
            const conhecimentos = await Conhecimento.findAll({
                order: [['nome', 'ASC']]
            });

            // Contar quantos alunos têm cada conhecimento
            const conhecimentosComContagem = await Promise.all(
                conhecimentos.map(async (c) => {
                    const totalAlunos = await AlunoConhecimento.count({
                        where: { conhecimentoId: c.id }
                    });
                    return {
                        ...c.toJSON(),
                        totalAlunos
                    };
                })
            );

            res.render('conhecimento/conhecimentoAdminList', {
                conhecimentos: conhecimentosComContagem
            });
        } catch (error) {
            console.error('Erro ao listar conhecimentos (admin):', error);
            res.render('conhecimento/conhecimentoAdminList', {
                conhecimentos: [],
                erro: 'Erro ao listar conhecimentos'
            });
        }
    }

    // GET /conhecimentos/admin/criar (Admin)
    conhecimentoCreateForm(req, res) {
        res.render('conhecimento/conhecimentoCreate');
    }

    // POST /conhecimentos/admin/criar (Admin)
    async conhecimentoCreate(req, res) {
        try {
            const { nome, descricao } = req.body;
            await Conhecimento.create({ nome, descricao });
            res.redirect('/conhecimentos/admin');
        } catch (error) {
            console.error('Erro ao criar conhecimento:', error);
            res.render('conhecimento/conhecimentoCreate', {
                erro: 'Erro ao criar conhecimento. Verifique se o nome já existe.'
            });
        }
    }

    // GET /conhecimentos/admin/editar/:id (Admin)
    async conhecimentoEditForm(req, res) {
        try {
            const conhecimento = await Conhecimento.findByPk(req.params.id);
            if (!conhecimento) {
                return res.redirect('/conhecimentos/admin');
            }
            res.render('conhecimento/conhecimentoUpdate', {
                conhecimento: conhecimento.toJSON()
            });
        } catch (error) {
            console.error('Erro ao buscar conhecimento:', error);
            res.redirect('/conhecimentos/admin');
        }
    }

    // POST /conhecimentos/admin/editar/:id (Admin)
    async conhecimentoEdit(req, res) {
        try {
            const { nome, descricao } = req.body;
            await Conhecimento.update(
                { nome, descricao },
                { where: { id: req.params.id } }
            );
            res.redirect('/conhecimentos/admin');
        } catch (error) {
            console.error('Erro ao editar conhecimento:', error);
            const conhecimento = await Conhecimento.findByPk(req.params.id);
            res.render('conhecimento/conhecimentoUpdate', {
                conhecimento: conhecimento.toJSON(),
                erro: 'Erro ao editar conhecimento'
            });
        }
    }

    // ==================== RELATÓRIOS ====================

    // GET /relatorio/conhecimentos (público)
    async relatorioConhecimentos(req, res) {
        try {
            // Buscar todos os conhecimentos
            const conhecimentos = await Conhecimento.findAll({
                order: [['nome', 'ASC']]
            });

            // Contar total de alunos
            const totalAlunos = await Aluno.count();

            if (totalAlunos === 0 || conhecimentos.length === 0) {
                return res.render('relatorio/conhecimentoRelatorio', {
                    dados: [],
                    layout: req.session.usuario ? 'main' : 'noMenu'
                });
            }

            // Calcular proporção para cada conhecimento
            const dados = await Promise.all(
                conhecimentos.map(async (conhecimento) => {
                    const alunosComConhecimento = await AlunoConhecimento.count({
                        where: { conhecimentoId: conhecimento.id }
                    });

                    const percentual = totalAlunos > 0 
                        ? Math.round((alunosComConhecimento / totalAlunos) * 100) 
                        : 0;

                    return {
                        conhecimento: conhecimento.nome,
                        alunosComConhecimento,
                        totalAlunos,
                        percentual
                    };
                })
            );

            // Ordenar por percentual decrescente
            dados.sort((a, b) => b.percentual - a.percentual);

            res.render('relatorio/conhecimentoRelatorio', {
                dados,
                layout: req.session.usuario ? 'main' : 'noMenu'
            });
        } catch (error) {
            console.error('Erro ao gerar relatório de conhecimentos:', error);
            res.render('relatorio/conhecimentoRelatorio', {
                dados: [],
                erro: 'Erro ao gerar relatório',
                layout: req.session.usuario ? 'main' : 'noMenu'
            });
        }
    }
}

module.exports = new ViewsController();

