const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const ADMIN_EMAIL = 'jaderson.cunha@redeicm.org.br';

function isAuthorizedAdmin(req) {
  return req.user && typeof req.user.email === 'string'
    && req.user.email.trim().toLowerCase() === ADMIN_EMAIL;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/books/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'atividade-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos em formato PDF são permitidos.'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/upload', (req, res, next) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(403).json({
      error: 'Somente o administrador autorizado pode enviar livros.'
    });
  }
  return next();
}, upload.single('pdfAtividade'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum PDF foi enviado.' });
    }
    
    return res.status(201).json({
      message: 'PDF salvo e pronto para virar livro!',
      path: req.file.path
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor.' });
  }
});

module.exports = router;
