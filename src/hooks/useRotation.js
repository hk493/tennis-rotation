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
  } catch {}
}

/** Pick fewer-games-first, longer-wait-first. */
function pickPlayersForCourt(players, exclude, count) {
  return players
    .filter((p) => !exclude.has(p.id))
    .sort((a, b) => {
      if (a.games !== b.games) return a.games - b.games
      return (a.queuedAt ?? a.addedAt) - (b.queuedAt ?? b.addedAt)
    })
    .slice(0, count)
    .map((p) => p.id)
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
    setState((s) => {
      const isOnCourt = s.courts.some((c) => c.playerIds.includes(id))
      const players = s.players.filter((p) => p.id !== id)
      let courts = s.courts.map((c) => ({
        ...c,
        playerIds: c.playerIds.filter((pid) => pid !== id),
      }))
      // Auto-fill the freed spot from waiting list
      if (isOnCourt) {
        const onCourtIds = new Set(courts.flatMap((c) => c.playerIds))
        courts = courts.map((c) => {
          if (c.playerIds.length === 0 || c.playerIds.length >= s.perCourt) return c
          const needed = s.perCourt - c.playerIds.length
          const picks = pickPlayersForCourt(players, onCourtIds, needed)
          picks.forEach((pid) => onCourtIds.add(pid))
          return { ...c, playerIds: [...c.playerIds, ...picks] }
        })
      }
      return { ...s, players, courts }
    })
  }, [])

  const adjustGames = useCallback((id, delta) => {
    setState((s) => ({
      ...s,
      players: s.players.map((p) =>
        p.id === id ? { ...p, games: Math.max(0, p.games + delta) } : p,
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
      const released = last.playerIds
      const now = Date.now()
      return {
        ...s,
        courts: s.courts.slice(0, -1),
        players: s.players.map((p) =>
          released.includes(p.id) ? { ...p, queuedAt: now } : p,
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
      const finished = court.playerIds
      const playersAfter = s.players.map((p) =>
        finished.includes(p.id)
          ? { ...p, games: p.games + 1, queuedAt: now }
          : p,
      )
      const others = new Set(
        s.courts.filter((c) => c.id !== courtId).flatMap((c) => c.playerIds),
      )
      const picks = pickPlayersForCourt(playersAfter, others, s.perCourt)
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
        { id: `h${s.nextHistoryId}`, courtId, playerIds: finished, endedAt: now },
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

  /** Remove one player from a court (e.g. drops out mid-match). Auto-replace from waiting. */
  const removeFromCourt = useCallback((courtId, playerId) => {
    setState((s) => {
      const court = s.courts.find((c) => c.id === courtId)
      if (!court || !court.playerIds.includes(playerId)) return s
      const remaining = court.playerIds.filter((id) => id !== playerId)
      const onOthers = new Set(
        s.courts.filter((c) => c.id !== courtId).flatMap((c) => c.playerIds),
      )
      remaining.forEach((id) => onOthers.add(id))
      const replacement = pickPlayersForCourt(s.players, onOthers, 1)
      const newIds = [...remaining, ...replacement]
      const now = Date.now()
      return {
        ...s,
        courts: s.courts.map((c) =>
          c.id === courtId ? { ...c, playerIds: newIds } : c,
        ),
        players: s.players.map((p) =>
          p.id === playerId ? { ...p, queuedAt: now } : p,
        ),
      }
    })
  }, [])

  const resetAll = useCallback((confirmFn) => {
    if (!confirmFn()) return
    setState(DEFAULT_STATE)
  }, [])

  const resetGameCounts = useCallback((confirmFn) => {
    if (!confirmFn()) return
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
    return new Set(waitingPlayers.slice(0, state.perCourt).map((p) => p.id))
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
      removeFromCourt,
      adjustGames,
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
