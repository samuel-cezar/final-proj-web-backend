const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const Disciplina = sequelize.define('Disciplina', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cargaHoraria: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'disciplinas',
    timestamps: true
});

module.exports = Disciplina;