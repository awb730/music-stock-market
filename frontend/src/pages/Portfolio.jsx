import { useEffect, useState } from "react"
import axios from "axios"

function PnlBadge({ pnl }) {
    const isPositive = pnl >= 0
    return (
       <span className={`font-mono font-bold text-sm ${isPositive ? "text-tertiary" : "text-rose-400"}`}>
        {isPositive ? "+" : ""}{pnl} credits
        </span> 
    )
}

export default function Portfolio({ user, setUser }) {
    const [portfolio, setPortfolio] = useState(null)
    const [loading, setLoading] = useState(true)
    const [closing, setClosing] = useState(null)
    const [error, setError] = useState(null)

    const fetchPortfolio = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/portfolio`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPortfolio(res.data)
        } catch {
            setError("Failed to load portfolio")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const load = async () => {
            try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/portfolio`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPortfolio(res.data)
            } catch {
            setError("Failed to load portfolio")
            } finally {
            setLoading(false)
            }
        }
        load()
    }, [])

    const handleClose = async (positionId, creditsWagered, pnl) => {
        setClosing(positionId)
        try {
            const token = localStorage.getItem("token")
            await axios.post(
                `${import.meta.env.VITE_API_URL}/positions/close/${positionId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const creditsReturned = creditsWagered + pnl
            const newCredits = (user.credits || 0) + creditsReturned
            localStorage.setItem("credits", newCredits)
            setUser(prev => ({ ...prev, credits: newCredits }))
            fetchPortfolio()
        } catch (e) {
            setError(e.response?.data?.detail || "Failed to close position")
        } finally {
            setClosing(null)
        }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-outline font-mono text-sm animate-pulse">Loading portfolio...</p>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-error font-mono text-sm">{error}</p>
    </div>
  )

  const openPositions = portfolio?.positions?.filter(p => p.status === "open") || []
  const closedPositions = portfolio?.positions?.filter(p => p.status === "closed") || []
  const totalPnl = openPositions.reduce((sum, p) => sum + p.pnl, 0)

  return (
    <div>
      {/* Portfolio Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-on-surface">Portfolio</h2>
        <p className="text-on-surface-variant text-sm font-mono mt-1">Track your open and closed positions.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card rounded-xl p-6">
          <p className="text-outline font-mono text-[11px] uppercase tracking-widest mb-2">Credits Balance</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">toll</span>
            <p className="text-2xl font-bold text-tertiary">{portfolio?.credits?.toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-outline font-mono text-[11px] uppercase tracking-widest mb-2">Open Positions</p>
          <p className="text-2xl font-bold text-on-surface">{openPositions.length}</p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-outline font-mono text-[11px] uppercase tracking-widest mb-2">Unrealized P&L</p>
          <p className={`text-2xl font-bold ${totalPnl >= 0 ? "text-tertiary" : "text-rose-400"}`}>
            {totalPnl >= 0 ? "+" : ""}{totalPnl} credits
          </p>
        </div>
      </div>

      {/* Open Positions */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-on-surface mb-4">Open Positions</h3>
        {openPositions.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center border border-outline-variant/20">
            <span className="material-symbols-outlined text-outline text-4xl mb-3 block">inbox</span>
            <p className="text-on-surface-variant font-mono text-sm">No open positions yet.</p>
            <p className="text-outline font-mono text-xs mt-1">Go to the leaderboard and invest in an artist.</p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider">Artist</th>
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider">Direction</th>
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider text-right">Wagered</th>
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider text-right">P&L</th>
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider text-right">Growth</th>
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider">Opened</th>
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {openPositions.map(pos => (
                  <tr key={pos.id} className="group hover:bg-white/5 transition-all">
                    <td className="px-6 py-4 font-bold text-on-surface">{pos.artist}</td>
                    <td className="px-6 py-4">
                      <span className={`font-mono text-xs font-bold px-2 py-1 rounded border ${
                        pos.direction === "LONG"
                          ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        {pos.direction === "LONG" ? "↑ LONG" : "↓ SHORT"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-sm text-on-surface-variant">
                      {pos.credits_wagered.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <PnlBadge pnl={pos.pnl} />
                    </td>
                    <td className={`px-6 py-4 text-right font-mono text-sm ${pos.pnl_pct >= 0 ? "text-tertiary" : "text-rose-400"}`}>
                      {pos.pnl_pct >= 0 ? "+" : ""}{pos.pnl_pct}%
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-outline">{pos.opened_at}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleClose(pos.id, pos.credits_wagered, pos.pnl)}
                        disabled={closing === pos.id}
                        className="font-mono text-xs px-3 py-1.5 rounded border border-outline-variant/30 text-outline hover:text-error hover:border-error/30 transition-all disabled:opacity-50"
                      >
                        {closing === pos.id ? "Closing..." : "Close"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Closed Positions */}
      {closedPositions.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-on-surface mb-4">Closed Positions</h3>
          <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider">Artist</th>
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider">Direction</th>
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider text-right">Wagered</th>
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider text-right">Final P&L</th>
                  <th className="px-6 py-4 font-mono text-[11px] text-outline uppercase tracking-wider">Opened</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {closedPositions.map(pos => (
                  <tr key={pos.id} className="group hover:bg-white/5 transition-all opacity-60">
                    <td className="px-6 py-4 font-bold text-on-surface">{pos.artist}</td>
                    <td className="px-6 py-4">
                      <span className={`font-mono text-xs font-bold px-2 py-1 rounded border ${
                        pos.direction === "LONG"
                          ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        {pos.direction === "LONG" ? "↑ LONG" : "↓ SHORT"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-sm text-on-surface-variant">
                      {pos.credits_wagered.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <PnlBadge pnl={pos.pnl} />
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-outline">{pos.opened_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}