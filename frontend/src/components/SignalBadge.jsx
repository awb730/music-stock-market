const COLORS = {
  BREAKOUT: "bg-green-500 text-white",
  RISING: "bg-blue-500 text-white",
  STABLE: "bg-gray-500 text-white",
  COOLING: "bg-yellow-500 text-black",
  DORMANT: "bg-red-500 text-white"
}

export default function SignalBadge({ signal }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${COLORS[signal] || "bg-gray-700"}`}>
      {signal}
    </span>
  )
}