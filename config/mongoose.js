const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || "mongodb://admin:password@localhost:27017/?authSource=admin"

const connectMongoDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.error('Erro ao conectar com MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectMongoDB;