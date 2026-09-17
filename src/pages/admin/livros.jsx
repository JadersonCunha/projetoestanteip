import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Watermark from '../../components/Watermark';
import { isAdminEmail } from '../../lib/permissions';
import { turmas } from '../../data/livros';

export default function GerenciarLivros() {
  const [usuario, setUsuario] = useState(null);
  const [livros, setLivros] = useState([]);
  const [form, setForm] = useState({ id: '', educando: '', turma: turmas[0].id, educadora: '', pdf: null });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('educador');
    if (saved) setUsuario(JSON.parse(saved));
  }, []);

  async function carregar() {
    const response = await fetch('/api/livros');
    setLivros(await response.json());
  }

  useEffect(() => { if (usuario && isAdminEmail(usuario.email)) carregar(); }, [usuario]);

  function alterar(event) {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  }

  async function enviar(event) {
    event.preventDefault();
    setMensagem(''); setErro('');
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => { if (value) data.append(key, value); });
    const response = await fetch('/api/livros', { method: 'POST', headers: { 'x-user-email': usuario.email }, body: data });
    const result = await response.json();
    if (!response.ok) { setErro(result.erro); return; }
    setMensagem('Livro publicado com sucesso!');
    setForm({ id: '', educando: '', turma: turmas[0].id, educadora: '', pdf: null });
    event.target.reset();
    carregar();
  }

  async function excluir(id) {
    if (!window.confirm('Excluir este livro da plataforma?')) return;
    const response = await fetch('/api/livros', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-user-email': usuario.email },
      body: JSON.stringify({ id }),
    });
    const result = await response.json();
    if (!response.ok) { setErro(result.erro); return; }
    setMensagem('Livro excluído.'); carregar();
  }

  if (!usuario || !isAdminEmail(usuario.email)) {
    return <><Navbar /><main className="px-4 py-12 text-center sm:p-12"><p>Esta página é restrita ao administrador.</p><Link href="/login">Fazer login</Link></main></>;
  }

  return <div className="min-h-screen bg-[#F5F8FA]"><Watermark /><Navbar /><main className="container-site max-w-4xl py-8 sm:py-12">
    <Link href="/educadores" className="text-[#005D72] font-bold">← Área dos educadores</Link>
    <h1 className="text-3xl font-extrabold text-[#005D72] mt-6 mb-2">Gerenciar livros</h1>
    <p className="text-[#555] mb-8">Publique novos livros ou remova os que não devem mais aparecer na estante.</p>
    <form onSubmit={enviar} className="bg-white rounded-2xl p-6 shadow-md grid gap-4 mb-8">
      <input name="id" value={form.id} onChange={alterar} placeholder="Identificador (ex.: joao-silva-gratidao)" required className="border rounded-xl px-4 py-3" />
      <input name="educando" value={form.educando} onChange={alterar} placeholder="Nome do educando" required className="border rounded-xl px-4 py-3" />
      <select name="turma" value={form.turma} onChange={alterar} className="border rounded-xl px-4 py-3">{turmas.map((turma) => <option key={turma.id} value={turma.id}>{turma.nome}</option>)}</select>
      <input name="educadora" value={form.educadora} onChange={alterar} placeholder="Nome da educadora" required className="border rounded-xl px-4 py-3" />
      <input name="pdf" type="file" accept="application/pdf" onChange={alterar} required className="border rounded-xl px-4 py-3" />
      <button className="bg-[#005D72] text-white font-bold py-3 rounded-full">Subir e publicar livro</button>
      {mensagem && <p className="text-green-600">{mensagem}</p>}{erro && <p className="text-red-600">{erro}</p>}
    </form>
    <div className="grid gap-3">{livros.map((livro) => <div key={livro.id} className="flex flex-col items-start gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><strong className="break-words">{livro.educando}</strong><p className="break-words text-sm text-gray-500">{livro.educadora} · {livro.turma}</p></div><button onClick={() => excluir(livro.id)} className="text-[#972632] font-bold">Excluir</button></div>)}</div>
  </main></div>;
}
