import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Watermark from '../components/Watermark';
import { isAdminEmail } from '../lib/permissions';

export default function Educadores() {
  const [usuario, setUsuario] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [livroId, setLivroId] = useState('');
  const [msgOk, setMsgOk] = useState('');
  const ehAdministrador = usuario && isAdminEmail(usuario.email);

  useEffect(() => {
    const salvo = sessionStorage.getItem('educador');
    if (salvo) setUsuario(JSON.parse(salvo));
  }, []);

  useEffect(() => {
    if (usuario) {
      fetch('/api/comentarios').then((r) => r.json()).then(setComentarios);
    }
  }, [usuario]);

  async function enviarComentario() {
    if (!novoComentario.trim()) return;
    await fetch('/api/comentarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: usuario.email, texto: novoComentario, livroId }),
    });
    setNovoComentario('');
    setLivroId('');
    const lista = await fetch('/api/comentarios').then((r) => r.json());
    setComentarios(lista);
    setMsgOk('Comentário enviado!');
    setTimeout(() => setMsgOk(''), 3000);
  }

  function sair() {
    sessionStorage.removeItem('educador');
    setUsuario(null);
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-[#F5F8FA] font-sans">
        <Watermark />
        <Navbar />
        <div className="flex min-h-[24rem] items-center justify-center px-4 text-center flex-col gap-4">
          <p className="text-[#444]">Você precisa estar logado para acessar esta área.</p>
          <a href="/login" className="bg-[#FFD430] text-[#005D72] font-bold px-6 py-2 rounded-full hover:bg-[#e6be28] transition">
            Fazer login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FA] font-sans">
      <Watermark />
      <Navbar />
      <main className="container-site max-w-3xl py-8 sm:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#005D72] sm:text-3xl">Área dos Educadores</h1>
            <p className="mt-1 break-all text-sm text-[#444]">{usuario.email}</p>
          </div>
          <button onClick={sair} className="text-sm text-[#972632] underline hover:opacity-70">
            Sair
          </button>
        </div>

        {/* Painel admin */}
        {ehAdministrador && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
            <h2 className="text-lg font-bold text-[#005D72] mb-1">Adicionar novo livro</h2>
            <p className="text-xs font-bold text-[#972632] mb-4">
              Somente jaderson.cunha@redeicm.org.br pode subir, editar ou excluir livros.
            </p>
            <p className="text-xs text-[#888] mb-4">
              📌 Nomeie o arquivo como{' '}
              <code className="bg-gray-100 px-1 rounded">nome-do-educando_turma_educadora.pdf</code>
              <br />
              Turmas: <strong>acolhida | empatia | fe | gratidao | trabalho-educativo</strong>
              <br />
              Exemplo: <code className="bg-gray-100 px-1 rounded">joao-silva_gratidao_maria-souza.pdf</code>
            </p>
            <p className="text-sm text-[#444] mb-4">Use a página de gerenciamento para publicar ou excluir livros.</p>
            <a href="/admin/livros" className="inline-block bg-[#005D72] text-white font-bold px-5 py-2 rounded-full">
              Gerenciar livros
            </a>
          </div>
        )}

        {/* Novo comentário */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-[#005D72] mb-4">Deixar observação</h2>
          <input
            type="text"
            placeholder="ID do livro (opcional)"
            value={livroId}
            onChange={(e) => setLivroId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm mb-3 focus:outline-none focus:border-[#005D72]"
          />
          <textarea
            rows={4}
            placeholder="Sua observação ou sugestão..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm mb-3 resize-none focus:outline-none focus:border-[#005D72]"
          />
          <button
            onClick={enviarComentario}
            className="bg-[#005D72] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#004f63] transition"
          >
            Enviar
          </button>
          {msgOk && <p className="text-green-600 text-sm mt-2">{msgOk}</p>}
        </div>

        {/* Lista */}
        <div>
          <h2 className="text-lg font-bold text-[#005D72] mb-4">Observações registradas</h2>
          {comentarios.length === 0 ? (
            <p className="text-[#aaa] text-sm">Nenhuma observação ainda.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {comentarios.map((c) => (
                <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex justify-between text-xs text-[#aaa] mb-2">
                    <span>{c.email}</span>
                    <span>{new Date(c.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {c.livroId && <p className="text-xs text-[#972632] mb-1">Livro: {c.livroId}</p>}
                  <p className="text-sm text-[#333]">{c.texto}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
