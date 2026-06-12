import { useEffect, useState } from "react"
import axios from "axios"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import SignalBadge from "../components/SignalBadge"

function formatNumber(n) {
  return n?.toLocaleString() ?? "—"
}

export default function ArtistDetail({ artist, onBack }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/artist/${artist.artist_id}/history`)
      .then(res => setHistory(res.data))
      .finally(() => setLoading(false))
  }, [artist])


  return (
    <div>
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-6 text-sm underline">
        ← Back to Leaderboard
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold">{artist.name[0].toUpperCase() + artist.name.slice(1, artist.length)}</h2>
        <div className="mt-2"><SignalBadge signal={artist.signal} /></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Listeners" value={formatNumber(artist.listeners_now)} />
        <StatCard label="7D Growth" value={`${artist.listener_growth_7d}%`} />
        <StatCard label="30D Growth" value={`${artist.listener_growth_30d}%`} />
        <StatCard label="Z-Score" value={artist.z_score} />
      </div>

      <h3 className="text-lg font-semibold mb-4">Listener History</h3>
      {loading ? <p className="text-gray-400">Loading chart...</p> : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={formatNumber} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none" }} formatter={(value) => [formatNumber(value), "Listeners"]} />
            <Line type="monotone" dataKey="listeners" stroke="#22c55e" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}