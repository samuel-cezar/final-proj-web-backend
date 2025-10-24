const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const AlunoDisciplina = sequelize.define('AlunoDisciplina', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    alunoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'alunos',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    disciplinaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'disciplinas',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'AlunoDisciplina',
    timestamps: true
});

module.exports = AlunoDisciplina;

