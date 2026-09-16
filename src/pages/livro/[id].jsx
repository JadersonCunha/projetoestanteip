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

// Página retrato — ocupa 1 folha
const PortraitPage = React.forwardRef(({ pageNumber, isCover, isBackCover, livro }, ref) => {
  const cfg = turmaConfig[livro?.turma] || { bg: '#1E4D3B', accent: '#FFD430', label: '' };
  return (
    <div
      ref={ref}
      className="bg-white select-none overflow-hidden"
      style={{ width: PORTRAIT_W, height: PORTRAIT_H, userSelect: 'none' }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {isCover ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative"
          style={{ backgroundColor: cfg.bg }}>
          <div className="absolute left-0 top-0 h-full w-5" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} />
          <div className="absolute top-0 left-5 right-0 h-2" style={{ backgroundColor: cfg.accent }} />
          <div className="absolute bottom-0 left-5 right-0 h-2" style={{ backgroundColor: cfg.accent }} />
          <p className="text-xs uppercase tracking-widest mb-8 opacity-60" style={{ color: cfg.accent }}>
            Instituto Providência
          </p>
          <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mb-6"
            style={{ borderColor: cfg.accent }}>
            <span className="text-4xl font-extrabold" style={{ color: cfg.accent }}>
              {livro?.educando?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-center text-white leading-tight">{livro?.educando}</h2>
          <p className="mt-2 text-sm opacity-70" style={{ color: cfg.accent }}>{cfg.label}</p>
          <p className="mt-8 text-xs opacity-50 text-white">IP · 2026</p>
        </div>
      ) : isBackCover ? (
        <div className="w-full h-full flex flex-col items-center justify-center"
          style={{ backgroundColor: cfg.bg }}>
          <p className="text-sm opacity-40 text-white">IP · Instituto Providência · 2026</p>
        </div>
      ) : (
        <Page
          pageNumber={pageNumber}
          width={PORTRAIT_W}
          devicePixelRatio={2}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      )}
    </div>
  );
});
PortraitPage.displayName = 'PortraitPage';

// Página paisagem — ocupa 2 folhas (spread)
const LandscapePage = React.forwardRef(({ pageNumber, side }, ref) => (
  <div
    ref={ref}
    className="bg-white select-none overflow-hidden"
    style={{ width: PORTRAIT_W, height: PORTRAIT_H, userSelect: 'none' }}
    onContextMenu={(e) => e.preventDefault()}
  >
    <div style={{ width: PORTRAIT_W * 2, height: PORTRAIT_H, overflow: 'hidden',
      transform: side === 'left' ? 'none' : `translateX(-${PORTRAIT_W}px)` }}>
      <Page
        pageNumber={pageNumber}
        height={PORTRAIT_H}
        devicePixelRatio={2}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </div>
  </div>
));
LandscapePage.displayName = 'LandscapePage';

export default function LivroPage() {
  const router = useRouter();
  const { id } = router.query;
  const bookRef = useRef();
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [pageSizes, setPageSizes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pdfReady, setPdfReady] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch('/api/livros')
      .then((r) => r.json())
      .then((books) => setLivro(books.find((b) => b.id === id)))
      .finally(() => setCarregando(false));
  }, [id]);

  useEffect(() => {
    import('react-pdf').then(({ pdfjs }) => {
      if (typeof window !== 'undefined') {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      }
    });
  }, []);

  const pdfUrl = livro ? `/${livro.arquivo}` : '';

  const onDocumentLoad = useCallback(async ({ numPages }) => {
    const { pdfjs } = await import('react-pdf');
    const pdf = await pdfjs.getDocument({ url: pdfUrl, workerSrc: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js` }).promise;
    const sizes = [];
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const vp = page.getViewport({ scale: 1 });
      sizes.push({ width: vp.width, height: vp.height });
    }
    setPageSizes(sizes);
    setPdfReady(true);
  }, [pdfUrl]);

  // Monta a lista de "folhas" do flipbook
  // Retrato → 1 folha; Paisagem → 2 folhas (left + right)
  const flipPages = useMemo(() => {
    if (!pdfReady || pageSizes.length === 0) return [];
    const pages = [{ type: 'cover' }];
    pageSizes.forEach((size, i) => {
      const isLandscape = size.width > size.height;
      if (isLandscape) {
        pages.push({ type: 'landscape-left',  pdfPage: i + 1 });
        pages.push({ type: 'landscape-right', pdfPage: i + 1 });
      } else {
        pages.push({ type: 'portrait', pdfPage: i + 1 });
      }
    });
    pages.push({ type: 'backcover' });
    return pages;
  }, [pdfReady, pageSizes]);

  const onFlip = useCallback((e) => setCurrentPage(e.data), []);

  const bookWrapperStyle = { width: PORTRAIT_W * 2 * zoom, height: PORTRAIT_H * zoom };
  const bookScaleStyle = {
    width: PORTRAIT_W * 2,
    height: PORTRAIT_H,
    transform: `scale(${zoom})`,
    transformOrigin: 'top center',
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans" onContextMenu={(e) => e.preventDefault()}>
      <Navbar />
      <style>{`@media print { body { display: none; } }`}</style>

      <main className="flex flex-col items-center py-10 px-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold" style={{ color: cfg.bg }}>{livro.educando}</h1>
          {livro.educadora && <p className="text-[#555] text-sm mt-1">{livro.educadora}</p>}
        </div>

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoad}
          loading={<p className="text-[#555] py-20">Carregando PDF...</p>}
          options={{ disableAutoFetch: true, disableStream: true }}
        >
          {pdfReady && flipPages.length > 0 && (
            <div className="overflow-x-auto flex justify-center">
              <div style={bookWrapperStyle}>
                <div style={bookScaleStyle}>
                  <HTMLFlipBook
                    ref={bookRef}
                    width={PORTRAIT_W}
                    height={PORTRAIT_H}
                    showCover={false}
                    flippingTime={700}
                    usePortrait={false}
                    startPage={0}
                    onFlip={onFlip}
                    className="shadow-2xl"
                  >
                    {flipPages.map((fp, i) => {
                      if (fp.type === 'cover')
                        return <PortraitPage key="cover" ref={React.createRef()} isCover livro={livro} />;
                      if (fp.type === 'backcover')
                        return <PortraitPage key="back" ref={React.createRef()} isBackCover livro={livro} />;
                      if (fp.type === 'portrait')
                        return <PortraitPage key={i} ref={React.createRef()} pageNumber={fp.pdfPage} livro={livro} />;
                      if (fp.type === 'landscape-left')
                        return <LandscapePage key={`${i}-l`} ref={React.createRef()} pageNumber={fp.pdfPage} side="left" />;
                      if (fp.type === 'landscape-right')
                        return <LandscapePage key={`${i}-r`} ref={React.createRef()} pageNumber={fp.pdfPage} side="right" />;
                    })}
                  </HTMLFlipBook>
                </div>
              </div>
            </div>
          )}
        </Document>

        {/* Controles */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={() => bookRef.current?.pageFlip().flipPrev()}
            className="border-2 px-6 py-2 rounded-full font-bold transition hover:text-white"
            style={{ borderColor: cfg.bg, color: cfg.bg }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = cfg.bg; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = cfg.bg; }}
          >
            ← Voltar
          </button>
          <span className="text-sm text-[#555]">{currentPage + 1} / {flipPages.length}</span>
          <button
            onClick={() => bookRef.current?.pageFlip().flipNext()}
            className="px-6 py-2 rounded-full font-bold text-white transition"
            style={{ backgroundColor: cfg.accent === '#FFD430' ? '#D97736' : cfg.accent }}
          >
            Avançar →
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-sm font-semibold text-[#555]">Zoom</span>
          <button onClick={() => setZoom((v) => Math.max(MIN_ZOOM, +(v - ZOOM_STEP).toFixed(1)))}
            disabled={zoom <= MIN_ZOOM}
            className="w-9 h-9 rounded-full border-2 text-xl font-bold disabled:opacity-40 transition"
            style={{ borderColor: cfg.bg, color: cfg.bg }}>−</button>
          <button onClick={() => setZoom(1)} className="min-w-16 text-sm font-bold hover:underline"
            style={{ color: cfg.bg }}>{Math.round(zoom * 100)}%</button>
          <button onClick={() => setZoom((v) => Math.min(MAX_ZOOM, +(v + ZOOM_STEP).toFixed(1)))}
            disabled={zoom >= MAX_ZOOM}
            className="w-9 h-9 rounded-full border-2 text-xl font-bold disabled:opacity-40 transition"
            style={{ borderColor: cfg.bg, color: cfg.bg }}>+</button>
        </div>

        <button onClick={() => router.back()}
          className="mt-6 text-sm underline transition hover:opacity-70"
          style={{ color: cfg.bg }}>
          ← Voltar para a estante
        </button>
      </main>
    </div>
  );
}
