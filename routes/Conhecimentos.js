const express = require('express');
const router = express.Router();
const conhecimentosController = require('../controllers/ConhecimentosController');
const { sessionControl, isAdmin } = require('../middleware/SessionControl');

// Listar todos os conhecimentos disponíveis
router.get('/disponiveis', conhecimentosController.listarTodos.bind(conhecimentosController));

// Rotas protegidas (requerem login)
router.get('/meus', sessionControl, conhecimentosController.listarMeusConhecimentos.bind(conhecimentosController));
router.post('/', sessionControl, conhecimentosController.adicionarOuAtualizar.bind(conhecimentosController));
router.delete('/:conhecimentoId', sessionControl, conhecimentosController.remover.bind(conhecimentosController));

// Buscar conhecimentos de um aluno (público)
router.get('/aluno/:alunoId', conhecimentosController.buscarPorAluno.bind(conhecimentosController));

// Rotas admin
router.post('/admin', sessionControl, isAdmin, conhecimentosController.criarAdmin.bind(conhecimentosController));
router.put('/admin/:id', sessionControl, isAdmin, conhecimentosController.atualizarAdmin.bind(conhecimentosController));
router.delete('/admin/:id', sessionControl, isAdmin, conhecimentosController.excluirAdmin.bind(conhecimentosController));

module.exports = router;

