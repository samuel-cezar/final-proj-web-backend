const { Disciplina } = require('../models/sql');

class DisciplinasController {
    // GET /api/disciplinas
    async index(req, res) {
        try {
            const disciplinas = await Disciplina.findAll();
            res.json(disciplinas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/disciplinas/:id
    async show(req, res) {
        try {
            const disciplina = await Disciplina.findByPk(req.params.id);
            if (!disciplina) {
                return res.status(404).json({ error: 'Disciplina não encontrada' });
            }
            res.json(disciplina);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // POST /api/disciplinas
    async store(req, res) {
        try {
            const disciplina = await Disciplina.create(req.body);
            res.status(201).json(disciplina);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // PUT /api/disciplinas/:id
    async update(req, res) {
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
    }

    // DELETE /api/disciplinas/:id
    async destroy(req, res) {
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
    }
}

module.exports = new DisciplinasController();

