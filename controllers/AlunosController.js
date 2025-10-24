const { Aluno, Disciplina } = require('../models/sql');

class AlunosController {
    // GET /api/alunos
    async index(req, res) {
        try {
            const alunos = await Aluno.findAll();
            res.json(alunos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/alunos/:id
    async show(req, res) {
        try {
            const aluno = await Aluno.findByPk(req.params.id);
            if (!aluno) {
                return res.status(404).json({ error: 'Aluno não encontrado' });
            }
            res.json(aluno);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // POST /api/alunos
    async store(req, res) {
        try {
            const aluno = await Aluno.create(req.body);
            res.status(201).json(aluno);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // PUT /api/alunos/:id
    async update(req, res) {
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
    }

    // DELETE /api/alunos/:id
    async destroy(req, res) {
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
    }

    // GET /api/alunos/buscar?q=termo
    async buscar(req, res) {
        try {
            const { q } = req.query;
            const { Op } = require('sequelize');

            if (!q) {
                return res.status(400).json({ error: 'Parâmetro de busca "q" é obrigatório' });
            }

            const alunos = await Aluno.findAll({
                where: {
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${q}%` } },
                        { email: { [Op.iLike]: `%${q}%` } }
                    ]
                },
                attributes: ['id', 'nome', 'email', 'matricula'],
                limit: 10
            });

            res.json(alunos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AlunosController();

