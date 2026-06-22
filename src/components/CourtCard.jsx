export default function CourtCard({
  court,
  index,
  players,
  perCourt,
  onStart,
  onEnd,
  onRemoveFromCourt,
  canStart,
  t,
}) {
  const onCourt = court.playerIds.map((id) => players.find((p) => p.id === id)).filter(Boolean)
  const isPlaying = onCourt.length === perCourt
  const hasAny = onCourt.length > 0

  return (
    <div className="rounded-3xl bg-white/85 backdrop-blur border border-pink-100 shadow-soft overflow-hidden animate-pop-in">
      <div className="px-4 py-3 flex items-center justify-between border-b border-pink-50">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500">
            {t('courtLabel')} {index + 1}
          </span>
          {isPlaying && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-mint-50 text-emerald-600 animate-sparkle">
              {t('playing')}
            </span>
          )}
        </div>
        {isPlaying ? (
          <button
            onClick={() => onEnd(court.id)}
            className="rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-1.5 active:scale-95 shadow-pop transition"
          >
            🎾 {t('end')}
          </button>
        ) : (
          <button
            onClick={() => onStart(court.id)}
            disabled={!canStart}
            className="rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-1.5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-pop transition"
          >
            ✨ {t('start')}
          </button>
        )}
      </div>
      <div className="p-3">
        {hasAny ? (
          <ul className="grid grid-cols-2 gap-2">
            {onCourt.map((p, i) => (
              <li
                key={p.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="animate-pop-in relative rounded-2xl bg-gradient-to-br from-pink-50 to-mint-50 border border-pink-100 text-gray-800 px-3 py-2 text-sm font-medium flex items-center justify-between group"
              >
                <span className="truncate pr-2">{p.name}</span>
                <span className="text-[10px] text-gray-500 tabular-nums flex-shrink-0">
                  {p.games}
                </span>
                <button
                  onClick={() => onRemoveFromCourt(court.id, p.id)}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-white border border-pink-200 text-pink-500 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 active:scale-90 transition shadow-sm"
                  aria-label="remove from court"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-pink-100 py-6 text-center text-sm text-gray-400">
            {canStart ? `✨ ${t('start')}` : t('needMore', perCourt - onCourt.length)}
          </div>
        )}
      </div>
    </div>
  )
}
