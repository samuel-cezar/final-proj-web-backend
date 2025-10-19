const Aluno = require('./Aluno');
const Disciplina = require('./Disciplina');

// Relacionamento N:N
Aluno.belongsToMany(Disciplina, {
    through: 'AlunoDisciplina',
    foreignKey: 'alunoId',
    as: 'disciplinas'
});

Disciplina.belongsToMany(Aluno, {
    through: 'AlunoDisciplina',
    foreignKey: 'disciplinaId',
    as: 'alunos'
});

module.exports = {
    Aluno,
    Disciplina
};