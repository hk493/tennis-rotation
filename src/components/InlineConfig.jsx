export default function InlineConfig({
  courtCount,
  perCourt,
  onAddCourt,
  onRemoveCourt,
  onSetPerCourt,
  onResetGames,
  onResetAll,
  t,
}) {
  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur border border-pink-100 shadow-soft overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-pink-50">
        {/* Courts */}
        <div className="p-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500">
            {t('courts')}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onRemoveCourt}
              disabled={courtCount <= 1}
              className="h-7 w-7 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500 text-sm font-bold active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              −
            </button>
            <span className="font-bold text-gray-800 tabular-nums w-5 text-center">
              {courtCount}
            </span>
            <button
              onClick={onAddCourt}
              className="h-7 w-7 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold active:scale-90 transition shadow-pop"
            >
              ＋
            </button>
          </div>
        </div>

        {/* Format */}
        <div className="p-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500">
            {t('format')}
          </span>
          <div className="flex items-center gap-1 bg-pink-50 rounded-full p-0.5">
            <button
              onClick={() => onSetPerCourt(2)}
              className={`text-[11px] px-2.5 py-1 rounded-full font-semibold transition ${
                perCourt === 2 ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              {t('singles')}
            </button>
            <button
              onClick={() => onSetPerCourt(4)}
              className={`text-[11px] px-2.5 py-1 rounded-full font-semibold transition ${
                perCourt === 4 ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              {t('doubles')}
            </button>
          </div>
        </div>
      </div>

      {/* Reset row */}
      <div className="grid grid-cols-2 border-t border-pink-50 divide-x divide-pink-50">
        <button
          onClick={onResetGames}
          className="px-3 py-2 text-[11px] font-semibold text-amber-700 hover:bg-amber-50 active:scale-[0.99] transition"
        >
          🔄 {t('resetGames')}
        </button>
        <button
          onClick={onResetAll}
          className="px-3 py-2 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 active:scale-[0.99] transition"
        >
          🗑 {t('resetAll')}
        </button>
      </div>
    </div>
  )
}
