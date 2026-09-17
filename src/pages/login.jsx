import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Watermark from '../components/Watermark';

const DOMINIO = '@redeicm.org.br';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [msgOk, setMsgOk] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (router.query.cadastro === 'ok') setMsgOk('Conta criada com sucesso! Faça login.');
  }, [router.query]);

  async function entrar(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    if (email.endsWith(DOMINIO)) {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, acao: 'login' }),
      });
      const data = await res.json();
      setCarregando(false);
      if (!res.ok) { setErro(data.erro); return; }
      sessionStorage.setItem('educador', JSON.stringify(data));
      router.push('/educadores');
      return;
    }

    setCarregando(false);
    router.push('/estante');
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
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#005D72] sm:text-4xl">Bem-vindo</h1>
            <p className="text-[#444] mt-2">Entre com seu e-mail para acessar a Estante Virtual IP.</p>
          </div>

          <form onSubmit={entrar} className="flex flex-col gap-4">
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {erro}
              </div>
            )}
            {msgOk && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
                {msgOk}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#005D72] uppercase tracking-wider">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
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
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#005D72] bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="bg-[#FFD430] hover:bg-[#e6be28] text-[#005D72] font-bold py-3.5 rounded-full shadow-lg transition-all mt-2 disabled:opacity-60"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#444]">
              Ainda não tem acesso?{' '}
              <Link href="/primeiro-acesso" className="text-[#005D72] font-bold hover:text-[#972632] transition-colors">
                Primeiro Acesso
              </Link>
            </p>
          </div>

          <div className="mt-8 bg-[#e6f2f5] border border-[#b3d6de] rounded-xl px-5 py-4 text-xs text-[#005D72]">
            <p className="font-bold mb-1">👩🏫 Educador(a)?</p>
            <p>Use seu e-mail <strong>@redeicm.org.br</strong> para acessar a área exclusiva de educadores.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
