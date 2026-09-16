import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';

const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false });

const PORTRAIT_W = 480;
const PORTRAIT_H = 680;
const MIN_ZOOM = 0.7;
const MAX_ZOOM = 1.5;
const ZOOM_STEP = 0.1;

const turmaConfig = {
  'acolhida-manha': { bg: '#005D72', accent: '#FFD430', label: 'Acolhida Manhã' },
  'acolhida-tarde': { bg: '#007A8A', accent: '#FFD430', label: 'Acolhida Tarde' },
  'empatia-tarde':  { bg: '#972632', accent: '#FFB347', label: 'Empatia Tarde' },
  'fe-manha':       { bg: '#4A3728', accent: '#E8C97A', label: 'Fé Manhã' },
  'fe-tarde':       { bg: '#6B4226', accent: '#E8C97A', label: 'Fé Tarde' },
  'gratidao':       { bg: '#2D5016', accent: '#A8D55A', label: 'Gratidão' },
};

// Carrega o PDF.js via CDN
function loadPdfJs() {
  return new Promise((resolve) => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    document.head.appendChild(script);
  });
}

// Componente de página canvas
const CanvasPage = React.forwardRef(({ dataUrl, isCover, isBack, livro, isLandscape, side }, ref) => {
  const cfg = turmaConfig[livro?.turma] || { bg: '#1E4D3B', accent: '#FFD430', label: '' };
  const initials = livro?.educando?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div ref={ref} style={{ width: PORTRAIT_W, height: PORTRAIT_H, userSelect: 'none', overflow: 'hidden' }}
      className="bg-white select-none" onContextMenu={(e) => e.preventDefault()}>
      {isCover ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative"
          style={{ backgroundColor: cfg.bg }}>
          <div className="absolute left-0 top-0 h-full w-5" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }} />
          <div className="absolute top-0 left-5 right-0 h-2" style={{ backgroundColor: cfg.accent }} />
          <div className="absolute bottom-0 left-5 right-0 h-2" style={{ backgroundColor: cfg.accent }} />
          <p className="text-xs uppercase tracking-widest mb-8 opacity-60" style={{ color: cfg.accent }}>Instituto Providência</p>
          <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mb-6" style={{ borderColor: cfg.accent }}>
            <span className="text-4xl font-extrabold" style={{ color: cfg.accent }}>{initials}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-center text-white leading-tight">{livro?.educando}</h2>
          <p className="mt-2 text-sm opacity-70" style={{ color: cfg.accent }}>{cfg.label}</p>
          <p className="mt-8 text-xs opacity-50 text-white">IP · 2026</p>
        </div>
      ) : isBack ? (
        <div className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: cfg.bg }}>
          <p className="text-sm opacity-40 text-white">IP · Instituto Providência · 2026</p>
        </div>
      ) : dataUrl ? (
        <div style={{
          width: isLandscape ? PORTRAIT_W * 2 : PORTRAIT_W,
          height: PORTRAIT_H,
          overflow: 'hidden',
          transform: isLandscape && side === 'right' ? `translateX(-${PORTRAIT_W}px)` : 'none',
        }}>
          <img src={dataUrl} alt="" style={{ width: isLandscape ? PORTRAIT_W * 2 : PORTRAIT_W, height: PORTRAIT_H, display: 'block' }}
            draggable={false} />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
          Carregando...
        </div>
      )}
    </div>
  );
});
CanvasPage.displayName = 'CanvasPage';

export default function LivroPage() {
  const router = useRouter();
  const { id } = router.query;
  const bookRef = useRef();
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [pages, setPages] = useState([]); // { dataUrl, isLandscape }
  const [pdfLoading, setPdfLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!id) return;
    fetch('/api/livros')
      .then((r) => r.json())
      .then((books) => setLivro(books.find((b) => b.id === id)))
      .finally(() => setCarregando(false));
  }, [id]);

  useEffect(() => {
    if (!livro) return;
    setPdfLoading(true);
    const pdfUrl = `/${livro.arquivo}`;

    loadPdfJs().then(async (pdfjsLib) => {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const rendered = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 1 });
        const isLandscape = vp.width > vp.height;

        const scale = isLandscape
          ? PORTRAIT_H / vp.height
          : PORTRAIT_W / vp.width;

        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        rendered.push({ dataUrl: canvas.toDataURL('image/jpeg', 0.92), isLandscape });
      }

      setPages(rendered);
      setPdfLoading(false);
    });
  }, [livro]);

  // Monta as folhas do flipbook
  const flipPages = React.useMemo(() => {
    if (pages.length === 0) return [];
    const result = [{ type: 'cover' }];
    pages.forEach((p) => {
      if (p.isLandscape) {
        result.push({ type: 'pdf', dataUrl: p.dataUrl, isLandscape: true, side: 'left' });
        result.push({ type: 'pdf', dataUrl: p.dataUrl, isLandscape: true, side: 'right' });
      } else {
        result.push({ type: 'pdf', dataUrl: p.dataUrl, isLandscape: false });
      }
    });
    result.push({ type: 'back' });
    return result;
  }, [pages]);

  const onFlip = useCallback((e) => setCurrentPage(e.data), []);

  if (carregando) return (
    <div className="min-h-screen bg-[#FAF8F5]"><Navbar />
      <div className="flex items-center justify-center h-96 text-[#555]">Carregando...</div>
    </div>
  );
  if (!livro) return (
    <div className="min-h-screen bg-[#FAF8F5]"><Navbar />
      <div className="flex items-center justify-center h-96 text-[#555]">Livro não encontrado.</div>
    </div>
  );

  const cfg = turmaConfig[livro.turma] || { bg: '#1E4D3B', accent: '#FFD430' };
  const btnColor = cfg.accent === '#FFD430' ? '#D97736' : cfg.accent;
  const bookWrapperStyle = { width: PORTRAIT_W * 2 * zoom, height: PORTRAIT_H * zoom };
  const bookScaleStyle = {
    width: PORTRAIT_W * 2, height: PORTRAIT_H,
    transform: `scale(${zoom})`, transformOrigin: 'top center',
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans" onContextMenu={(e) => e.preventDefault()}>
      <Navbar />
      <style>{`@media print { body { display: none; } }`}</style>
      <main className="flex flex-col items-center py-10 px-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold" style={{ color: cfg.bg }}>{livro.educando}</h1>
          {livro.educadora && <p className="text-[#555] text-sm mt-1">{livro.educadora}</p>}
        </div>

        {pdfLoading && (
          <div className="flex flex-col items-center gap-3 py-20 text-[#555]">
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: cfg.bg, borderTopColor: 'transparent' }} />
            <p>Preparando livro...</p>
          </div>
        )}

        {!pdfLoading && flipPages.length > 0 && (
          <div className="overflow-x-auto flex justify-center">
            <div style={bookWrapperStyle}>
              <div style={bookScaleStyle}>
                <HTMLFlipBook ref={bookRef} width={PORTRAIT_W} height={PORTRAIT_H}
                  showCover={false} flippingTime={700} usePortrait={false}
                  startPage={0} onFlip={onFlip} className="shadow-2xl">
                  {flipPages.map((fp, i) => (
                    <CanvasPage key={i} ref={React.createRef()}
                      isCover={fp.type === 'cover'} isBack={fp.type === 'back'}
                      dataUrl={fp.dataUrl} isLandscape={fp.isLandscape} side={fp.side}
                      livro={livro} />
                  ))}
                </HTMLFlipBook>
              </div>
            </div>
          </div>
        )}

        {!pdfLoading && flipPages.length > 0 && (
          <>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <button onClick={() => bookRef.current?.pageFlip().flipPrev()}
                className="border-2 px-6 py-2 rounded-full font-bold transition"
                style={{ borderColor: cfg.bg, color: cfg.bg }}>← Voltar</button>
              <span className="text-sm text-[#555]">{currentPage + 1} / {flipPages.length}</span>
              <button onClick={() => bookRef.current?.pageFlip().flipNext()}
                className="px-6 py-2 rounded-full font-bold text-white transition"
                style={{ backgroundColor: btnColor }}>Avançar →</button>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm font-semibold text-[#555]">Zoom</span>
              <button onClick={() => setZoom((v) => Math.max(MIN_ZOOM, +(v - ZOOM_STEP).toFixed(1)))}
                disabled={zoom <= MIN_ZOOM}
                className="w-9 h-9 rounded-full border-2 text-xl font-bold disabled:opacity-40"
                style={{ borderColor: cfg.bg, color: cfg.bg }}>−</button>
              <button onClick={() => setZoom(1)} className="min-w-16 text-sm font-bold hover:underline"
                style={{ color: cfg.bg }}>{Math.round(zoom * 100)}%</button>
              <button onClick={() => setZoom((v) => Math.min(MAX_ZOOM, +(v + ZOOM_STEP).toFixed(1)))}
                disabled={zoom >= MAX_ZOOM}
                className="w-9 h-9 rounded-full border-2 text-xl font-bold disabled:opacity-40"
                style={{ borderColor: cfg.bg, color: cfg.bg }}>+</button>
            </div>
          </>
        )}

        <button onClick={() => router.back()}
          className="mt-6 text-sm underline hover:opacity-70" style={{ color: cfg.bg }}>
          ← Voltar para a estante
        </button>
      </main>
    </div>
  );
}
