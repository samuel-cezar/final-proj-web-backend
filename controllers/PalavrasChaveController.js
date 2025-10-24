const PalavraChave = require('../models/nosql/PalavraChave');
const ProjetoPalavraChave = require('../models/sql/ProjetoPalavraChave');

class PalavrasChaveController {
    // Listar todas as palavras-chave
    async listar(req, res) {
        try {
            const palavrasChave = await PalavraChave.find().sort({ nome: 1 });
            res.json(palavrasChave);
        } catch (error) {
            console.error('Erro ao listar palavras-chave:', error);
            res.status(500).json({ error: 'Erro ao listar palavras-chave' });
        }
    }

    // Buscar palavra-chave por ID
    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const palavraChave = await PalavraChave.findById(id);

            if (!palavraChave) {
                return res.status(404).json({ error: 'Palavra-chave não encontrada' });
            }

            res.json(palavraChave);
        } catch (error) {
            console.error('Erro ao buscar palavra-chave:', error);
            res.status(500).json({ error: 'Erro ao buscar palavra-chave' });
        }
    }

    // Criar palavra-chave (Admin)
    async criar(req, res) {
        try {
            const { nome, descricao } = req.body;
            const palavraChave = await PalavraChave.create({ nome, descricao });
            res.status(201).json(palavraChave);
        } catch (error) {
            console.error('Erro ao criar palavra-chave:', error);
            res.status(500).json({ error: 'Erro ao criar palavra-chave' });
        }
    }

    // Atualizar palavra-chave (Admin)
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao } = req.body;
            const palavraChave = await PalavraChave.findByIdAndUpdate(
                id,
                { nome, descricao },
                { new: true }
            );

            if (!palavraChave) {
                return res.status(404).json({ error: 'Palavra-chave não encontrada' });
            }

            res.json(palavraChave);
        } catch (error) {
            console.error('Erro ao atualizar palavra-chave:', error);
            res.status(500).json({ error: 'Erro ao atualizar palavra-chave' });
        }
    }

    // Excluir palavra-chave (Admin)
    async excluir(req, res) {
        try {
            const { id } = req.params;

            // Verificar se está sendo usada em algum projeto
            const emUso = await ProjetoPalavraChave.findOne({ where: { palavraChaveId: id } });
            if (emUso) {
                return res.status(400).json({ 
                    error: 'Não é possível excluir palavra-chave vinculada a projetos' 
                });
            }

            const palavraChave = await PalavraChave.findByIdAndDelete(id);

            if (!palavraChave) {
                return res.status(404).json({ error: 'Palavra-chave não encontrada' });
            }

            res.json({ message: 'Palavra-chave excluída com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir palavra-chave:', error);
            res.status(500).json({ error: 'Erro ao excluir palavra-chave' });
        }
    }
}

module.exports = new PalavrasChaveController();

