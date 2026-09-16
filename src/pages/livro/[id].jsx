import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';

const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false });

const BASE_W = 420;
const BASE_H = 600;
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 1.4;
const ZOOM_STEP = 0.1;

const turmaConfig = {
  'acolhida-manha': { bg: '#005D72', accent: '#FFD430', label: 'Acolhida Manhã' },
  'acolhida-tarde': { bg: '#007A8A', accent: '#FFD430', label: 'Acolhida Tarde' },
  'empatia-tarde':  { bg: '#972632', accent: '#FFB347', label: 'Empatia Tarde' },
  'fe-manha':       { bg: '#4A3728', accent: '#E8C97A', label: 'Fé Manhã' },
  'fe-tarde':       { bg: '#6B4226', accent: '#E8C97A', label: 'Fé Tarde' },
  'gratidao':       { bg: '#2D5016', accent: '#A8D55A', label: 'Gratidão' },
};

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

const CoverPage = React.forwardRef(({ livro, isBack, w, h }, ref) => {
  const cfg = turmaConfig[livro?.turma] || { bg: '#1E4D3B', accent: '#FFD430', label: '' };
  const initials = livro?.educando?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div ref={ref} style={{ width: w, height: h, userSelect: 'none', position: 'relative', overflow: 'hidden', backgroundColor: cfg.bg }}
      onContextMenu={(e) => e.preventDefault()}>

      {/* Lombada */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 18, height: '100%', backgroundColor: 'rgba(0,0,0,0.3)' }} />

      {/* Faixas decorativas */}
      <div style={{ position: 'absolute', top: 0, left: 18, right: 0, height: 10, backgroundColor: cfg.accent }} />
      <div style={{ position: 'absolute', bottom: 0, left: 18, right: 0, height: 10, backgroundColor: cfg.accent }} />

      {/* Círculo decorativo de fundo */}
      <div style={{ position: 'absolute', right: -60, top: -60, width: 220, height: 220, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', left: -30, bottom: -40, width: 160, height: 160, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />

      {isBack ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'white', opacity: 0.4, fontSize: 13 }}>IP · Instituto Providência · 2026</p>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 10, left: 18, right: 0, bottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 0 }}>
          <p style={{ color: cfg.accent, opacity: 0.75, fontSize: 10, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 24, textAlign: 'center' }}>Instituto Providência</p>
          <div style={{ width: 90, height: 90, borderRadius: '50%', border: `4px solid ${cfg.accent}`, backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{ color: cfg.accent, fontSize: 34, fontWeight: 900 }}>{initials}</span>
          </div>
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: 20, textAlign: 'center', lineHeight: 1.3, margin: 0, marginBottom: 10 }}>{livro?.educando}</h2>
          <div style={{ width: 40, height: 3, backgroundColor: cfg.accent, opacity: 0.6, borderRadius: 2, marginBottom: 10 }} />
          <p style={{ color: cfg.accent, opacity: 0.85, fontSize: 13, margin: 0, textAlign: 'center' }}>{cfg.label}</p>
          <p style={{ color: 'white', opacity: 0.35, fontSize: 11, marginTop: 24 }}>IP · 2026</p>
        </div>
      )}
    </div>
  );
});
CoverPage.displayName = 'CoverPage';

const PortraitPage = React.forwardRef(({ dataUrl, pageIndex, pageNumber, onToggle, cfg, w, h }, ref) => (
  <div ref={ref} style={{ width: w, height: h, userSelect: 'none', position: 'relative', overflow: 'hidden', backgroundColor: 'white' }}
    onContextMenu={(e) => e.preventDefault()}>
    {dataUrl
      ? <>
          <img src={dataUrl} alt="" style={{ width: w, height: h, objectFit: 'contain', display: 'block' }} draggable={false} />
          <span style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 11, color: cfg.bg, opacity: 0.55, fontWeight: 'bold', pointerEvents: 'none' }}>{pageNumber}</span>
          <button onClick={(e) => { e.stopPropagation(); onToggle(pageIndex); }} title="Expandir em paisagem"
            style={{ position: 'absolute', bottom: 6, right: 8, backgroundColor: cfg.bg, color: cfg.accent, border: 'none', borderRadius: '50%', width: 26, height: 26, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>⛶</button>
        </>
      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 13 }}>Carregando...</div>
    }
  </div>
));
PortraitPage.displayName = 'PortraitPage';

const LandscapePage = React.forwardRef(({ dataUrl, side, pageIndex, pageNumber, onToggle, cfg, w, h }, ref) => (
  <div ref={ref} style={{ width: w, height: h, userSelect: 'none', overflow: 'hidden', position: 'relative', backgroundColor: 'white' }}
    onContextMenu={(e) => e.preventDefault()}>
    <div style={{ width: w * 2, height: h, overflow: 'hidden', transform: side === 'right' ? `translateX(-${w}px)` : 'none' }}>
      <img src={dataUrl} alt="" style={{ width: w * 2, height: h, objectFit: 'fill', display: 'block' }} draggable={false} />
    </div>
    {side === 'right' && <>
      <span style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 11, color: cfg.bg, opacity: 0.55, fontWeight: 'bold', pointerEvents: 'none' }}>{pageNumber}</span>
      <button onClick={(e) => { e.stopPropagation(); onToggle(pageIndex); }} title="Voltar para retrato"
        style={{ position: 'absolute', bottom: 6, right: 8, backgroundColor: cfg.bg, color: cfg.accent, border: 'none', borderRadius: '50%', width: 26, height: 26, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>▢</button>
    </>}
  </div>
));
LandscapePage.displayName = 'LandscapePage';

export default function LivroPage() {
  const router = useRouter();
  const { id } = router.query;
  const bookRef = useRef();
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [pages, setPages] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [expandedPages, setExpandedPages] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);

  const W = Math.round(BASE_W * zoom);
  const H = Math.round(BASE_H * zoom);

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
    loadPdfJs().then(async (pdfjsLib) => {
      const pdf = await pdfjsLib.getDocument(`/${livro.arquivo}`).promise;
      const rendered = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp0 = page.getViewport({ scale: 1 });

        const scaleP = BASE_W / vp0.width;
        const vpP = page.getViewport({ scale: scaleP });
        const c1 = document.createElement('canvas');
        c1.width = vpP.width; c1.height = vpP.height;
        await page.render({ canvasContext: c1.getContext('2d'), viewport: vpP }).promise;

        const scaleL = BASE_H / vp0.width;
        const vpL = page.getViewport({ scale: scaleL, rotation: 90 });
        const c2 = document.createElement('canvas');
        c2.width = vpL.width; c2.height = vpL.height;
        await page.render({ canvasContext: c2.getContext('2d'), viewport: vpL }).promise;

        rendered.push({ dataUrl: c1.toDataURL('image/jpeg', 0.9), dataUrlLandscape: c2.toDataURL('image/jpeg', 0.9) });
      }
      setPages(rendered);
      setPdfLoading(false);
    });
  }, [livro]);

  const toggleExpand = useCallback((pageIndex) => {
    setExpandedPages((prev) => ({ ...prev, [pageIndex]: !prev[pageIndex] }));
  }, []);

  const flipPages = useMemo(() => {
    if (pages.length === 0) return [];
    const result = [{ type: 'cover' }];
    let num = 1;
    pages.forEach((p, i) => {
      if (expandedPages[i]) {
        result.push({ type: 'landscape-left',  pageIndex: i, dataUrl: p.dataUrlLandscape, pageNumber: num });
        result.push({ type: 'landscape-right', pageIndex: i, dataUrl: p.dataUrlLandscape, pageNumber: num });
      } else {
        result.push({ type: 'portrait', pageIndex: i, dataUrl: p.dataUrl, pageNumber: num });
      }
      num++;
    });
    result.push({ type: 'back' });
    return result;
  }, [pages, expandedPages]);

  const totalPages = flipPages.length;

  const onFlip = useCallback((e) => {
    setCurrentPage(e.data);
  }, []);

  const goNext = useCallback(() => {
    if (currentPage >= totalPages - 1) {
      bookRef.current?.pageFlip().flip(0);
    } else {
      bookRef.current?.pageFlip().flipNext();
    }
  }, [currentPage, totalPages]);

  const goPrev = useCallback(() => {
    if (currentPage <= 0) {
      bookRef.current?.pageFlip().flip(totalPages - 1);
    } else {
      bookRef.current?.pageFlip().flipPrev();
    }
  }, [currentPage, totalPages]);

  if (carregando) return <div className="min-h-screen bg-[#FAF8F5]"><Navbar /><div className="flex items-center justify-center h-96 text-[#555]">Carregando...</div></div>;
  if (!livro)    return <div className="min-h-screen bg-[#FAF8F5]"><Navbar /><div className="flex items-center justify-center h-96 text-[#555]">Livro não encontrado.</div></div>;

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

        {pdfLoading && (
          <div className="flex flex-col items-center gap-3 py-20 text-[#555]">
            <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: cfg.bg, borderTopColor: 'transparent' }} />
            <p>Preparando livro...</p>
          </div>
        )}

        {!pdfLoading && flipPages.length > 0 && (
          <div className="overflow-x-auto flex justify-center">
            <HTMLFlipBook
              key={`${W}x${H}`}
              ref={bookRef}
              width={W}
              height={H}
              showCover={true}
              flippingTime={600}
              usePortrait={false}
              startPage={0}
              onFlip={onFlip}
              className="shadow-2xl"
              style={{ margin: '0 auto' }}
            >
              {flipPages.map((fp, i) => {
                if (fp.type === 'cover')   return <CoverPage key="cover" ref={React.createRef()} livro={livro} w={W} h={H} />;
                if (fp.type === 'back')    return <CoverPage key="back"  ref={React.createRef()} livro={livro} isBack w={W} h={H} />;
                if (fp.type === 'portrait')
                  return <PortraitPage key={i} ref={React.createRef()} dataUrl={fp.dataUrl}
                    pageIndex={fp.pageIndex} pageNumber={fp.pageNumber} onToggle={toggleExpand} cfg={cfg} w={W} h={H} />;
                if (fp.type === 'landscape-left')
                  return <LandscapePage key={`${i}-l`} ref={React.createRef()} dataUrl={fp.dataUrl}
                    side="left" pageIndex={fp.pageIndex} pageNumber={fp.pageNumber} onToggle={toggleExpand} cfg={cfg} w={W} h={H} />;
                if (fp.type === 'landscape-right')
                  return <LandscapePage key={`${i}-r`} ref={React.createRef()} dataUrl={fp.dataUrl}
                    side="right" pageIndex={fp.pageIndex} pageNumber={fp.pageNumber} onToggle={toggleExpand} cfg={cfg} w={W} h={H} />;
              })}
            </HTMLFlipBook>
          </div>
        )}

        {!pdfLoading && flipPages.length > 0 && (
          <>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <button onClick={goPrev} className="border-2 px-6 py-2 rounded-full font-bold transition"
                style={{ borderColor: cfg.bg, color: cfg.bg }}>← Voltar</button>
              <span className="text-sm text-[#555]">{currentPage + 1} / {totalPages}</span>
              <button onClick={goNext} className="px-6 py-2 rounded-full font-bold text-white transition"
                style={{ backgroundColor: btnColor }}>Avançar →</button>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm font-semibold text-[#555]">Zoom</span>
              <button onClick={() => setZoom((v) => Math.max(MIN_ZOOM, +(v - ZOOM_STEP).toFixed(1)))} disabled={zoom <= MIN_ZOOM}
                className="w-9 h-9 rounded-full border-2 text-xl font-bold disabled:opacity-40"
                style={{ borderColor: cfg.bg, color: cfg.bg }}>−</button>
              <button onClick={() => setZoom(1)} className="min-w-16 text-sm font-bold hover:underline"
                style={{ color: cfg.bg }}>{Math.round(zoom * 100)}%</button>
              <button onClick={() => setZoom((v) => Math.min(MAX_ZOOM, +(v + ZOOM_STEP).toFixed(1)))} disabled={zoom >= MAX_ZOOM}
                className="w-9 h-9 rounded-full border-2 text-xl font-bold disabled:opacity-40"
                style={{ borderColor: cfg.bg, color: cfg.bg }}>+</button>
            </div>
          </>
        )}

        <button onClick={() => router.back()} className="mt-6 text-sm underline hover:opacity-70" style={{ color: cfg.bg }}>
          ← Voltar para a estante
        </button>
      </main>
    </div>
  );
}
