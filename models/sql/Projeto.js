const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const Projeto = sequelize.define('Projeto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resumo: {
        type: DataTypes.STRING(240),
        allowNull: false,
        validate: {
            len: {
                args: [1, 240],
                msg: 'O resumo deve ter no máximo 240 caracteres'
            }
        }
    },
    linkExterno: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: {
                msg: 'O link externo deve ser uma URL válida'
            }
        }
    },
    criadoPorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'alunos',
            key: 'id'
        }
    }
}, {
    tableName: 'projetos',
    timestamps: true
});

module.exports = Projeto;

