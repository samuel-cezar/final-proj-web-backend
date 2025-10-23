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

module.exports = router;

