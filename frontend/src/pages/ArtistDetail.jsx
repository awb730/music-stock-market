import { useEffect, useState } from "react"
import axios from "axios"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import SignalBadge from "../components/SignalBadge"
import InvestModal from "../components/InvestModal"

function formatNumber(n) {
  return n?.toLocaleString() ?? "—"
}

function StatCard({ label, value, sub, valueColor = "text-on-surface" }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <p className="text-outline uppercase font-mono text-[11px] tracking-widest mb-2">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      {sub && <p className="text-on-surface-variant text-xs mt-1 font-mono">{sub}</p>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 rounded-lg border border-outline-variant/30">
        <p className="text-outline font-mono text-[11px] mb-1">{label}</p>
        <p className="text-secondary font-mono text-sm font-bold">{formatNumber(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function ArtistDetail({ artist, onBack, user, setUser }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/artist/${artist.artist_id}/history`)
      .then(res => setHistory(res.data))
      .finally(() => setLoading(false))
  }, [artist])

  const growth7dColor = artist.listener_growth_7d >= 0 ? "text-tertiary" : "text-rose-400"
  const growth30dColor = artist.listener_growth_30d >= 0 ? "text-tertiary" : "text-rose-400"
  const accelColor = artist.acceleration >= 0 ? "text-tertiary" : "text-rose-400"

  const handleInvestSuccess = (creditsWagered) => {
    setShowModal(false)
    // Update user credits locally
    const newCredits = (user.credits || 0) - creditsWagered
    localStorage.setItem("credits", newCredits)
    setUser(prev => ({ ...prev, credits: newCredits }))
  }

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors mb-8 font-mono text-sm"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Leaderboard
      </button>

      {/* Artist Header */}
      <div className="glass-card rounded-xl p-8 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-xl bg-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-outline text-[32px]">person</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-on-surface mb-2">
              {artist.name.charAt(0).toUpperCase() + artist.name.slice(1)}
            </h1>
            <SignalBadge signal={artist.signal} />
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <p className="text-outline font-mono text-[11px] uppercase tracking-widest mb-1">Total Listeners</p>
            <p className="text-3xl font-bold text-on-surface">{formatNumber(artist.listeners_now)}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-secondary-container text-on-secondary-container font-mono font-bold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_chart</span>
            Invest
          </button>
        </div>
      </div>

      {/* Invest Modal */}
      {showModal && (
        <InvestModal
          artist={artist}
          user={user}
          onClose={() => setShowModal(false)}
          onSuccess={handleInvestSuccess}
        />
      )}
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="7D Growth"
          value={`${artist.listener_growth_7d >= 0 ? "+" : ""}${artist.listener_growth_7d}%`}
          sub="Last 7 days"
          valueColor={growth7dColor}
        />
        <StatCard
          label="30D Growth"
          value={`${artist.listener_growth_30d >= 0 ? "+" : ""}${artist.listener_growth_30d}%`}
          sub="Last 30 days"
          valueColor={growth30dColor}
        />
        <StatCard
          label="Acceleration"
          value={artist.acceleration}
          sub="Momentum shift"
          valueColor={accelColor}
        />
        <StatCard
          label="Z-Score"
          value={artist.z_score}
          sub="Signal strength"
          valueColor="text-secondary"
        />
      </div>

      {/* Chart */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Listener History</h3>
            <p className="text-on-surface-variant text-sm font-mono mt-1">30 day momentum curve</p>
          </div>
          <span className="material-symbols-outlined text-outline">show_chart</span>
        </div>

        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-outline font-mono text-sm animate-pulse">Loading chart...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <XAxis
                dataKey="date"
                tick={{ fill: "#958ea0", fontSize: 11, fontFamily: "JetBrains Mono" }}
                axisLine={{ stroke: "#494454" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#958ea0", fontSize: 11, fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatNumber}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="listeners"
                stroke="#4cd7f6"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}