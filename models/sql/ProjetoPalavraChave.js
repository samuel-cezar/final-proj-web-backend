const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

// Tabela intermediária para relacionar Projetos com PalavrasChave (MongoDB)
const ProjetoPalavraChave = sequelize.define('ProjetoPalavraChave', {
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
        }
    },
    palavraChaveId: {
        type: DataTypes.STRING, // MongoDB ObjectId como string
        allowNull: false
    }
}, {
    tableName: 'projeto_palavra_chave',
    timestamps: true
});

module.exports = ProjetoPalavraChave;

