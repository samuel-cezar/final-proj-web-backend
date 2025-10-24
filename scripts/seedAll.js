const sequelize = require('../config/sequelize');
const connectMongoDB = require('../config/mongoose');
const { Usuario, Aluno, Conhecimento } = require('../models/sql');
const PalavraChave = require('../models/nosql/PalavraChave');

// Dados para seed
const usuarios = [
    {
        nome: 'Administrador',
        email: 'admin@sistema.com',
        senha: 'admin123',
        admin: true
    },
    {
        nome: 'João Silva',
        email: 'joao@sistema.com',
        senha: 'joao123',
        admin: false
    },
    {
        nome: 'Maria Santos',
        email: 'maria@sistema.com',
        senha: 'maria123',
        admin: false
    },
    {
        nome: 'Pedro Oliveira',
        email: 'pedro@sistema.com',
        senha: 'pedro123',
        admin: false
    }
];

const alunos = [
    {
        nome: 'João Silva',
        email: 'joao@sistema.com',
        dataNascimento: '2000-05-15',
        matricula: '2023001',
        curso: 'Ciência da Computação'
    },
    {
        nome: 'Maria Santos',
        email: 'maria@sistema.com',
        dataNascimento: '2001-08-22',
        matricula: '2023002',
        curso: 'Engenharia de Software'
    },
    {
        nome: 'Pedro Oliveira',
        email: 'pedro@sistema.com',
        dataNascimento: '1999-12-10',
        matricula: '2023003',
        curso: 'Sistemas de Informação'
    }
];

const palavrasChave = [
    { nome: 'JavaScript', descricao: 'Linguagem de programação web', categoria: 'Linguagem' },
    { nome: 'Python', descricao: 'Linguagem de programação versátil', categoria: 'Linguagem' },
    { nome: 'Java', descricao: 'Linguagem de programação orientada a objetos', categoria: 'Linguagem' },
    { nome: 'React', descricao: 'Biblioteca JavaScript para interfaces', categoria: 'Framework' },
    { nome: 'Node.js', descricao: 'Runtime JavaScript server-side', categoria: 'Framework' },
    { nome: 'Express', descricao: 'Framework web para Node.js', categoria: 'Framework' },
    { nome: 'MongoDB', descricao: 'Banco de dados NoSQL', categoria: 'Banco de Dados' },
    { nome: 'PostgreSQL', descricao: 'Banco de dados SQL', categoria: 'Banco de Dados' },
    { nome: 'MySQL', descricao: 'Sistema de gerenciamento de banco de dados', categoria: 'Banco de Dados' },
    { nome: 'API REST', descricao: 'Arquitetura para serviços web', categoria: 'Arquitetura' },
    { nome: 'Docker', descricao: 'Plataforma de containerização', categoria: 'DevOps' },
    { nome: 'Git', descricao: 'Sistema de controle de versão', categoria: 'DevOps' },
    { nome: 'Machine Learning', descricao: 'Aprendizado de máquina', categoria: 'IA' },
    { nome: 'Deep Learning', descricao: 'Aprendizado profundo', categoria: 'IA' },
    { nome: 'HTML', descricao: 'Linguagem de marcação web', categoria: 'Web' },
    { nome: 'CSS', descricao: 'Linguagem de estilo web', categoria: 'Web' },
    { nome: 'TypeScript', descricao: 'JavaScript com tipagem estática', categoria: 'Linguagem' },
    { nome: 'Vue.js', descricao: 'Framework JavaScript progressivo', categoria: 'Framework' },
    { nome: 'Angular', descricao: 'Framework JavaScript da Google', categoria: 'Framework' },
    { nome: 'Django', descricao: 'Framework web Python', categoria: 'Framework' }
];

const conhecimentos = [
    { nome: 'JavaScript', descricao: 'Linguagem de programação web' },
    { nome: 'Python', descricao: 'Linguagem de programação versátil' },
    { nome: 'Java', descricao: 'Linguagem de programação orientada a objetos' },
    { nome: 'C++', descricao: 'Linguagem de programação de alto desempenho' },
    { nome: 'React', descricao: 'Biblioteca JavaScript para interfaces' },
    { nome: 'Node.js', descricao: 'Runtime JavaScript server-side' },
    { nome: 'Django', descricao: 'Framework web Python' },
    { nome: 'SQL', descricao: 'Linguagem de consulta estruturada' },
    { nome: 'MongoDB', descricao: 'Banco de dados NoSQL' },
    { nome: 'Docker', descricao: 'Plataforma de containerização' },
    { nome: 'Git', descricao: 'Sistema de controle de versão' },
    { nome: 'AWS', descricao: 'Amazon Web Services' },
    { nome: 'Machine Learning', descricao: 'Aprendizado de máquina' },
    { nome: 'REST API', descricao: 'API com arquitetura REST' }
];

async function seedAll() {
    try {
        console.log('Iniciando seed completo...\n');
        
        // Conectar aos bancos
        await sequelize.authenticate();
        console.log('✓ PostgreSQL conectado');
        
        await connectMongoDB();
        console.log('✓ MongoDB conectado\n');
        
        // Sincronizar modelos SQL (criar tabelas)
        await sequelize.sync({ force: true });
        console.log('✓ Tabelas SQL sincronizadas\n');
        
        // 1. Criar Usuários
        console.log('Criando usuários...');
        const usuariosCriados = await Usuario.bulkCreate(usuarios);
        console.log(`✓ ${usuariosCriados.length} usuários criados\n`);
        
        // 2. Criar Alunos e vincular aos Usuários
        console.log('Criando alunos e vinculando aos usuários...');
        for (let i = 0; i < alunos.length; i++) {
            const alunoData = {
                ...alunos[i],
                usuarioId: usuariosCriados[i + 1].id // +1 porque o primeiro é o admin sem aluno
            };
            await Aluno.create(alunoData);
        }
        console.log(`✓ ${alunos.length} alunos criados e vinculados\n`);
        
        // 3. Criar Conhecimentos
        console.log('Criando conhecimentos...');
        const conhecimentosCriados = await Conhecimento.bulkCreate(conhecimentos);
        console.log(`✓ ${conhecimentosCriados.length} conhecimentos criados\n`);
        
        // 4. Criar Palavras-chave (MongoDB)
        console.log('Criando palavras-chave no MongoDB...');
        await PalavraChave.deleteMany({}); // Limpar antes
        const palavrasChaveCriadas = await PalavraChave.insertMany(palavrasChave);
        console.log(`✓ ${palavrasChaveCriadas.length} palavras-chave criadas\n`);
        
        // Informações de acesso
        console.log('═══════════════════════════════════════════════════');
        console.log('SEED COMPLETO! Sistema pronto para uso.');
        console.log('═══════════════════════════════════════════════════\n');
        
        console.log('CREDENCIAIS DE ACESSO:\n');
        console.log('Admin:');
        console.log('  Email: admin@sistema.com');
        console.log('  Senha: admin123\n');
        
        console.log('Alunos:');
        usuarios.slice(1).forEach(u => {
            console.log(`  Email: ${u.email}`);
            console.log(`  Senha: ${u.senha.split('@')[0]}123`);
        });
        
        console.log('\n═══════════════════════════════════════════════════');
        
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao executar seed:', error);
        process.exit(1);
    }
}

seedAll();

