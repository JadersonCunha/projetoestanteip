import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Watermark from '../components/Watermark';

const DOMINIO = '@redeicm.org.br';

export default function PrimeiroAcesso() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(e) {
    e.preventDefault();
    setErro('');

    if (!email.endsWith(DOMINIO)) {
      setErro('O cadastro é restrito ao domínio @redeicm.org.br.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha, acao: 'cadastro' }),
    });
    const data = await res.json();
    setCarregando(false);
    if (!res.ok) { setErro(data.erro); return; }
    router.push('/login?cadastro=ok');
  }

  return (
    <div className="min-h-screen bg-[#F5F8FA] font-sans flex flex-col">
      <Watermark />
      <div className="bg-[#005D72] px-4 py-4 sm:px-8 sm:py-5">
        <Link href="/" className="text-[#FFD430] font-extrabold text-lg tracking-widest uppercase">
          ← IP
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-[#005D72] sm:text-4xl">Primeiro Acesso</h1>
            <p className="text-[#444] mt-2">Crie sua conta para acessar a área de educadores.</p>
          </div>

          <div className="bg-[#e6f2f5] border border-[#b3d6de] rounded-xl px-5 py-4 text-xs text-[#005D72] mb-6">
            <p className="font-bold mb-1">⚠️ Acesso restrito</p>
            <p>O cadastro é exclusivo para educadores com e-mail <strong>@redeicm.org.br</strong>.</p>
          </div>

          <form onSubmit={cadastrar} className="flex flex-col gap-4">
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {erro}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#005D72] uppercase tracking-wider">E-mail institucional</label>
              <input
                type="email"
                placeholder="seu.nome@redeicm.org.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#005D72] bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#005D72] uppercase tracking-wider">Senha</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#005D72] bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#005D72] uppercase tracking-wider">Confirmar senha</label>
              <input
                type="password"
                placeholder="Repita a senha"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#005D72] bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="bg-[#005D72] hover:bg-[#004f63] text-white font-bold py-3.5 rounded-full shadow-lg transition-all mt-2 disabled:opacity-60"
            >
              {carregando ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#444]">
              Já tem conta?{' '}
              <Link href="/login" className="text-[#972632] font-bold hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
