import { useEffect, useState } from 'react'

const LANG_KEY = 'tennis-rotation-lang'

export const translations = {
  ja: {
    appTitle: 'Tennis Rotation',
    tagline: '試合数が少ない人を優先的にコートへ',
    courts: 'コート数',
    courtLabel: 'Court',
    format: '形式',
    singles: 'シングルス',
    doubles: 'ダブルス',
    start: '開始',
    end: '試合終了',
    playing: '試合中',
    waiting: '待機中',
    priority: '次のゲーム',
    games: '試合',
    addPlaceholder: 'プレイヤー名を追加…',
    add: '追加',
    remove: '削除',
    even: '均等',
    needMore: (n) => `あと ${n} 人`,
    resetGames: '試合数をリセット',
    resetAll: '全データ削除',
    statsTitle: '試合数の分布',
    statsRange: (min, max, spread) => `最少 ${min} / 最多 ${max} / 差 ${spread}`,
    noPlayers: 'プレイヤーを追加してください',
    noWaiting: '待機中のプレイヤーはいません',
    confirmReset: '全データを削除しますか？',
    confirmResetGames: '試合数を 0 にリセットしますか？',
    onCourt: 'コート上',
    increase: '＋',
    decrease: '−',
  },
  en: {
    appTitle: 'Tennis Rotation',
    tagline: 'Fewer games played, higher priority',
    courts: 'Courts',
    courtLabel: 'Court',
    format: 'Format',
    singles: 'Singles',
    doubles: 'Doubles',
    start: 'Start',
    end: 'End match',
    playing: 'Playing',
    waiting: 'Waiting',
    priority: 'Up next',
    games: 'games',
    addPlaceholder: 'Add a player…',
    add: 'Add',
    remove: 'Remove',
    even: 'Even',
    needMore: (n) => `Need ${n} more`,
    resetGames: 'Reset game counts',
    resetAll: 'Reset everything',
    statsTitle: 'Game distribution',
    statsRange: (min, max, spread) => `Min ${min} / Max ${max} / Spread ${spread}`,
    noPlayers: 'Add players to begin',
    noWaiting: 'No one is waiting',
    confirmReset: 'Reset everything?',
    confirmResetGames: 'Reset all game counts to 0?',
    onCourt: 'On court',
    increase: '+',
    decrease: '−',
  },
}

export function useLang() {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY)
      if (saved === 'ja' || saved === 'en') return saved
      return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'ja'
    } catch {
      return 'ja'
    }
  })

  useEffect(() => {
    try { localStorage.setItem(LANG_KEY, lang) } catch {}
    document.documentElement.lang = lang
  }, [lang])

  const t = (key, ...args) => {
    const v = translations[lang][key]
    if (typeof v === 'function') return v(...args)
    return v ?? key
  }

  return { lang, setLang, t, toggleLang: () => setLang((l) => (l === 'ja' ? 'en' : 'ja')) }
}
