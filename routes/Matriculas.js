const express = require('express');
const router = express.Router();
const matriculasController = require('../controllers/MatriculasController');
const registrarLogAcesso = require('../middleware/LogAcesso');

router.use(registrarLogAcesso);

// GET /matriculas - Listar todas as matrículas
router.get('/', matriculasController.index);

// GET /alunos/:id/disciplinas
router.get('/alunos/:id/disciplinas', matriculasController.showAlunosDisciplinas);

// POST /matricular
router.post('/matricular', matriculasController.matricular);

// POST /desmatricular
router.post('/desmatricular', matriculasController.desmatricular);

module.exports = router;