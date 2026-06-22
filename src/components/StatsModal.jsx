function toneFor(games, min) {
  const diff = games - min
  if (diff <= 1) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-400' }
  if (diff === 2) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400' }
  return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-400' }
}

export default function StatsModal({ open, onClose, players, stats, onAdjust, t }) {
  if (!open) return null
  const sorted = [...players].sort((a, b) => a.games - b.games || a.name.localeCompare(b.name))

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-pop-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-pink-100 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-pink-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 font-display">{t('statsTitle')}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {t('statsRange', stats.min, stats.max, stats.spread)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full h-8 w-8 bg-pink-50 text-pink-500 active:scale-95"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1.5 scroll-area">
          {sorted.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">{t('noPlayers')}</p>
          )}
          {sorted.map((p) => {
            const ton = toneFor(p.games, stats.min)
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 border ${ton.bg} ${ton.border}`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={`h-2 w-2 rounded-full ${ton.dot}`} />
                  <span className={`font-medium ${ton.text} truncate`}>{p.name}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onAdjust(p.id, -1)}
                    disabled={p.games === 0}
                    className="h-7 w-7 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-base font-bold active:scale-90 disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className={`text-sm font-bold tabular-nums w-10 text-center ${ton.text}`}>
                    {p.games}
                  </span>
                  <button
                    onClick={() => onAdjust(p.id, 1)}
                    className="h-7 w-7 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-base font-bold active:scale-90"
                  >
                    ＋
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
