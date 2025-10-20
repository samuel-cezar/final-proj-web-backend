// Script para criar usuário admin inicial
const sequelize = require('../config/sequelize');
const Usuario = require('../models/sql/Usuario');

async function seedUsuario() {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao banco de dados');

        // Sincronizar modelo
        await Usuario.sync();

        // Verificar se já existe um admin
        const adminExistente = await Usuario.findOne({ where: { admin: true } });
        
        if (adminExistente) {
            console.log('Usuário admin já existe:', adminExistente.email);
            return;
        }

        // Criar usuário admin
        const admin = await Usuario.create({
            nome: 'Administrador',
            email: 'admin@sistema.com',
            senha: 'admin123',
            admin: true
        });

        console.log('Usuário admin criado com sucesso!');
        console.log('Email: admin@sistema.com');
        console.log('Senha: admin123');

        // Criar usuário comum de teste
        const usuario = await Usuario.create({
            nome: 'Usuário Teste',
            email: 'usuario@sistema.com',
            senha: 'usuario123',
            admin: false
        });

        console.log('\nUsuário comum criado com sucesso!');
        console.log('Email: usuario@sistema.com');
        console.log('Senha: usuario123');

        process.exit(0);
    } catch (error) {
        console.error('Erro ao criar usuários:', error);
        process.exit(1);
    }
}

seedUsuario();

