const Aluno = require('./Aluno');
const Disciplina = require('./Disciplina');
const Usuario = require('./Usuario');
const Projeto = require('./Projeto');
const Conhecimento = require('./Conhecimento');
const ProjetoPalavraChave = require('./ProjetoPalavraChave');
const AlunoConhecimento = require('./AlunoConhecimento');
const ProjetoAluno = require('./ProjetoAluno');
const AlunoDisciplina = require('./AlunoDisciplina');

// Relacionamento 1:1 - Usuario e Aluno
Usuario.hasOne(Aluno, {
    foreignKey: 'usuarioId',
    as: 'aluno'
});

Aluno.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario'
});

// Relacionamento N:N - Alunos e Disciplinas
Aluno.belongsToMany(Disciplina, {
    through: AlunoDisciplina,
    foreignKey: 'alunoId',
    otherKey: 'disciplinaId',
    as: 'disciplinas'
});

Disciplina.belongsToMany(Aluno, {
    through: AlunoDisciplina,
    foreignKey: 'disciplinaId',
    otherKey: 'alunoId',
    as: 'alunos'
});

// Relacionamento N:N - Projetos e Alunos (desenvolvedores)
Projeto.belongsToMany(Aluno, {
    through: ProjetoAluno,
    foreignKey: 'projetoId',
    otherKey: 'alunoId',
    as: 'desenvolvedores'
});

Aluno.belongsToMany(Projeto, {
    through: ProjetoAluno,
    foreignKey: 'alunoId',
    otherKey: 'projetoId',
    as: 'projetos'
});

// Relacionamento para o criador do projeto
Projeto.belongsTo(Aluno, {
    foreignKey: 'criadoPorId',
    as: 'criador'
});

// Relacionamento N:N - Alunos e Conhecimentos (com nível)
Aluno.belongsToMany(Conhecimento, {
    through: AlunoConhecimento,
    foreignKey: 'alunoId',
    otherKey: 'conhecimentoId',
    as: 'conhecimentos'
});

Conhecimento.belongsToMany(Aluno, {
    through: AlunoConhecimento,
    foreignKey: 'conhecimentoId',
    otherKey: 'alunoId',
    as: 'alunos'
});

// Associações diretas da tabela intermediária AlunoConhecimento
AlunoConhecimento.belongsTo(Aluno, {
    foreignKey: 'alunoId',
    as: 'aluno'
});

AlunoConhecimento.belongsTo(Conhecimento, {
    foreignKey: 'conhecimentoId',
    as: 'conhecimento'
});

// Relacionamento 1:N - Projeto e PalavrasChave (referência MongoDB)
Projeto.hasMany(ProjetoPalavraChave, {
    foreignKey: 'projetoId',
    as: 'palavrasChave'
});

ProjetoPalavraChave.belongsTo(Projeto, {
    foreignKey: 'projetoId'
});

module.exports = {
    Aluno,
    Disciplina,
    Usuario,
    Projeto,
    Conhecimento,
    ProjetoPalavraChave,
    AlunoConhecimento,
    ProjetoAluno,
    AlunoDisciplina
};