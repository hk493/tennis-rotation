export default function EqualBadge({ stats, onClick, hasPlayers }) {
  if (!hasPlayers) {
    return (
      <button
        onClick={onClick}
        className="rounded-full bg-ink-800 border border-subtle text-slate-500 text-xs font-medium px-3 py-1.5"
      >
        均等 —
      </button>
    )
  }

  const { min, max, spread } = stats
  let tone = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
  if (spread === 2) tone = 'bg-amber-500/10 text-amber-300 border-amber-500/30'
  else if (spread >= 3) tone = 'bg-rose-500/10 text-rose-300 border-rose-500/30'

  const label = min === max ? `均等 ${min} 試合` : `均等 ${min}〜${max} 試合`

  return (
    <button
      onClick={onClick}
      className={`rounded-full border ${tone} text-xs font-semibold px-3 py-1.5 active:scale-95 transition`}
    >
      {label}
    </button>
  )
}
