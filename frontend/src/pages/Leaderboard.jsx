import { useEffect, useState } from "react"
import axios from "axios"
import SignalBadge from "../components/SignalBadge"
import ArtistAvatar from "../components/ArtistAvatar"

function StatCard({ icon, label, value, sub, subColor = "text-tertiary" }) {
  return (
    <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <span className="text-outline uppercase font-mono text-[11px] tracking-widest">{label}</span>
      <h3 className="text-2xl font-bold text-on-surface mt-2">{value}</h3>
      <div className={`flex items-center gap-2 mt-4 ${subColor}`}>
        <span className="font-mono text-sm">{sub}</span>
      </div>
    </div>
  )
}

function computeStats(artists) {
  if (!artists.length) return null
  const topGainer = artists.reduce((a, b) =>
    a.listener_growth_7d > b.listener_growth_7d ? a : b
  )
  const breakouts = artists.filter(a => a.signal === "BREAKOUT").length
  const avgZ = (artists.reduce((sum, a) => sum + a.z_score, 0) / artists.length).toFixed(2)
  return { topGainer, breakouts, avgZ, total: artists.length }
}

export default function Leaderboard({ onSelect, artists, setArtists, onSearch, searching, searchError }) {
  const [loading, setLoading] = useState(artists.length === 0)
  const [localSearch, setLocalSearch] = useState("")

  useEffect(() => {
    if (artists.length === 0) {
      axios.get(`${import.meta.env.VITE_API_URL}/leaderboard`)
        .then(res => setArtists(Array.isArray(res.data) ? res.data : []))
        .finally(() => setLoading(false))
    }
  }, []) 

  const stats = computeStats(artists)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-outline font-mono text-sm animate-pulse">Loading market data...</p>
    </div>
  )

  return (
    <div>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon="bar_chart" label="Artists Tracked" value={stats.total} sub="Active signals" />
          <StatCard icon="bolt" label="Top Gainer 7D" value={stats.topGainer.name.charAt(0).toUpperCase() + stats.topGainer.name.slice(1)} sub={`+${stats.topGainer.listener_growth_7d}%`} />
          <StatCard icon="rocket_launch" label="Breakout Signals" value={stats.breakouts} sub="Artists breaking out" subColor="text-green-400" />
          <StatCard icon="monitoring" label="Avg Z-Score" value={stats.avgZ} sub="Market confidence" subColor="text-secondary" />
        </div>
      )}

      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Signal Leaderboard</h2>
          <p className="text-on-surface-variant text-sm mt-1">Real-time artist performance metrics and market sentiment.</p>
        </div>
        <div className="flex gap-2 items-center">
          {searchError && <p className="text-error text-sm font-mono">{searchError}</p>}
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(localSearch)}
            placeholder="Search artist..."
            className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary/50 placeholder:text-outline/50"
          />
          <button
            onClick={() => onSearch(localSearch)}
            disabled={searching}
            className="bg-secondary-container text-on-secondary-container font-mono text-sm px-4 py-2 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
              <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider">Artist</th>
              <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider">Signal</th>
              <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider text-right">7D %</th>
              <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider text-right">30D %</th>
              <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider text-right">Acceleration</th>
              <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider text-right">Z-Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {artists.map((a, i) => (
              <tr
                key={i}
                onClick={() => onSelect(a)}
                className="signal-row transition-all duration-150 cursor-pointer group"
              >
                <td className="px-6 py-4 font-mono text-sm text-outline group-hover:text-secondary">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ArtistAvatar name={a.name} signal={a.signal} size="sm" />
                    <span className="font-bold text-on-surface group-hover:text-secondary transition-colors">
                      {a.name.charAt(0).toUpperCase() + a.name.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4"><SignalBadge signal={a.signal} /></td>
                <td className={`px-6 py-4 text-right font-mono text-sm ${a.listener_growth_7d >= 0 ? "text-tertiary" : "text-rose-400"}`}>
                  {a.listener_growth_7d >= 0 ? "+" : ""}{a.listener_growth_7d}%
                </td>
                <td className={`px-6 py-4 text-right font-mono text-sm ${a.listener_growth_30d >= 0 ? "text-tertiary" : "text-rose-400"}`}>
                  {a.listener_growth_30d >= 0 ? "+" : ""}{a.listener_growth_30d}%
                </td>
                <td className={`px-6 py-4 text-right font-mono text-sm ${a.acceleration >= 0 ? "text-on-surface-variant" : "text-rose-400"}`}>
                  {a.acceleration}
                </td>
                <td className="px-6 py-4 text-right font-mono text-sm text-on-surface">
                  {a.z_score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}