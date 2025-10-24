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
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    matricula: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    curso: {
        type: DataTypes.STRING,
        allowNull: true
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    }
}, {
    tableName: 'alunos',
    timestamps: true
});

module.exports = Aluno;