const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/AlunosController');
const registrarLogAcesso = require('../middleware/LogAcesso');

// Aplica middleware de log para todas as rotas
router.use(registrarLogAcesso);

// GET /alunos
router.get('/', alunosController.index);

// GET /alunos/:id
router.get('/:id', alunosController.show);

// POST /alunos
router.post('/', alunosController.store);

// PUT /alunos/:id
router.put('/:id', alunosController.update);

// DELETE /alunos/:id
router.delete('/:id', alunosController.destroy);

module.exports = router;