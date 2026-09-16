import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false });
const Document = dynamic(() => import('react-pdf').then((m) => m.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then((m) => m.Page), { ssr: false });

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

const CoverPage = React.forwardRef(({ livro, isBack }, ref) => {
  const cfg = turmaConfig[livro?.turma] || { bg: '#1E4D3B', accent: '#FFD430', label: '' };
  const initials = livro?.educando?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div ref={ref} style={{ width: PORTRAIT_W, height: PORTRAIT_H, backgroundColor: cfg.bg, userSelect: 'none' }}
      className="select-none overflow-hidden relative flex flex-col items-center justify-center p-8"
      onContextMenu={(e) => e.preventDefault()}>
      <div className="absolute left-0 top-0 h-full w-5" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }} />
      <div className="absolute top-0 left-5 right-0 h-2" style={{ backgroundColor: cfg.accent }} />
      <div className="absolute bottom-0 left-5 right-0 h-2" style={{ backgroundColor: cfg.accent }} />
      {isBack ? (
        <p className="text-sm opacity-40 text-white">IP · Instituto Providência · 2026</p>
      ) : (
        <>
          <p className="text-xs uppercase tracking-widest mb-8 opacity-60" style={{ color: cfg.accent }}>Instituto Providência</p>
          <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mb-6"
            style={{ borderColor: cfg.accent }}>
            <span className="text-4xl font-extrabold" style={{ color: cfg.accent }}>{initials}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-center text-white leading-tight">{livro?.educando}</h2>
          <p className="mt-2 text-sm opacity-70" style={{ color: cfg.accent }}>{cfg.label}</p>
          <p className="mt-8 text-xs opacity-50 text-white">IP · 2026</p>
        </>
      )}
    </div>
  );
});
CoverPage.displayName = 'CoverPage';

const PdfPage = React.forwardRef(({ pageNumber, isLandscape, side }, ref) => (
  <div ref={ref} style={{ width: PORTRAIT_W, height: PORTRAIT_H, overflow: 'hidden', userSelect: 'none' }}
    className="bg-white select-none" onContextMenu={(e) => e.preventDefault()}>
    {isLandscape ? (
      <div style={{
        width: PORTRAIT_W * 2, height: PORTRAIT_H, overflow: 'hidden',
        transform: side === 'right' ? `translateX(-${PORTRAIT_W}px)` : 'none',
      }}>
        <Page pageNumber={pageNumber} height={PORTRAIT_H} devicePixelRatio={2}
          renderTextLayer={false} renderAnnotationLayer={false} />
      </div>
    ) : (
      <Page pageNumber={pageNumber} width={PORTRAIT_W} devicePixelRatio={2}
        renderTextLayer={false} renderAnnotationLayer={false} />
    )}
  </div>
));
PdfPage.displayName = 'PdfPage';

export default function LivroPage() {
  const router = useRouter();
  const { id } = router.query;
  const bookRef = useRef();
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [pageSizes, setPageSizes] = useState({});
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
    if (typeof window === 'undefined') return;
    import('react-pdf').then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
    });
  }, []);

  const pdfUrl = livro ? `/${livro.arquivo}` : '';

  const onDocumentLoad = useCallback(({ numPages: n }) => setNumPages(n), []);

  // Detecta orientação de cada página quando ela carrega
  const onPageLoad = useCallback((page) => {
    const { pageNumber, originalWidth, originalHeight } = page;
    setPageSizes((prev) => ({ ...prev, [pageNumber]: { width: originalWidth, height: originalHeight } }));
  }, []);

  const allPagesLoaded = numPages > 0 && Object.keys(pageSizes).length === numPages;

  // Monta as folhas do flipbook após todas as páginas carregarem
  const flipPages = useMemo(() => {
    if (!allPagesLoaded) return [];
    const pages = [{ type: 'cover' }];
    for (let i = 1; i <= numPages; i++) {
      const size = pageSizes[i] || { width: 1, height: 1 };
      if (size.width > size.height) {
        pages.push({ type: 'pdf', pdfPage: i, isLandscape: true, side: 'left' });
        pages.push({ type: 'pdf', pdfPage: i, isLandscape: true, side: 'right' });
      } else {
        pages.push({ type: 'pdf', pdfPage: i, isLandscape: false });
      }
    }
    pages.push({ type: 'backcover' });
    return pages;
  }, [allPagesLoaded, numPages, pageSizes]);

  const onFlip = useCallback((e) => setCurrentPage(e.data), []);

  const bookWrapperStyle = { width: PORTRAIT_W * 2 * zoom, height: PORTRAIT_H * zoom };
  const bookScaleStyle = {
    width: PORTRAIT_W * 2, height: PORTRAIT_H,
    transform: `scale(${zoom})`, transformOrigin: 'top center',
  };

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

  const cfg = turmaConfig[livro.turma] || { bg: '#1E4D3B', accent: '#FFD430' };
  const btnColor = cfg.accent === '#FFD430' ? '#D97736' : cfg.accent;

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans" onContextMenu={(e) => e.preventDefault()}>
      <Navbar />
      <style>{`@media print { body { display: none; } }`}</style>
      <main className="flex flex-col items-center py-10 px-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold" style={{ color: cfg.bg }}>{livro.educando}</h1>
          {livro.educadora && <p className="text-[#555] text-sm mt-1">{livro.educadora}</p>}
        </div>

        <Document file={pdfUrl} onLoadSuccess={onDocumentLoad}
          loading={<p className="text-[#555] py-20">Carregando PDF...</p>}
          options={{ disableAutoFetch: true, disableStream: true }}>

          {/* Renderiza páginas invisíveis para detectar orientação */}
          {!allPagesLoaded && numPages > 0 && (
            <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: -9999 }}>
              {Array.from({ length: numPages }, (_, i) => (
                <Page key={i + 1} pageNumber={i + 1} width={100}
                  onLoadSuccess={onPageLoad}
                  renderTextLayer={false} renderAnnotationLayer={false} />
              ))}
            </div>
          )}

          {allPagesLoaded && flipPages.length > 0 && (
            <div className="overflow-x-auto flex justify-center">
              <div style={bookWrapperStyle}>
                <div style={bookScaleStyle}>
                  <HTMLFlipBook ref={bookRef} width={PORTRAIT_W} height={PORTRAIT_H}
                    showCover={false} flippingTime={700} usePortrait={false}
                    startPage={0} onFlip={onFlip} className="shadow-2xl">
                    {flipPages.map((fp, i) => {
                      if (fp.type === 'cover')
                        return <CoverPage key="cover" ref={React.createRef()} livro={livro} />;
                      if (fp.type === 'backcover')
                        return <CoverPage key="back" ref={React.createRef()} livro={livro} isBack />;
                      return (
                        <PdfPage key={i} ref={React.createRef()}
                          pageNumber={fp.pdfPage} isLandscape={fp.isLandscape} side={fp.side} />
                      );
                    })}
                  </HTMLFlipBook>
                </div>
              </div>
            </div>
          )}
        </Document>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button onClick={() => bookRef.current?.pageFlip().flipPrev()}
            className="border-2 px-6 py-2 rounded-full font-bold transition"
            style={{ borderColor: cfg.bg, color: cfg.bg }}>← Voltar</button>
          <span className="text-sm text-[#555]">{currentPage + 1} / {flipPages.length || '...'}</span>
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

        <button onClick={() => router.back()}
          className="mt-6 text-sm underline hover:opacity-70" style={{ color: cfg.bg }}>
          ← Voltar para a estante
        </button>
      </main>
    </div>
  );
}
