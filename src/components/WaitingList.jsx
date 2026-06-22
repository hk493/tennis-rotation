export default function WaitingList({ waiting, guaranteedIds, onRemove, onAdjust }) {
  if (waiting.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-subtle p-6 text-center text-sm text-slate-500 bg-ink-700/40">
        待機中のプレイヤーはいません
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-ink-700/60 backdrop-blur border border-subtle overflow-hidden">
      <div className="px-4 py-2.5 border-b border-subtle flex items-center justify-between">
        <span className="text-sm font-semibold text-white">待機中</span>
        <span className="text-[10px] text-slate-400">{waiting.length} 人</span>
      </div>
      <ul className="divide-y divide-white/5">
        {waiting.map((p) => {
          const priority = guaranteedIds.has(p.id)
          return (
            <li
              key={p.id}
              className={`px-4 py-2.5 flex items-center justify-between gap-3 ${
                priority ? 'bg-accent-soft' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-medium text-white truncate">{p.name}</span>
                {priority && (
                  <span className="text-[10px] font-semibold text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-full flex-shrink-0">
                    次のゲームで優先
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onAdjust(p.id, -1)}
                  disabled={p.games === 0}
                  className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-sm active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  aria-label="試合数を減らす"
                >
                  −
                </button>
                <span className="text-xs text-slate-300 tabular-nums min-w-[3rem] text-center">
                  {p.games} 試合
                </span>
                <button
                  onClick={() => onAdjust(p.id, 1)}
                  className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-sm active:scale-90 transition"
                  aria-label="試合数を増やす"
                >
                  ＋
                </button>
                <button
                  onClick={() => onRemove(p.id)}
                  className="ml-1 text-slate-500 hover:text-rose-400 text-[10px]"
                  aria-label="削除"
                >
                  削除
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
