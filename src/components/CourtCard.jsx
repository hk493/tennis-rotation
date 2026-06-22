export default function CourtCard({ court, index, players, perCourt, onStart, onEnd, canStart }) {
  const onCourt = court.playerIds
    .map((id) => players.find((p) => p.id === id))
    .filter(Boolean)
  const isPlaying = onCourt.length === perCourt

  return (
    <div className="rounded-2xl bg-ink-700/60 backdrop-blur border border-subtle overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-subtle">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">Court {index + 1}</span>
          {isPlaying && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/20 text-accent">
              試合中
            </span>
          )}
        </div>
        {isPlaying ? (
          <button
            onClick={() => onEnd(court.id)}
            className="rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-4 py-1.5 active:scale-95 transition"
          >
            試合終了
          </button>
        ) : (
          <button
            onClick={() => onStart(court.id)}
            disabled={!canStart}
            className="rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-4 py-1.5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            開始
          </button>
        )}
      </div>
      <div className="p-3">
        {isPlaying ? (
          <ul className="grid grid-cols-2 gap-2">
            {onCourt.map((p) => (
              <li
                key={p.id}
                className="rounded-xl bg-accent-soft border border-accent/30 text-white px-3 py-2 text-sm font-medium flex items-center justify-between"
              >
                <span className="truncate">{p.name}</span>
                <span className="text-[10px] text-slate-300 ml-2 flex-shrink-0">{p.games} 試合</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-subtle py-6 text-center text-sm text-slate-500">
            {canStart ? '「開始」で次の試合へ' : `あと ${perCourt - onCourt.length} 人必要`}
          </div>
        )}
      </div>
    </div>
  )
}
