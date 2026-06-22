/**
 * Soft floating decorative blobs in pastel colors.
 * Pure CSS, no canvas, very lightweight.
 */
export default function FloatingBg() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div
        className="blob animate-float-slow"
        style={{
          background: 'rgba(244, 114, 182, 0.45)',
          width: 280,
          height: 280,
          top: '-60px',
          left: '-60px',
        }}
      />
      <div
        className="blob animate-float-slow"
        style={{
          background: 'rgba(45, 212, 191, 0.4)',
          width: 320,
          height: 320,
          top: '20%',
          right: '-100px',
          animationDelay: '2s',
        }}
      />
      <div
        className="blob animate-float-slow"
        style={{
          background: 'rgba(251, 191, 36, 0.35)',
          width: 240,
          height: 240,
          bottom: '-80px',
          left: '30%',
          animationDelay: '4s',
        }}
      />
      <div
        className="blob animate-float-slow"
        style={{
          background: 'rgba(167, 139, 250, 0.3)',
          width: 180,
          height: 180,
          top: '55%',
          left: '-40px',
          animationDelay: '1s',
        }}
      />
    </div>
  )
}
