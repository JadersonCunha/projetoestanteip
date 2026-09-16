import fs from 'fs';
import path from 'path';
import { isAdminEmail, normalizeEmail } from '../../lib/permissions';
const DOMINIO = '@redeicm.org.br';
const senhasPath = path.join(process.cwd(), 'data', 'senhas.json');

function carregarSenhas() {
  if (!fs.existsSync(senhasPath)) return {};
  return JSON.parse(fs.readFileSync(senhasPath, 'utf-8'));
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { senha, acao } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!email || !email.endsWith(DOMINIO)) {
    return res.status(403).json({ erro: 'Acesso restrito ao domínio @redeicm.org.br' });
  }

  const senhas = carregarSenhas();

  if (acao === 'cadastro') {
    if (senhas[email]) return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    senhas[email] = senha;
    fs.writeFileSync(senhasPath, JSON.stringify(senhas, null, 2));
    return res.status(200).json({ ok: true });
  }

  if (acao === 'login') {
    if (!senhas[email] || senhas[email] !== senha) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }
    return res.status(200).json({ ok: true, email, isAdmin: isAdminEmail(email) });
  }

  return res.status(400).end();
}
