const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const ProjetoAluno = sequelize.define('ProjetoAluno', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    projetoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'projetos',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    alunoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'alunos',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'ProjetoAluno',
    timestamps: true
});

module.exports = ProjetoAluno;

