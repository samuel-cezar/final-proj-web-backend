const sequelize = require('../config/sequelize');
const { Conhecimento } = require('../models/sql');

const conhecimentos = [
    { nome: 'JavaScript', descricao: 'Linguagem de programação web' },
    { nome: 'Python', descricao: 'Linguagem de programação versátil' },
    { nome: 'Java', descricao: 'Linguagem de programação orientada a objetos' },
    { nome: 'C++', descricao: 'Linguagem de programação de alto desempenho' },
    { nome: 'C#', descricao: 'Linguagem de programação da Microsoft' },
    { nome: 'PHP', descricao: 'Linguagem de programação web server-side' },
    { nome: 'Ruby', descricao: 'Linguagem de programação dinâmica' },
    { nome: 'Go', descricao: 'Linguagem de programação da Google' },
    { nome: 'Rust', descricao: 'Linguagem de programação de sistemas' },
    { nome: 'Swift', descricao: 'Linguagem de programação da Apple' },
    { nome: 'React', descricao: 'Biblioteca JavaScript para interfaces' },
    { nome: 'Vue.js', descricao: 'Framework JavaScript progressivo' },
    { nome: 'Angular', descricao: 'Framework JavaScript da Google' },
    { nome: 'Node.js', descricao: 'Runtime JavaScript server-side' },
    { nome: 'Django', descricao: 'Framework web Python' },
    { nome: 'Flask', descricao: 'Microframework web Python' },
    { nome: 'Spring', descricao: 'Framework Java empresarial' },
    { nome: 'ASP.NET', descricao: 'Framework web da Microsoft' },
    { nome: 'SQL', descricao: 'Linguagem de consulta estruturada' },
    { nome: 'MongoDB', descricao: 'Banco de dados NoSQL' },
    { nome: 'PostgreSQL', descricao: 'Banco de dados relacional' },
    { nome: 'MySQL', descricao: 'Sistema de gerenciamento de banco de dados' },
    { nome: 'Redis', descricao: 'Banco de dados em memória' },
    { nome: 'Docker', descricao: 'Plataforma de containerização' },
    { nome: 'Kubernetes', descricao: 'Orquestração de containers' },
    { nome: 'Git', descricao: 'Sistema de controle de versão' },
    { nome: 'Linux', descricao: 'Sistema operacional open source' },
    { nome: 'AWS', descricao: 'Amazon Web Services' },
    { nome: 'Azure', descricao: 'Microsoft Azure' },
    { nome: 'GCP', descricao: 'Google Cloud Platform' },
    { nome: 'Machine Learning', descricao: 'Aprendizado de máquina' },
    { nome: 'Deep Learning', descricao: 'Aprendizado profundo' },
    { nome: 'Data Science', descricao: 'Ciência de dados' },
    { nome: 'DevOps', descricao: 'Práticas de desenvolvimento e operações' },
    { nome: 'Agile', descricao: 'Metodologia ágil de desenvolvimento' },
    { nome: 'Scrum', descricao: 'Framework ágil de gerenciamento' },
    { nome: 'UI/UX Design', descricao: 'Design de interface e experiência' },
    { nome: 'REST API', descricao: 'API com arquitetura REST' },
    { nome: 'GraphQL', descricao: 'Linguagem de consulta para APIs' },
    { nome: 'Microservices', descricao: 'Arquitetura de microsserviços' }
];

const seedConhecimentos = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao PostgreSQL');

        // Sincronizar modelo
        await sequelize.sync();

        // Limpar tabela existente
        await Conhecimento.destroy({ where: {} });
        console.log('Conhecimentos antigos removidos');

        // Inserir novos conhecimentos
        const resultado = await Conhecimento.bulkCreate(conhecimentos);
        console.log(`${resultado.length} conhecimentos inseridos com sucesso!`);

        await sequelize.close();
        console.log('Conexão PostgreSQL encerrada');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao popular conhecimentos:', error);
        process.exit(1);
    }
};

seedConhecimentos();

