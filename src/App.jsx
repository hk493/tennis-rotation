import { useState } from 'react'
import { useRotation } from './hooks/useRotation'
import ParticlesBackground from './components/ParticlesBackground'
import EqualBadge from './components/EqualBadge'
import StatsModal from './components/StatsModal'
import CourtCard from './components/CourtCard'
import WaitingList from './components/WaitingList'
import Settings from './components/Settings'

export default function App() {
  const { state, waitingPlayers, guaranteedNextIds, gameStats, actions } = useRotation()
  const [statsOpen, setStatsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [newName, setNewName] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    actions.addPlayer(newName)
    setNewName('')
  }

  const canStartAnotherCourt = waitingPlayers.length >= state.perCourt

  return (
    <div className="min-h-full text-white">
      {/* Backgrounds */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            'radial-gradient(circle at 50% 0%, rgba(44, 92, 136, 0.18), transparent 60%), #010101',
        }}
      />
      <ParticlesBackground />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-10 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎾</span>
          <span className="font-bold text-white tracking-tight">tennis rotation</span>
        </div>
        <div className="flex items-center gap-2">
          <EqualBadge
            stats={gameStats}
            hasPlayers={state.players.length > 0}
            onClick={() => setStatsOpen(true)}
          />
          <button
            onClick={() => setSettingsOpen(true)}
            className="rounded-full h-9 w-9 bg-white/5 border border-subtle text-slate-300 hover:text-white active:scale-95 transition"
            aria-label="設定"
          >
            ⚙
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-32">
        {/* Hero */}
        <section className="text-center mb-10 sm:mb-12">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Fair court rotation</p>
          <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">
            試合数が少ない人を
            <br />
            <span className="relative inline-block">
              <span className="absolute bottom-1 left-0 right-0 h-2.5 rounded-sm bg-accent/80" />
              <span className="relative">優先的に</span>
            </span>
            <span> コートへ</span>
          </h1>
          <p className="text-sm text-slate-400 mt-5 max-w-md mx-auto leading-relaxed">
            プレイヤーを追加して「試合終了」をタップするだけ。次に入る4人は自動で公平に選ばれます。
          </p>
        </section>

        {/* Courts */}
        <section className="space-y-3 mb-4">
          {state.courts.map((court, idx) => (
            <CourtCard
              key={court.id}
              court={court}
              index={idx}
              players={state.players}
              perCourt={state.perCourt}
              onStart={actions.startCourt}
              onEnd={actions.endMatch}
              canStart={canStartAnotherCourt}
            />
          ))}
        </section>

        {/* Waiting */}
        <section className="mb-6">
          <WaitingList
            waiting={waitingPlayers}
            guaranteedIds={guaranteedNextIds}
            onRemove={actions.removePlayer}
            onAdjust={actions.adjustGames}
          />
        </section>
      </div>

      {/* Add player form */}
      <form
        onSubmit={handleAdd}
        className="fixed bottom-3 left-3 right-3 z-40 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:w-full sm:max-w-xl sm:px-0 flex gap-2"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="プレイヤー名を追加"
          className="flex-1 rounded-full bg-ink-800/90 backdrop-blur border border-subtle text-white px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          enterKeyHint="done"
        />
        <button
          type="submit"
          className="rounded-full bg-accent hover:bg-accent-hover text-white px-5 py-3 text-sm font-semibold active:scale-95 disabled:opacity-40 transition"
          disabled={!newName.trim()}
        >
          追加
        </button>
      </form>

      {/* Modals */}
      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        players={state.players}
        stats={gameStats}
        onAdjust={actions.adjustGames}
      />
      <Settings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        courtCount={state.courts.length}
        perCourt={state.perCourt}
        onAddCourt={actions.addCourt}
        onRemoveCourt={actions.removeCourt}
        onSetPerCourt={actions.setPerCourt}
        onResetGames={actions.resetGameCounts}
        onResetAll={actions.resetAll}
      />
    </div>
  )
}
