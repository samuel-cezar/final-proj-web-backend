const { Conhecimento, Aluno, AlunoConhecimento } = require('../models/sql');

class ConhecimentosController {
    // Listar todos os conhecimentos disponíveis
    async listarTodos(req, res) {
        try {
            const conhecimentos = await Conhecimento.findAll({
                order: [['nome', 'ASC']]
            });

            res.json(conhecimentos);
        } catch (error) {
            console.error('Erro ao listar conhecimentos:', error);
            res.status(500).json({ error: 'Erro ao listar conhecimentos' });
        }
    }

    // Listar conhecimentos do aluno logado
    async listarMeusConhecimentos(req, res) {
        try {
            const alunoId = req.session.userId;

            const aluno = await Aluno.findByPk(alunoId, {
                include: [
                    {
                        model: Conhecimento,
                        as: 'conhecimentos',
                        through: {
                            attributes: ['nivel']
                        }
                    }
                ]
            });

            if (!aluno) {
                return res.status(404).json({ error: 'Aluno não encontrado' });
            }

            res.json(aluno.conhecimentos);
        } catch (error) {
            console.error('Erro ao listar meus conhecimentos:', error);
            res.status(500).json({ error: 'Erro ao listar conhecimentos' });
        }
    }

    // Adicionar ou atualizar conhecimento do aluno
    async adicionarOuAtualizar(req, res) {
        try {
            const alunoId = req.session.userId;
            const { conhecimentoId, nivel } = req.body;

            // Validar nível
            if (nivel < 0 || nivel > 10 || !Number.isInteger(nivel)) {
                return res.status(400).json({ error: 'O nível deve ser um número inteiro entre 0 e 10' });
            }

            // Verificar se conhecimento existe
            const conhecimento = await Conhecimento.findByPk(conhecimentoId);
            if (!conhecimento) {
                return res.status(404).json({ error: 'Conhecimento não encontrado' });
            }

            // Buscar ou criar relacionamento
            const [alunoConhecimento, criado] = await AlunoConhecimento.findOrCreate({
                where: {
                    alunoId,
                    conhecimentoId
                },
                defaults: { nivel }
            });

            if (!criado) {
                // Atualizar nível se já existe
                await alunoConhecimento.update({ nivel });
            }

            res.json({
                message: criado ? 'Conhecimento adicionado com sucesso' : 'Nível atualizado com sucesso',
                conhecimento: {
                    id: conhecimento.id,
                    nome: conhecimento.nome,
                    nivel
                }
            });
        } catch (error) {
            console.error('Erro ao adicionar/atualizar conhecimento:', error);
            res.status(500).json({ error: 'Erro ao processar conhecimento' });
        }
    }

    // Remover conhecimento do aluno
    async remover(req, res) {
        try {
            const alunoId = req.session.userId;
            const { conhecimentoId } = req.params;

            const resultado = await AlunoConhecimento.destroy({
                where: {
                    alunoId,
                    conhecimentoId
                }
            });

            if (resultado === 0) {
                return res.status(404).json({ error: 'Conhecimento não encontrado para este aluno' });
            }

            res.json({ message: 'Conhecimento removido com sucesso' });
        } catch (error) {
            console.error('Erro ao remover conhecimento:', error);
            res.status(500).json({ error: 'Erro ao remover conhecimento' });
        }
    }

    // Buscar conhecimentos de um aluno específico (público)
    async buscarPorAluno(req, res) {
        try {
            const { alunoId } = req.params;

            const aluno = await Aluno.findByPk(alunoId, {
                include: [
                    {
                        model: Conhecimento,
                        as: 'conhecimentos',
                        through: {
                            attributes: ['nivel']
                        }
                    }
                ]
            });

            if (!aluno) {
                return res.status(404).json({ error: 'Aluno não encontrado' });
            }

            res.json({
                aluno: {
                    id: aluno.id,
                    nome: aluno.nome
                },
                conhecimentos: aluno.conhecimentos
            });
        } catch (error) {
            console.error('Erro ao buscar conhecimentos do aluno:', error);
            res.status(500).json({ error: 'Erro ao buscar conhecimentos' });
        }
    }

    // ==================== MÉTODOS ADMIN ====================

    // Criar conhecimento (Admin)
    async criarAdmin(req, res) {
        try {
            const { nome, descricao } = req.body;
            const conhecimento = await Conhecimento.create({ nome, descricao });
            res.status(201).json(conhecimento);
        } catch (error) {
            console.error('Erro ao criar conhecimento:', error);
            res.status(500).json({ error: 'Erro ao criar conhecimento' });
        }
    }

    // Atualizar conhecimento (Admin)
    async atualizarAdmin(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao } = req.body;
            
            const conhecimento = await Conhecimento.findByPk(id);
            if (!conhecimento) {
                return res.status(404).json({ error: 'Conhecimento não encontrado' });
            }

            await conhecimento.update({ nome, descricao });
            res.json(conhecimento);
        } catch (error) {
            console.error('Erro ao atualizar conhecimento:', error);
            res.status(500).json({ error: 'Erro ao atualizar conhecimento' });
        }
    }

    // Excluir conhecimento (Admin)
    async excluirAdmin(req, res) {
        try {
            const { id } = req.params;

            // Verificar se está sendo usado por algum aluno
            const emUso = await AlunoConhecimento.findOne({ where: { conhecimentoId: id } });
            if (emUso) {
                return res.status(400).json({ 
                    error: 'Não é possível excluir conhecimento vinculado a alunos' 
                });
            }

            const conhecimento = await Conhecimento.findByPk(id);
            if (!conhecimento) {
                return res.status(404).json({ error: 'Conhecimento não encontrado' });
            }

            await conhecimento.destroy();
            res.json({ message: 'Conhecimento excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir conhecimento:', error);
            res.status(500).json({ error: 'Erro ao excluir conhecimento' });
        }
    }
}

module.exports = new ConhecimentosController();

