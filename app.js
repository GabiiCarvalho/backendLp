require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};


app.use(cors(corsOptions));


app.options('*', cors(corsOptions)); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Conectar ao banco de dados
connectDB();

// Rotas
app.use('/api', require('./routes/contactRoutes'));
app.use('/api', require('./routes/quoteRoutes'));

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Rota principal
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'API Online',
    message: 'Bem-vindo à API de contatos e orçamentos',
    endpoints: {
      contact: {
        submit: 'POST /api/contact',
        list: 'GET /api/contacts'
      },
      quote: {
        submit: 'POST /api/quote',
        list: 'GET /api/quotes'
      }
    }
  });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});