const express = require('express');
const router = express.Router();
const { Aluno, Disciplina } = require('../models/sql');
const registrarLogAcesso = require('../middleware/LogAcesso');

router.use(registrarLogAcesso);

// GET /matriculas - Listar todas as matrículas
router.get('/', async (req, res) => {
    try {
        const alunos = await Aluno.findAll({
            include: [{
                model: Disciplina,
                as: 'disciplinas',
                through: { attributes: [] }
            }]
        });

        const matriculas = [];
        alunos.forEach(aluno => {
            if (aluno.disciplinas && aluno.disciplinas.length > 0) {
                aluno.disciplinas.forEach(disciplina => {
                    matriculas.push({
                        alunoId: aluno.id,
                        alunoNome: aluno.nome,
                        alunoEmail: aluno.email,
                        disciplinaId: disciplina.id,
                        disciplinaNome: disciplina.nome,
                        disciplinaCodigo: disciplina.codigo,
                        cargaHoraria: disciplina.cargaHoraria
                    });
                });
            }
        });

        res.json(matriculas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

// POST /desmatricular
router.post('/desmatricular', async (req, res) => {
    try {
        const { alunoId, disciplinaId } = req.body;

        const aluno = await Aluno.findByPk(alunoId);
        const disciplina = await Disciplina.findByPk(disciplinaId);

        if (!aluno || !disciplina) {
            return res.status(404).json({ error: 'Aluno ou disciplina não encontrado' });
        }

        await aluno.removeDisciplina(disciplina);
        res.json({ message: 'Desmatrícula realizada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;