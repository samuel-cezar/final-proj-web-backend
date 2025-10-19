const express = require('express');
const router = express.Router();
const { Aluno, Disciplina } = require('../models/sql');
const registrarLogAcesso = require('../middleware/LogAcesso');

router.use(registrarLogAcesso);

// GET /alunos/:id/disciplinas
router.get('/alunos/:id/disciplinas', async (req, res) => {
    try {
        const aluno = await Aluno.findByPk(req.params.id, {
            include: [{
                model: Disciplina,
                as: 'disciplinas',
                through: { attributes: [] }
            }]
        });

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        res.json(aluno.disciplinas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /matricular
router.post('/matricular', async (req, res) => {
    try {
        const { alunoId, disciplinaId } = req.body;

        const aluno = await Aluno.findByPk(alunoId);
        const disciplina = await Disciplina.findByPk(disciplinaId);

        if (!aluno || !disciplina) {
            return res.status(404).json({ error: 'Aluno ou disciplina não encontrado' });
        }

        await aluno.addDisciplina(disciplina);
        res.json({ message: 'Matrícula realizada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;