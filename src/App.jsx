import { useState, useEffect } from 'react'
import { useRotation } from './hooks/useRotation'
import { useLang } from './i18n'
import FloatingBg from './components/FloatingBg'
import Confetti from './components/Confetti'
import EqualBadge from './components/EqualBadge'
import StatsModal from './components/StatsModal'
import CourtCard from './components/CourtCard'
import WaitingList from './components/WaitingList'
import InlineConfig from './components/InlineConfig'

export default function App() {
  const { lang, t, toggleLang } = useLang()
  const { state, waitingPlayers, guaranteedNextIds, gameStats, actions } = useRotation()
  const [statsOpen, setStatsOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [confettiTick, setConfettiTick] = useState(0)

  const handleAdd = (e) => {
    e.preventDefault()
    actions.addPlayer(newName)
    setNewName('')
  }

  const handleEnd = (courtId) => {
    actions.endMatch(courtId)
    setConfettiTick((n) => n + 1)
  }

  const handleResetAll = () => actions.resetAll(() => window.confirm(t('confirmReset')))
  const handleResetGames = () => actions.resetGameCounts(() => window.confirm(t('confirmResetGames')))

  const canStartAnotherCourt = waitingPlayers.length >= state.perCourt

  return (
    <div className="min-h-full text-gray-800 relative">
      <FloatingBg />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/60 border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-wiggle">🎾</span>
            <div>
              <h1 className="font-display font-extrabold text-gray-900 text-base leading-none">
                {t('appTitle')}
              </h1>
              <p className="text-[10px] text-gray-500 mt-0.5">{t('tagline')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EqualBadge
              stats={gameStats}
              hasPlayers={state.players.length > 0}
              onClick={() => setStatsOpen(true)}
              t={t}
            />
            <button
              onClick={toggleLang}
              className="rounded-full h-8 px-3 bg-white border border-pink-100 text-gray-700 text-[11px] font-bold active:scale-95 transition shadow-sm"
              aria-label="toggle language"
            >
              {lang === 'ja' ? 'EN' : 'JA'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 pt-4 pb-28">
        {/* Inline config */}
        <section className="mb-3">
          <InlineConfig
            courtCount={state.courts.length}
            perCourt={state.perCourt}
            onAddCourt={actions.addCourt}
            onRemoveCourt={actions.removeCourt}
            onSetPerCourt={actions.setPerCourt}
            onResetGames={handleResetGames}
            onResetAll={handleResetAll}
            t={t}
          />
        </section>

        {/* Courts */}
        <section className="space-y-3 mb-3">
          {state.courts.map((court, idx) => (
            <CourtCard
              key={court.id}
              court={court}
              index={idx}
              players={state.players}
              perCourt={state.perCourt}
              onStart={actions.startCourt}
              onEnd={handleEnd}
              onRemoveFromCourt={actions.removeFromCourt}
              canStart={canStartAnotherCourt}
              t={t}
            />
          ))}
        </section>

        {/* Waiting */}
        <section className="mb-3">
          <WaitingList
            waiting={waitingPlayers}
            guaranteedIds={guaranteedNextIds}
            onRemove={actions.removePlayer}
            onAdjust={actions.adjustGames}
            t={t}
          />
        </section>

        {state.players.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-400">
            <p className="mb-2">👇</p>
            <p>{t('noPlayers')}</p>
          </div>
        )}
      </main>

      {/* Add player form */}
      <form
        onSubmit={handleAdd}
        className="fixed bottom-3 left-3 right-3 z-40 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:w-full sm:max-w-xl flex gap-2"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={t('addPlaceholder')}
          className="flex-1 rounded-full bg-white/90 backdrop-blur border border-pink-100 text-gray-800 px-5 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-200 shadow-soft"
          enterKeyHint="done"
        />
        <button
          type="submit"
          className="rounded-full bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 text-sm font-bold active:scale-95 disabled:opacity-40 shadow-pop transition"
          disabled={!newName.trim()}
        >
          ✨ {t('add')}
        </button>
      </form>

      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        players={state.players}
        stats={gameStats}
        onAdjust={actions.adjustGames}
        t={t}
      />

      <Confetti trigger={confettiTick} />
    </div>
  )
}
