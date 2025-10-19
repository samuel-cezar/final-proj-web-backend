const { Sequelize } = require('sequelize');

const dbName = process.env.PG_DB || "postgres"
const dbUser = process.env.PG_USER || "postgres"
const dbPassword = process.env.PG_PASSWORD || "1234"
const dbHost = process.env.PG_HOST || "localhost"
const dbPort = parseInt(process.env.PG_PORT || "5432", 10)

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: dbPort, // Porta padrão do PostgreSQL
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Função de teste de conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL conectado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao conectar com PostgreSQL:', error);
    return false;
  }
};

module.exports = sequelize;
module.exports.testConnection = testConnection;