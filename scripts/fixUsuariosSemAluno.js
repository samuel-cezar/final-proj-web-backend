const { Usuario, Aluno } = require('../models/sql');
const connectPostgreSQL = require('../config/sequelize');
const connectMongoDB = require('../config/mongoose');

async function fixUsuariosSemAluno() {
    try {
        await connectMongoDB();
        console.log('MongoDB conectado');
        
        await connectPostgreSQL.authenticate();
        console.log('PostgreSQL conectado');
        
        // Sincronizar modelos
        await connectPostgreSQL.sync();
        console.log('Modelos sincronizados');

        // Buscar todos os usuários
        const usuarios = await Usuario.findAll({
            include: [{
                model: Aluno,
                as: 'aluno',
                required: false
            }]
        });

        console.log(`\nTotal de usuários encontrados: ${usuarios.length}\n`);

        let usuariosCorrigidos = 0;
        let usuariosJaVinculados = 0;

        for (const usuario of usuarios) {
            if (!usuario.aluno) {
                console.log(`❌ Usuário sem aluno: ${usuario.nome} (${usuario.email})`);
                
                // Criar aluno para este usuário
                const novoAluno = await Aluno.create({
                    nome: usuario.nome,
                    email: usuario.email,
                    dataNascimento: new Date('2000-01-01'), // Data padrão
                    matricula: null,
                    curso: null,
                    usuarioId: usuario.id
                });

                console.log(`   ✅ Aluno criado com ID: ${novoAluno.id}`);
                usuariosCorrigidos++;
            } else {
                console.log(`✅ Usuário já vinculado: ${usuario.nome} -> Aluno ID: ${usuario.aluno.id}`);
                usuariosJaVinculados++;
            }
        }

        console.log('\n=================================');
        console.log('RESULTADO:');
        console.log(`Usuários já vinculados: ${usuariosJaVinculados}`);
        console.log(`Usuários corrigidos: ${usuariosCorrigidos}`);
        console.log('=================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Erro ao corrigir usuários:', error);
        process.exit(1);
    }
}

fixUsuariosSemAluno();

