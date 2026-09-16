import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'comentarios.json');

function ler() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(ler());
  }

  if (req.method === 'POST') {
    const { email, texto, livroId } = req.body;
    if (!email || !texto) return res.status(400).json({ erro: 'Dados incompletos.' });

    const comentarios = ler();
    comentarios.push({
      id: Date.now(),
      email,
      livroId: livroId || null,
      texto,
      data: new Date().toISOString(),
    });
    fs.writeFileSync(filePath, JSON.stringify(comentarios, null, 2));
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
}
