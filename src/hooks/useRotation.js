import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'tennis-rotation-v1'

const DEFAULT_STATE = {
  players: [],
  courts: [{ id: 'c1', playerIds: [], startedAt: null }],
  perCourt: 4,
  history: [],
  nextPlayerId: 1,
  nextCourtId: 2,
  nextHistoryId: 1,
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_STATE, ...parsed }
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

/**
 * Pick next players for a court.
 * Priority: fewer games first, then longer wait time first.
 */
function pickPlayersForCourt(players, exclude, perCourt) {
  const available = players
    .filter((p) => !exclude.has(p.id))
    .sort((a, b) => {
      if (a.games !== b.games) return a.games - b.games
      const ax = a.queuedAt ?? a.addedAt
      const bx = b.queuedAt ?? b.addedAt
      return ax - bx
    })
  return available.slice(0, perCourt).map((p) => p.id)
}

export function useRotation() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const addPlayer = useCallback((name) => {
    if (!name?.trim()) return
    setState((s) => ({
      ...s,
      nextPlayerId: s.nextPlayerId + 1,
      players: [
        ...s.players,
        {
          id: `p${s.nextPlayerId}`,
          name: name.trim(),
          games: 0,
          addedAt: Date.now(),
          queuedAt: Date.now(),
        },
      ],
    }))
  }, [])

  const removePlayer = useCallback((id) => {
    setState((s) => ({
      ...s,
      players: s.players.filter((p) => p.id !== id),
      courts: s.courts.map((c) => ({
        ...c,
        playerIds: c.playerIds.filter((pid) => pid !== id),
      })),
    }))
  }, [])

  const adjustGames = useCallback((id, delta) => {
    setState((s) => ({
      ...s,
      players: s.players.map((p) =>
        p.id === id ? { ...p, games: Math.max(0, p.games + delta) } : p,
      ),
    }))
  }, [])

  const setGames = useCallback((id, value) => {
    setState((s) => ({
      ...s,
      players: s.players.map((p) =>
        p.id === id ? { ...p, games: Math.max(0, Number(value) || 0) } : p,
      ),
    }))
  }, [])

  const setPerCourt = useCallback((n) => {
    setState((s) => ({ ...s, perCourt: n }))
  }, [])

  const addCourt = useCallback(() => {
    setState((s) => ({
      ...s,
      nextCourtId: s.nextCourtId + 1,
      courts: [...s.courts, { id: `c${s.nextCourtId}`, playerIds: [], startedAt: null }],
    }))
  }, [])

  const removeCourt = useCallback(() => {
    setState((s) => {
      if (s.courts.length <= 1) return s
      const last = s.courts[s.courts.length - 1]
      const releasedIds = last.playerIds
      const now = Date.now()
      return {
        ...s,
        courts: s.courts.slice(0, -1),
        players: s.players.map((p) =>
          releasedIds.includes(p.id) ? { ...p, queuedAt: now } : p,
        ),
      }
    })
  }, [])

  const startCourt = useCallback((courtId) => {
    setState((s) => {
      const onCourtIds = new Set(s.courts.flatMap((c) => c.playerIds))
      const picks = pickPlayersForCourt(s.players, onCourtIds, s.perCourt)
      if (picks.length < s.perCourt) return s
      return {
        ...s,
        courts: s.courts.map((c) =>
          c.id === courtId ? { ...c, playerIds: picks, startedAt: Date.now() } : c,
        ),
      }
    })
  }, [])

  const endMatch = useCallback((courtId) => {
    setState((s) => {
      const court = s.courts.find((c) => c.id === courtId)
      if (!court || court.playerIds.length === 0) return s
      const now = Date.now()
      const finishedIds = court.playerIds
      const playersAfter = s.players.map((p) =>
        finishedIds.includes(p.id)
          ? { ...p, games: p.games + 1, queuedAt: now }
          : p,
      )

      const stillOnOtherCourts = new Set(
        s.courts.filter((c) => c.id !== courtId).flatMap((c) => c.playerIds),
      )
      const picks = pickPlayersForCourt(playersAfter, stillOnOtherCourts, s.perCourt)

      const courts = s.courts.map((c) =>
        c.id === courtId
          ? {
              ...c,
              playerIds: picks.length === s.perCourt ? picks : [],
              startedAt: picks.length === s.perCourt ? now : null,
            }
          : c,
      )

      const history = [
        {
          id: `h${s.nextHistoryId}`,
          courtId,
          playerIds: finishedIds,
          endedAt: now,
        },
        ...s.history,
      ].slice(0, 50)

      return {
        ...s,
        players: playersAfter,
        courts,
        history,
        nextHistoryId: s.nextHistoryId + 1,
      }
    })
  }, [])

  const resetAll = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm('全データをリセットしますか？')) return
    setState(DEFAULT_STATE)
  }, [])

  const resetGameCounts = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm('試合数を0にリセットしますか？')) return
    setState((s) => ({
      ...s,
      players: s.players.map((p) => ({ ...p, games: 0, queuedAt: Date.now() })),
      history: [],
    }))
  }, [])

  const onCourtIds = useMemo(
    () => new Set(state.courts.flatMap((c) => c.playerIds)),
    [state.courts],
  )

  const waitingPlayers = useMemo(
    () =>
      state.players
        .filter((p) => !onCourtIds.has(p.id))
        .sort((a, b) => {
          if (a.games !== b.games) return a.games - b.games
          return (a.queuedAt ?? a.addedAt) - (b.queuedAt ?? b.addedAt)
        }),
    [state.players, onCourtIds],
  )

  const guaranteedNextIds = useMemo(() => {
    const slotsPerRound = state.perCourt
    return new Set(waitingPlayers.slice(0, slotsPerRound).map((p) => p.id))
  }, [waitingPlayers, state.perCourt])

  const gameStats = useMemo(() => {
    if (state.players.length === 0) return { min: 0, max: 0, spread: 0 }
    const counts = state.players.map((p) => p.games)
    const min = Math.min(...counts)
    const max = Math.max(...counts)
    return { min, max, spread: max - min }
  }, [state.players])

  return {
    state,
    waitingPlayers,
    guaranteedNextIds,
    gameStats,
    actions: {
      addPlayer,
      removePlayer,
      adjustGames,
      setGames,
      setPerCourt,
      addCourt,
      removeCourt,
      startCourt,
      endMatch,
      resetAll,
      resetGameCounts,
    },
  }
}
