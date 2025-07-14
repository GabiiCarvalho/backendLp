require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();


const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  process.env.VERCEL_URL,
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


app.use('/api', require('./routes/contactRoutes'));
app.use('/api', require('./routes/quoteRoutes'));


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});