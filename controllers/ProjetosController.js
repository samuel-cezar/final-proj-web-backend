const { Projeto, Aluno, ProjetoPalavraChave, ProjetoAluno } = require('../models/sql');
const PalavraChave = require('../models/nosql/PalavraChave');

class ProjetosController {
    // Listar todos os projetos (público)
    async listar(req, res) {
        try {
            const projetos = await Projeto.findAll({
                include: [
                    {
                        model: Aluno,
                        as: 'desenvolvedores',
                        attributes: ['id', 'nome', 'email']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            // Buscar palavras-chave para cada projeto
            const projetosComPalavras = await Promise.all(
                projetos.map(async (projeto) => {
                    const palavrasChaveRel = await ProjetoPalavraChave.findAll({
                        where: { projetoId: projeto.id }
                    });

                    const palavrasChaveIds = palavrasChaveRel.map(rel => rel.palavraChaveId);
                    const palavrasChave = await PalavraChave.find({
                        _id: { $in: palavrasChaveIds }
                    });

                    return {
                        ...projeto.toJSON(),
                        palavrasChave
                    };
                })
            );

            res.json(projetosComPalavras);
        } catch (error) {
            console.error('Erro ao listar projetos:', error);
            res.status(500).json({ error: 'Erro ao listar projetos' });
        }
    }

    // Listar projetos do aluno logado
    async listarMeusProjetos(req, res) {
        try {
            const alunoId = req.session.userId;
            
            const aluno = await Aluno.findByPk(alunoId, {
                include: [
                    {
                        model: Projeto,
                        as: 'projetos',
                        include: [
                            {
                                model: Aluno,
                                as: 'desenvolvedores',
                                attributes: ['id', 'nome', 'email']
                            }
                        ]
                    }
                ]
            });

            if (!aluno) {
                return res.status(404).json({ error: 'Aluno não encontrado' });
            }

            // Buscar palavras-chave para cada projeto
            const projetosComPalavras = await Promise.all(
                aluno.projetos.map(async (projeto) => {
                    const palavrasChaveRel = await ProjetoPalavraChave.findAll({
                        where: { projetoId: projeto.id }
                    });

                    const palavrasChaveIds = palavrasChaveRel.map(rel => rel.palavraChaveId);
                    const palavrasChave = await PalavraChave.find({
                        _id: { $in: palavrasChaveIds }
                    });

                    return {
                        ...projeto.toJSON(),
                        palavrasChave
                    };
                })
            );

            res.json(projetosComPalavras);
        } catch (error) {
            console.error('Erro ao listar meus projetos:', error);
            res.status(500).json({ error: 'Erro ao listar projetos' });
        }
    }

    // Buscar projeto por ID
    async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            const projeto = await Projeto.findByPk(id, {
                include: [
                    {
                        model: Aluno,
                        as: 'desenvolvedores',
                        attributes: ['id', 'nome', 'email']
                    }
                ]
            });

            if (!projeto) {
                return res.status(404).json({ error: 'Projeto não encontrado' });
            }

            // Buscar palavras-chave
            const palavrasChaveRel = await ProjetoPalavraChave.findAll({
                where: { projetoId: projeto.id }
            });

            const palavrasChaveIds = palavrasChaveRel.map(rel => rel.palavraChaveId);
            const palavrasChave = await PalavraChave.find({
                _id: { $in: palavrasChaveIds }
            });

            res.json({
                ...projeto.toJSON(),
                palavrasChave
            });
        } catch (error) {
            console.error('Erro ao buscar projeto:', error);
            res.status(500).json({ error: 'Erro ao buscar projeto' });
        }
    }

    // Verificar se aluno é desenvolvedor do projeto
    async ehDesenvolvedor(alunoId, projetoId) {
        const projeto = await Projeto.findByPk(projetoId, {
            include: [
                {
                    model: Aluno,
                    as: 'desenvolvedores',
                    where: { id: alunoId }
                }
            ]
        });

        return !!projeto;
    }

    // Criar novo projeto
    async criar(req, res) {
        try {
            const alunoId = req.session.userId;
            const { nome, resumo, linkExterno, palavrasChaveIds } = req.body;

            // Validar dados
            if (!nome || !resumo || !linkExterno) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            // Criar projeto com criadoPorId
            const projeto = await Projeto.create({
                nome,
                resumo,
                linkExterno,
                criadoPorId: alunoId
            });

            // Adicionar criador como desenvolvedor automaticamente
            await ProjetoAluno.create({
                projetoId: projeto.id,
                alunoId: alunoId
            });

            // Adicionar palavras-chave
            if (palavrasChaveIds && palavrasChaveIds.length > 0) {
                const palavrasChaveRelacoes = palavrasChaveIds.map(palavraChaveId => ({
                    projetoId: projeto.id,
                    palavraChaveId
                }));

                await ProjetoPalavraChave.bulkCreate(palavrasChaveRelacoes);
            }

            res.status(201).json({ 
                message: 'Projeto criado com sucesso',
                projeto 
            });
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
            res.status(500).json({ error: 'Erro ao criar projeto' });
        }
    }

    // Atualizar projeto (apenas desenvolvedores)
    async atualizar(req, res) {
        try {
            const alunoId = req.session.userId;
            const { id } = req.params;
            const { nome, resumo, linkExterno, palavrasChaveIds } = req.body;

            // Verificar se é desenvolvedor
            const ehDev = await this.ehDesenvolvedor(alunoId, id);
            if (!ehDev) {
                return res.status(403).json({ error: 'Você não tem permissão para editar este projeto' });
            }

            // Atualizar projeto
            const projeto = await Projeto.findByPk(id);
            if (!projeto) {
                return res.status(404).json({ error: 'Projeto não encontrado' });
            }

            await projeto.update({ nome, resumo, linkExterno });

            // Atualizar palavras-chave
            if (palavrasChaveIds !== undefined) {
                await ProjetoPalavraChave.destroy({ where: { projetoId: id } });

                if (palavrasChaveIds.length > 0) {
                    const palavrasChaveRelacoes = palavrasChaveIds.map(palavraChaveId => ({
                        projetoId: id,
                        palavraChaveId
                    }));

                    await ProjetoPalavraChave.bulkCreate(palavrasChaveRelacoes);
                }
            }

            res.json({ 
                message: 'Projeto atualizado com sucesso',
                projeto 
            });
        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
            res.status(500).json({ error: 'Erro ao atualizar projeto' });
        }
    }

    // Excluir projeto (apenas desenvolvedores)
    async excluir(req, res) {
        try {
            const alunoId = req.session.userId;
            const { id } = req.params;

            // Verificar se é desenvolvedor
            const ehDev = await this.ehDesenvolvedor(alunoId, id);
            if (!ehDev) {
                return res.status(403).json({ error: 'Você não tem permissão para excluir este projeto' });
            }

            // Excluir palavras-chave relacionadas
            await ProjetoPalavraChave.destroy({ where: { projetoId: id } });

            // Excluir projeto (cascade remove os desenvolvedores)
            await Projeto.destroy({ where: { id } });

            res.json({ message: 'Projeto excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            res.status(500).json({ error: 'Erro ao excluir projeto' });
        }
    }

    // Adicionar desenvolvedor ao projeto
    async adicionarDesenvolvedor(req, res) {
        try {
            const alunoId = req.session.userId;
            const isAdmin = req.session.admin;
            const { id } = req.params;
            const { desenvolvedorId } = req.body;

            const projeto = await Projeto.findByPk(id);
            if (!projeto) {
                return res.status(404).json({ error: 'Projeto não encontrado' });
            }

            // Verificar se é criador ou admin
            const ehCriador = projeto.criadoPorId === alunoId;
            if (!ehCriador && !isAdmin) {
                return res.status(403).json({ error: 'Apenas o criador ou admin podem adicionar desenvolvedores' });
            }

            const novoDesenvolvedor = await Aluno.findByPk(desenvolvedorId);
            if (!novoDesenvolvedor) {
                return res.status(404).json({ error: 'Aluno não encontrado' });
            }

            // Verificar se já não é desenvolvedor
            const jaDesenvolvedor = await ProjetoAluno.findOne({
                where: { projetoId: id, alunoId: desenvolvedorId }
            });

            if (jaDesenvolvedor) {
                return res.status(400).json({ error: 'Este aluno já é desenvolvedor do projeto' });
            }

            await ProjetoAluno.create({
                projetoId: id,
                alunoId: desenvolvedorId
            });

            res.json({ message: 'Desenvolvedor adicionado com sucesso' });
        } catch (error) {
            console.error('Erro ao adicionar desenvolvedor:', error);
            res.status(500).json({ error: 'Erro ao adicionar desenvolvedor' });
        }
    }

    // Remover desenvolvedor do projeto
    async removerDesenvolvedor(req, res) {
        try {
            const alunoId = req.session.userId;
            const isAdmin = req.session.admin;
            const { id, desenvolvedorId } = req.params;

            const projeto = await Projeto.findByPk(id, {
                include: [{
                    model: Aluno,
                    as: 'desenvolvedores'
                }]
            });

            if (!projeto) {
                return res.status(404).json({ error: 'Projeto não encontrado' });
            }

            // Verificar se é criador ou admin
            const ehCriador = projeto.criadoPorId === alunoId;
            if (!ehCriador && !isAdmin) {
                return res.status(403).json({ error: 'Apenas o criador ou admin podem remover desenvolvedores' });
            }

            // Não permitir remover se for o único desenvolvedor
            if (projeto.desenvolvedores.length <= 1) {
                return res.status(400).json({ error: 'Não é possível remover o único desenvolvedor do projeto' });
            }

            await ProjetoAluno.destroy({
                where: { projetoId: id, alunoId: desenvolvedorId }
            });

            res.json({ message: 'Desenvolvedor removido com sucesso' });
        } catch (error) {
            console.error('Erro ao remover desenvolvedor:', error);
            res.status(500).json({ error: 'Erro ao remover desenvolvedor' });
        }
    }
}

module.exports = new ProjetosController();

