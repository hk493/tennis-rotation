export default function WaitingList({ waiting, guaranteedIds, onRemove, onAdjust, t }) {
  if (waiting.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-pink-100 p-6 text-center text-sm text-gray-400 bg-white/50 backdrop-blur">
        💭 {t('noWaiting')}
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-white/85 backdrop-blur border border-pink-100 shadow-soft overflow-hidden">
      <div className="px-4 py-2.5 border-b border-pink-50 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500">
          {t('waiting')}
        </span>
        <span className="text-[10px] text-gray-400">{waiting.length}</span>
      </div>
      <ul className="divide-y divide-pink-50">
        {waiting.map((p, idx) => {
          const priority = guaranteedIds.has(p.id)
          return (
            <li
              key={p.id}
              style={{ animationDelay: `${idx * 40}ms` }}
              className={`animate-pop-in px-3 py-2.5 flex items-center justify-between gap-2 ${
                priority ? 'bg-gradient-to-r from-butter-50 to-transparent' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {priority && (
                  <span className="text-base flex-shrink-0 animate-sparkle">⭐</span>
                )}
                <span className="font-medium text-gray-800 truncate text-sm">{p.name}</span>
                {priority && (
                  <span className="hidden sm:inline-flex text-[10px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
                    {t('priority')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onAdjust(p.id, -1)}
                  disabled={p.games === 0}
                  className="h-7 w-7 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500 text-base font-bold active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  −
                </button>
                <span className="text-xs font-bold text-gray-700 tabular-nums w-7 text-center">
                  {p.games}
                </span>
                <button
                  onClick={() => onAdjust(p.id, 1)}
                  className="h-7 w-7 rounded-full bg-mint-50 hover:bg-mint-100 text-emerald-500 text-base font-bold active:scale-90 transition"
                >
                  ＋
                </button>
                <button
                  onClick={() => onRemove(p.id)}
                  className="ml-1 h-7 w-7 rounded-full bg-gray-50 hover:bg-rose-100 text-gray-400 hover:text-rose-500 text-xs active:scale-90 transition"
                  aria-label={t('remove')}
                >
                  ✕
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
