const SIGNALS = {
  BREAKOUT: "bg-green-500/10 text-green-400 border-green-500/20",
  RISING: "bg-secondary-container/20 text-secondary border-secondary/20",
  STABLE: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  COOLING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  DORMANT: "bg-rose-500/10 text-rose-400 border-rose-500/20"
}

export default function SignalBadge({ signal }) {
  return (
    <span className={`px-3 py-1 rounded font-mono text-[10px] border uppercase tracking-tighter ${SIGNALS[signal] || "bg-surface-variant text-outline"}`}>
      {signal}
    </span>
  )
}