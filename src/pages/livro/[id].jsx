import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

const turmaConfig = {
  'acolhida-manha': { bg: '#005D72', accent: '#FFD430', label: 'Acolhida Manhã' },
  'acolhida-tarde': { bg: '#007A8A', accent: '#FFD430', label: 'Acolhida Tarde' },
  'empatia-tarde':  { bg: '#972632', accent: '#FFB347', label: 'Empatia Tarde' },
  'fe-manha':       { bg: '#4A3728', accent: '#E8C97A', label: 'Fé Manhã' },
  'fe-tarde':       { bg: '#6B4226', accent: '#E8C97A', label: 'Fé Tarde' },
  'gratidao':       { bg: '#2D5016', accent: '#A8D55A', label: 'Gratidão' },
};

export default function LivroPage() {
  const router = useRouter();
  const { id } = router.query;
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch('/api/livros')
      .then((r) => r.json())
      .then((books) => setLivro(books.find((b) => b.id === id)))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) return (
    <div className="min-h-screen bg-[#FAF8F5]"><Navbar />
      <div className="flex items-center justify-center h-96 text-[#555]">Carregando livro...</div>
    </div>
  );

  if (!livro) return (
    <div className="min-h-screen bg-[#FAF8F5]"><Navbar />
      <div className="flex items-center justify-center h-96 text-[#555]">Livro não encontrado.</div>
    </div>
  );

  const cfg = turmaConfig[livro.turma] || { bg: '#1E4D3B', accent: '#FFD430', label: '' };
  const pdfUrl = `/${livro.arquivo}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans" onContextMenu={(e) => e.preventDefault()}>
      <Navbar />
      <style>{`@media print { body { display: none; } }`}</style>

      <main className="flex flex-col items-center py-10 px-4">
        {/* Cabeçalho estilo capa */}
        <div className="w-full max-w-3xl rounded-xl mb-6 p-6 flex items-center gap-5 shadow-lg"
          style={{ backgroundColor: cfg.bg }}>
          <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center flex-shrink-0"
            style={{ borderColor: cfg.accent }}>
            <span className="text-2xl font-extrabold" style={{ color: cfg.accent }}>
              {livro.educando.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest opacity-60 mb-1" style={{ color: cfg.accent }}>
              {cfg.label} · Instituto Providência
            </p>
            <h1 className="text-2xl font-extrabold text-white leading-tight">{livro.educando}</h1>
            {livro.educadora && <p className="text-sm mt-1 opacity-70" style={{ color: cfg.accent }}>{livro.educadora}</p>}
          </div>
        </div>

        {/* Visualizador PDF */}
        <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl border-4"
          style={{ borderColor: cfg.bg }}>
          <iframe
            src={pdfUrl}
            title={livro.educando}
            className="w-full"
            style={{ height: '80vh', border: 'none' }}
          />
        </div>

        <button onClick={() => router.back()}
          className="mt-6 text-sm underline hover:opacity-70 transition"
          style={{ color: cfg.bg }}>
          ← Voltar para a estante
        </button>
      </main>
    </div>
  );
}
