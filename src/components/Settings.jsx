export default function Settings({
  open,
  onClose,
  courtCount,
  perCourt,
  onAddCourt,
  onRemoveCourt,
  onSetPerCourt,
  onResetGames,
  onResetAll,
}) {
  if (!open) return null
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
          <h2 className="text-base font-semibold text-white">設定</h2>
          <button
            onClick={onClose}
            className="rounded-full h-8 w-8 bg-white/5 text-slate-300 active:scale-95"
          >
            ✕
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">コート数</p>
              <p className="text-xs text-slate-500">最低 1 まで</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onRemoveCourt}
                disabled={courtCount <= 1}
                className="h-9 w-9 rounded-full bg-white/5 text-slate-200 active:scale-95 disabled:opacity-30"
              >
                －
              </button>
              <span className="w-6 text-center font-semibold text-white tabular-nums">{courtCount}</span>
              <button
                onClick={onAddCourt}
                className="h-9 w-9 rounded-full bg-accent hover:bg-accent-hover text-white active:scale-95"
              >
                ＋
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-white mb-2">1試合あたりの人数</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSetPerCourt(2)}
                className={`rounded-xl py-3 text-sm font-medium border transition ${
                  perCourt === 2
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white/5 text-slate-300 border-subtle hover:bg-white/10'
                }`}
              >
                シングルス (2人)
              </button>
              <button
                onClick={() => onSetPerCourt(4)}
                className={`rounded-xl py-3 text-sm font-medium border transition ${
                  perCourt === 4
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white/5 text-slate-300 border-subtle hover:bg-white/10'
                }`}
              >
                ダブルス (4人)
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-subtle space-y-2">
            <button
              onClick={onResetGames}
              className="w-full rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 py-2.5 text-sm font-medium active:scale-[0.99]"
            >
              試合数を 0 にリセット
            </button>
            <button
              onClick={onResetAll}
              className="w-full rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 py-2.5 text-sm font-medium active:scale-[0.99]"
            >
              全データを初期化
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
