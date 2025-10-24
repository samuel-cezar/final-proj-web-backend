const express = require('express');
const router = express.Router();
const palavrasChaveController = require('../controllers/PalavrasChaveController');
const { sessionControl, isAdmin } = require('../middleware/SessionControl');

// Rotas públicas
router.get('/', palavrasChaveController.listar.bind(palavrasChaveController));
router.get('/:id', palavrasChaveController.buscarPorId.bind(palavrasChaveController));

// Rotas protegidas (Admin)
router.post('/', sessionControl, isAdmin, palavrasChaveController.criar.bind(palavrasChaveController));
router.put('/:id', sessionControl, isAdmin, palavrasChaveController.atualizar.bind(palavrasChaveController));
router.delete('/:id', sessionControl, isAdmin, palavrasChaveController.excluir.bind(palavrasChaveController));

module.exports = router;

