const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const Conhecimento = sequelize.define('Conhecimento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'conhecimentos',
    timestamps: true
});

module.exports = Conhecimento;

