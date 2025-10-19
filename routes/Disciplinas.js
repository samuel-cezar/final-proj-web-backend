const express = require('express');
const router = express.Router();
const { Disciplina } = require('../models/sql');
const registrarLogAcesso = require('../middleware/LogAcesso');

// Aplica middleware de log para todas as rotas
router.use(registrarLogAcesso);

// GET /disciplinas
router.get('/', async (req, res) => {
    try {
        const disciplinas = await Disciplina.findAll();
        res.json(disciplinas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /disciplinas/:id
router.get('/:id', async (req, res) => {
    try {
        const disciplina = await Disciplina.findByPk(req.params.id);
        if (!disciplina) {
            return res.status(404).json({ error: 'Disciplina não encontrada' });
        }
        res.json(disciplina);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /disciplinas
router.post('/', async (req, res) => {
    try {
        const disciplina = await Disciplina.create(req.body);
        res.status(201).json(disciplina);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /disciplinas/:id
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Disciplina.update(req.body, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ error: 'Disciplina não encontrada' });
        }

        const disciplina = await Disciplina.findByPk(req.params.id);
        res.json(disciplina);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /disciplinas/:id
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Disciplina.destroy({
            where: { id: req.params.id }
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Disciplina não encontrada' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


