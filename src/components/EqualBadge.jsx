export default function EqualBadge({ stats, onClick, hasPlayers, t }) {
  if (!hasPlayers) {
    return (
      <button
        onClick={onClick}
        className="rounded-full bg-white border border-pink-100 text-gray-400 text-xs font-semibold px-3 py-1.5 shadow-sm"
      >
        {t('even')} —
      </button>
    )
  }

  const { min, max, spread } = stats
  let tone = 'bg-emerald-50 text-emerald-600 border-emerald-200'
  let emoji = '✨'
  if (spread === 2) {
    tone = 'bg-amber-50 text-amber-600 border-amber-200'
    emoji = '⚠️'
  } else if (spread >= 3) {
    tone = 'bg-rose-50 text-rose-600 border-rose-200'
    emoji = '😤'
  }
  const label = min === max ? `${t('even')} ${min}` : `${t('even')} ${min}–${max}`

  return (
    <button
      onClick={onClick}
      className={`rounded-full border ${tone} text-xs font-semibold px-3 py-1.5 active:scale-95 transition shadow-sm flex items-center gap-1`}
    >
      <span className="text-[10px]">{emoji}</span>
      <span>{label}</span>
    </button>
  )
}
