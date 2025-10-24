const mongoose = require('mongoose');
const connectMongoDB = require('../config/mongoose');
const PalavraChave = require('../models/nosql/PalavraChave');

const palavrasChave = [
    { nome: 'JavaScript', descricao: 'Linguagem de programação web' },
    { nome: 'Python', descricao: 'Linguagem de programação versátil' },
    { nome: 'Java', descricao: 'Linguagem de programação orientada a objetos' },
    { nome: 'React', descricao: 'Biblioteca JavaScript para interfaces' },
    { nome: 'Node.js', descricao: 'Runtime JavaScript server-side' },
    { nome: 'Express', descricao: 'Framework web para Node.js' },
    { nome: 'MongoDB', descricao: 'Banco de dados NoSQL' },
    { nome: 'PostgreSQL', descricao: 'Banco de dados SQL' },
    { nome: 'MySQL', descricao: 'Sistema de gerenciamento de banco de dados' },
    { nome: 'API REST', descricao: 'Arquitetura para serviços web' },
    { nome: 'Docker', descricao: 'Plataforma de containerização' },
    { nome: 'Git', descricao: 'Sistema de controle de versão' },
    { nome: 'Machine Learning', descricao: 'Aprendizado de máquina' },
    { nome: 'Deep Learning', descricao: 'Aprendizado profundo' },
    { nome: 'HTML', descricao: 'Linguagem de marcação web' },
    { nome: 'CSS', descricao: 'Linguagem de estilo web' },
    { nome: 'TypeScript', descricao: 'JavaScript com tipagem estática' },
    { nome: 'Vue.js', descricao: 'Framework JavaScript progressivo' },
    { nome: 'Angular', descricao: 'Framework JavaScript da Google' },
    { nome: 'Django', descricao: 'Framework web Python' },
    { nome: 'Flask', descricao: 'Microframework web Python' },
    { nome: 'Spring Boot', descricao: 'Framework Java para aplicações' },
    { nome: 'Microservices', descricao: 'Arquitetura de microsserviços' },
    { nome: 'GraphQL', descricao: 'Linguagem de consulta para APIs' },
    { nome: 'AWS', descricao: 'Amazon Web Services' },
    { nome: 'Azure', descricao: 'Microsoft Azure' },
    { nome: 'GCP', descricao: 'Google Cloud Platform' },
    { nome: 'Kubernetes', descricao: 'Orquestração de containers' },
    { nome: 'CI/CD', descricao: 'Integração e entrega contínuas' },
    { nome: 'TDD', descricao: 'Test Driven Development' }
];

const seedPalavrasChave = async () => {
    try {
        await connectMongoDB();
        console.log('Conectado ao MongoDB');

        // Limpar coleção existente
        await PalavraChave.deleteMany({});
        console.log('Palavras-chave antigas removidas');

        // Inserir novas palavras-chave
        const resultado = await PalavraChave.insertMany(palavrasChave);
        console.log(`${resultado.length} palavras-chave inseridas com sucesso!`);

        mongoose.connection.close();
        console.log('Conexão MongoDB encerrada');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao popular palavras-chave:', error);
        process.exit(1);
    }
};

seedPalavrasChave();

