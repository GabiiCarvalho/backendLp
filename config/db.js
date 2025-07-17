const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,      
    });
    console.log('✅ MongoDB conectado com sucesso');
  } catch (error) {
    console.error("❌ Erro na conexão com MongoDB:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado ao DB');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado do DB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connectDB;