import { useEffect, useRef } from 'react'

const COLORS = ['#ec4899', '#14b8a6', '#fbbf24', '#a78bfa', '#60a5fa', '#f472b6']

export default function Confetti({ trigger }) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const raf = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.current = particles.current.filter((p) => {
        p.vy += 0.18 // gravity
        p.x += p.vx
        p.y += p.vy
        p.r += p.rot
        p.life -= 1
        if (p.life <= 0 || p.y > canvas.height + 30) return false
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.r)
        ctx.fillStyle = p.c
        ctx.globalAlpha = Math.max(0, p.life / 80)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5)
        ctx.restore()
        return true
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    if (!trigger) return
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 3
    const count = 120
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2
      const speed = 4 + Math.random() * 6
      particles.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        r: Math.random() * Math.PI,
        rot: (Math.random() - 0.5) * 0.3,
        size: 6 + Math.random() * 8,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 60 + Math.random() * 40,
      })
    }
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 60 }}
    />
  )
}
