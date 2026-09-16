import fs from 'fs';
import { formidable } from 'formidable';
import { isAdminEmail } from '../../lib/permissions';
import { bookFilePath, readBooks, writeBooks } from '../../lib/books';

export const config = { api: { bodyParser: false } };

function adminEmail(req) {
  return req.headers['x-user-email'];
}

function value(field) {
  return Array.isArray(field) ? field[0] : field;
}

function safePart(text) {
  return String(text || '').trim().replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export default async function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json(readBooks());
  if (!isAdminEmail(adminEmail(req))) return res.status(403).json({ erro: 'Ação permitida somente ao administrador.' });

  if (req.method === 'POST') {
    const form = formidable({ multiples: false, maxFileSize: 50 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);
    const pdf = value(files.pdf);
    if (!pdf || pdf.mimetype !== 'application/pdf') {
      return res.status(400).json({ erro: 'Selecione um arquivo PDF válido.' });
    }

    const id = safePart(value(fields.id));
    const educando = value(fields.educando);
    const turma = value(fields.turma);
    const educadora = value(fields.educadora);
    if (!id || !educando || !turma || !educadora) {
      return res.status(400).json({ erro: 'Preencha todos os dados do livro.' });
    }
    const filename = `${id}.pdf`;
    const books = readBooks();
    if (books.some((book) => book.id === id)) return res.status(400).json({ erro: 'Já existe um livro com este identificador.' });

    fs.mkdirSync(bookFilePath(''), { recursive: true });
    fs.renameSync(pdf.filepath, bookFilePath(filename));
    books.push({ id, arquivo: filename, educando, turma, educadora });
    writeBooks(books);
    return res.status(201).json({ ok: true, book: books[books.length - 1] });
  }

  if (req.method === 'PUT') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const books = readBooks();
    const index = books.findIndex((book) => book.id === body.id);
    if (index < 0) return res.status(404).json({ erro: 'Livro não encontrado.' });
    books[index] = { ...books[index], educando: body.educando, turma: body.turma, educadora: body.educadora };
    writeBooks(books);
    return res.status(200).json({ ok: true, book: books[index] });
  }

  if (req.method === 'DELETE') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const { id } = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const books = readBooks();
    const book = books.find((item) => item.id === id);
    if (!book) return res.status(404).json({ erro: 'Livro não encontrado.' });
    const filename = bookFilePath(book.arquivo);
    if (fs.existsSync(filename)) fs.unlinkSync(filename);
    writeBooks(books.filter((item) => item.id !== id));
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
}
