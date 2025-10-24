const express = require('express');
const router = express.Router();
const projetosController = require('../controllers/ProjetosController');
const { sessionControl } = require('../middleware/SessionControl');

// Rotas públicas
router.get('/', projetosController.listar.bind(projetosController));
router.get('/:id', projetosController.buscarPorId.bind(projetosController));

// Rotas protegidas (requerem login)
router.get('/meus/projetos', sessionControl, projetosController.listarMeusProjetos.bind(projetosController));
router.post('/', sessionControl, projetosController.criar.bind(projetosController));
router.put('/:id', sessionControl, projetosController.atualizar.bind(projetosController));
router.delete('/:id', sessionControl, projetosController.excluir.bind(projetosController));

// Gerenciar desenvolvedores
router.post('/:id/desenvolvedores', sessionControl, projetosController.adicionarDesenvolvedor.bind(projetosController));
router.delete('/:id/desenvolvedores/:desenvolvedorId', sessionControl, projetosController.removerDesenvolvedor.bind(projetosController));

module.exports = router;

