require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

const app = express();


const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://*.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});


connectDB();


app.use(contactRoutes);
app.use(quoteRoutes);


app.get('/', (req, res) => {
  res.status(200).json({ status: 'API funcionando' });
})

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/api/contact', (req, res) => {
  res.status(200).json({
    status: 'API Online'
  });
});

app.get('/api/quote', (req, res) => {
  res.status(200).json({
    status: 'API Online'
  });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// https://backend-l8vtzwkyw-gabiicarvalhos-projects.vercel.app/api/quote
//https://backend-l8vtzwkyw-gabiicarvalhos-projects.vercel.app/api/contact