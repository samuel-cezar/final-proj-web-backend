const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

// Tabela intermediária para relacionar Alunos com Conhecimentos (com nível)
const AlunoConhecimento = sequelize.define('AlunoConhecimento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    alunoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'alunoId',
        references: {
            model: 'alunos',
            key: 'id'
        }
    },
    conhecimentoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'conhecimentoId',
        references: {
            model: 'conhecimentos',
            key: 'id'
        }
    },
    nivel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 10,
            isInt: true
        }
    }
}, {
    tableName: 'aluno_conhecimento',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['alunoId', 'conhecimentoId']
        }
    ]
});

module.exports = AlunoConhecimento;

