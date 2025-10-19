const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const Aluno = sequelize.define('Aluno', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    matricula: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    curso: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'alunos',
    timestamps: true
});

module.exports = Aluno;