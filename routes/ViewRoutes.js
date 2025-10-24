const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/ViewsController');
const { sessionControl, isAdmin } = require('../middleware/SessionControl');

// Aplicar controle de sessão
router.use(sessionControl);

// ==================== AUTENTICAÇÃO ====================

// Página de login
router.get('/login', viewsController.loginForm);

// Processar login
router.post('/login', viewsController.login);

// Logout
router.get('/logout', viewsController.logout);

// Redirect root to login or home
router.get('/', viewsController.root);

// ==================== HOME ====================

router.get('/home', viewsController.home);

// ==================== ALUNOS ====================

// Listar alunos
router.get('/alunos', viewsController.alunosList);

// Formulário criar aluno
router.get('/alunos/criar', isAdmin, viewsController.alunoCreateForm);

// Criar aluno
router.post('/alunos/criar', isAdmin, viewsController.alunoCreate);

// Formulário editar aluno
router.get('/alunos/editar/:id', isAdmin, viewsController.alunoEditForm);

// Editar aluno
router.post('/alunos/editar/:id', isAdmin, viewsController.alunoEdit);

// Gerenciar disciplinas do aluno
router.get('/alunos/gerenciar-disciplinas/:id', isAdmin, viewsController.alunoGerenciarDisciplinas);

// ==================== DISCIPLINAS ====================

// Listar disciplinas
router.get('/disciplinas', viewsController.disciplinasList);

// Formulário criar disciplina
router.get('/disciplinas/criar', isAdmin, viewsController.disciplinaCreateForm);

// Criar disciplina
router.post('/disciplinas/criar', isAdmin, viewsController.disciplinaCreate);

// Formulário editar disciplina
router.get('/disciplinas/editar/:id', isAdmin, viewsController.disciplinaEditForm);

// Editar disciplina
router.post('/disciplinas/editar/:id', isAdmin, viewsController.disciplinaEdit);

// Gerenciar alunos da disciplina
router.get('/disciplinas/gerenciar-alunos/:id', isAdmin, viewsController.disciplinaGerenciarAlunos);

// ==================== MATRÍCULAS (Admin Only) ====================

router.get('/matriculas', isAdmin, viewsController.matriculasList);

// ==================== LOGS (Admin Only) ====================

router.get('/logs', isAdmin, viewsController.logsList);

// ==================== PROJETOS ====================

// Listar todos os projetos (público)
router.get('/projetos', viewsController.projetosList);

// Filtrar projetos por palavra-chave (público) - sem parâmetro
router.get('/projetos/palavra-chave', viewsController.projetosPorPalavraChave);

// Filtrar projetos por palavra-chave (público) - com parâmetro
router.get('/projetos/palavra-chave/:palavraChaveId', viewsController.projetosPorPalavraChave);

// Meus projetos
router.get('/projetos/meus', viewsController.meusProjetosList);

// Formulário criar projeto
router.get('/projetos/criar', viewsController.projetoCreateForm);

// Criar projeto
router.post('/projetos/criar', viewsController.projetoCreate);

// Formulário editar projeto
router.get('/projetos/editar/:id', viewsController.projetoEditForm);

// Editar projeto
router.post('/projetos/editar/:id', viewsController.projetoEdit);

// Gerenciar desenvolvedores
router.get('/projetos/gerenciar-desenvolvedores/:id', viewsController.projetoGerenciarDesenvolvedores);

// ==================== PALAVRAS-CHAVE ====================

// Listar palavras-chave
router.get('/palavras-chave', viewsController.palavrasChaveList);

// Formulário criar palavra-chave (Admin)
router.get('/palavras-chave/criar', isAdmin, viewsController.palavraChaveCreateForm);

// Criar palavra-chave (Admin)
router.post('/palavras-chave/criar', isAdmin, viewsController.palavraChaveCreate);

// Formulário editar palavra-chave (Admin)
router.get('/palavras-chave/editar/:id', isAdmin, viewsController.palavraChaveEditForm);

// Editar palavra-chave (Admin)
router.post('/palavras-chave/editar/:id', isAdmin, viewsController.palavraChaveEdit);

// ==================== CONHECIMENTOS ====================

// Meus conhecimentos (alunos)
router.get('/conhecimentos/meus', viewsController.meusConhecimentosList);

// Gerenciar conhecimentos (Admin)
router.get('/conhecimentos/admin', isAdmin, viewsController.conhecimentosAdminList);
router.get('/conhecimentos/admin/criar', isAdmin, viewsController.conhecimentoCreateForm);
router.post('/conhecimentos/admin/criar', isAdmin, viewsController.conhecimentoCreate);
router.get('/conhecimentos/admin/editar/:id', isAdmin, viewsController.conhecimentoEditForm);
router.post('/conhecimentos/admin/editar/:id', isAdmin, viewsController.conhecimentoEdit);

// ==================== RELATÓRIOS ====================

// Relatório de conhecimentos (público)
router.get('/relatorio/conhecimentos', viewsController.relatorioConhecimentos);

module.exports = router;

