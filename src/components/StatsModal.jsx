function toneFor(games, min) {
  const diff = games - min
  if (diff <= 1) return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', dot: 'bg-emerald-400' }
  if (diff === 2) return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-300', dot: 'bg-amber-400' }
  return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-300', dot: 'bg-rose-400' }
}

export default function StatsModal({ open, onClose, players, stats, onAdjust }) {
  if (!open) return null

  const sorted = [...players].sort((a, b) => a.games - b.games || a.name.localeCompare(b.name, 'ja'))

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-ink-800 border border-subtle rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-subtle flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">試合数の分布</h2>
            <p className="text-xs text-slate-400">
              最少 {stats.min} 試合 / 最多 {stats.max} 試合 / 差 {stats.spread}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full h-8 w-8 bg-white/5 text-slate-300 active:scale-95"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1.5 scroll-area">
          {sorted.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-8">プレイヤーが登録されていません</p>
          )}
          {sorted.map((p) => {
            const t = toneFor(p.games, stats.min)
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 border ${t.bg} ${t.border}`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                  <span className={`font-medium ${t.text} truncate`}>{p.name}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onAdjust(p.id, -1)}
                    disabled={p.games === 0}
                    className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 text-sm active:scale-90 disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className={`text-sm font-semibold tabular-nums min-w-[3rem] text-center ${t.text}`}>
                    {p.games} 試合
                  </span>
                  <button
                    onClick={() => onAdjust(p.id, 1)}
                    className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 text-sm active:scale-90"
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
