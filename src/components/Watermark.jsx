export default function Watermark() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none', overflow: 'hidden',
    }}>
      <img
        src="/logo_icm.png"
        alt=""
        style={{
          width: '55vmin',
          maxWidth: '500px',
          maxHeight: '70vh',
          opacity: 0.12,
          filter: 'grayscale(100%) contrast(0.8)',
          userSelect: 'none',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
