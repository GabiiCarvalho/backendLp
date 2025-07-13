const Contact = require('../models/Contact');
const { sendEmailNotification } = require('../services/emailService');


exports.submitContactForm = async (req, res) => {
  try {
    console.log('Body recebido:', req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'O corpo da requisição não pode estar vazio'
      });
    }

    const { name, email, phone, message } = req.body;


    const missingFields = [];
    if (!name?.trim()) missingFields.push('name');
    if (!email?.trim()) missingFields.push('email');
    if (!phone?.trim()) missingFields.push('phone');
    if (!message?.trim()) missingFields.push('message');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios faltando',
        missingFields
      });
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }


    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Telefone deve ter pelo menos 10 dígitos'
      });
    }


    const newContact = new Contact({
      name: name.trim(),
      email: email.trim(),
      phone: cleanedPhone,
      message: message.trim()
    });

    await newContact.save();


    if (typeof sendEmailNotification === 'function' &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.ADMIN_EMAIL) {
      const emailText = `Nova mensagem de contato:\n\nNome: ${name}\nEmail: ${email}\nTelefone: ${phone}\nMensagem: ${message}`;
      await sendEmailNotification(process.env.ADMIN_EMAIL, 'Nova mensagem do site', emailText);
    }

    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso'
    });

  } catch (error) {
    console.error('Erro no formulário de contato:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar a mensagem',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};