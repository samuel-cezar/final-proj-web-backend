const express = require('express');
const router = express.Router();
const disciplinasController = require('../controllers/DisciplinasController');
const registrarLogAcesso = require('../middleware/LogAcesso');

// Aplica middleware de log para todas as rotas
router.use(registrarLogAcesso);

// GET /disciplinas
router.get('/', disciplinasController.index);

// GET /disciplinas/:id
router.get('/:id', disciplinasController.show);

// POST /disciplinas
router.post('/', disciplinasController.store);

// PUT /disciplinas/:id
router.put('/:id', disciplinasController.update);

// DELETE /disciplinas/:id
router.delete('/:id', disciplinasController.destroy);

module.exports = router;


