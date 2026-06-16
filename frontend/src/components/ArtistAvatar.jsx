const SIGNAL_COLORS = {
  BREAKOUT: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
  RISING: { bg: "bg-secondary/20", text: "text-secondary", border: "border-secondary/30" },
  STABLE: { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30" },
  COOLING: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
  DORMANT: { bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500/30" },
}

export default function ArtistAvatar({ name, signal, size = "md" }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? "")
    .join("")

  const colors = SIGNAL_COLORS[signal] || SIGNAL_COLORS.STABLE

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
  }

  return (
    <div className={`
      ${sizes[size]} ${colors.bg} ${colors.text} ${colors.border}
      rounded-lg border flex items-center justify-center font-mono font-bold flex-shrink-0
    `}>
      {initials}
    </div>
  )
}