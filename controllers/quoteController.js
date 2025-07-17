const Quote = require('../models/Quote');
const { sendEmailNotification } = require('../services/emailService');

exports.submitQuoteRequest = async (req, res) => {
  try {
    const { name, email, phone, service, description } = req.body;

    // Validação
    const erros = [];

    if (!name?.trim()) erros.push('Nome é obrigatório');
    if (!email?.trim()) erros.push('E-mail é obrigatório');
    if (!phone?.trim()) erros.push('Telefone é obrigatório');
    if (!service?.trim()) erros.push('Serviço é obrigatório');
    if (!description?.trim()) erros.push('Descrição é obrigatório');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    if (phone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Telefone deve ter pelo menos 10 dígitos'
      });
    }

    // Salvar no MongoDB
    const newQuote = new Quote({ name, email, phone, service, description });
    await newQuote.save();

    // Enviar e-mail
    const emailText = `Nova solicitação de orçamento:\n\nNome: ${name}\nEmail: ${email}\nTelefone: ${phone}\nServiço: ${service}\nDescrição: ${description}`;
    await sendEmailNotification(process.env.ADMIN_EMAIL, 'Nova solicitação de orçamento', emailText);

    res.status(201).json({
      success: true,
      message: 'Solicitação de orçamento enviada com sucesso'
    });

  } catch (error) {
    console.error('Erro na solicitação de orçamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar a solicitação',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    if (!quotes || quotes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nenhum orçamento encontrado'
      });
    }
    res.status(200).json({
      success: true,
      count: quotes.length,
      data: quotes
    });
  } catch (error) {
    console.error('Erro ao buscar orçamentos', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar orçamentos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};