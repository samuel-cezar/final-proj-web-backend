const express = require('express');
const router = express.Router();
const { Aluno } = require('../models/sql');
const registrarLogAcesso = require('../middleware/LogAcesso');

// Aplica middleware de log para todas as rotas
router.use(registrarLogAcesso);

// GET /alunos
router.get('/', async (req, res) => {
    try {
        const alunos = await Aluno.findAll();
        res.json(alunos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /alunos/:id
router.get('/:id', async (req, res) => {
    try {
        const aluno = await Aluno.findByPk(req.params.id);
        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }
        res.json(aluno);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /alunos
router.post('/', async (req, res) => {
    try {
        const aluno = await Aluno.create(req.body);
        res.status(201).json(aluno);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /alunos/:id
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Aluno.update(req.body, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        const aluno = await Aluno.findByPk(req.params.id);
        res.json(aluno);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /alunos/:id
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Aluno.destroy({
            where: { id: req.params.id }
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;