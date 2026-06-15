import { useState } from "react"
import axios from "axios"

export default function InvestModal({ artist, user, onClose, onSuccess }) {
  const [direction, setDirection] = useState("LONG")
  const [credits, setCredits] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!credits || parseInt(credits) <= 0) {
      setError("Enter a valid credit amount")
      return
    }
    if (parseInt(credits) > user.credits) {
      setError("Insufficient credits")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_API_URL}/positions/open`,
        {
          artist_id: artist.artist_id,
          direction,
          credits_wagered: parseInt(credits)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      onSuccess(parseInt(credits))
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-card rounded-xl p-8 w-full max-w-md border border-outline-variant/30 z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Open Position</h2>
            <p className="text-on-surface-variant font-mono text-sm mt-1">
              {artist.name.charAt(0).toUpperCase() + artist.name.slice(1)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-outline hover:text-on-surface transition-colors"
          >
            close
          </button>
        </div>

        {/* Credits balance */}
        <div className="bg-surface-container-low rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
          <span className="text-outline font-mono text-sm">Available Credits</span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[16px]">toll</span>
            <span className="text-tertiary font-mono font-bold">{user.credits?.toLocaleString()}</span>
          </div>
        </div>

        {/* Direction toggle */}
        <div className="mb-6">
          <label className="text-outline font-mono text-[11px] uppercase tracking-widest block mb-3">
            Direction
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDirection("LONG")}
              className={`py-3 rounded-lg font-mono font-bold text-sm transition-all border ${
                direction === "LONG"
                  ? "bg-tertiary/20 text-tertiary border-tertiary/40"
                  : "bg-surface-container-low text-outline border-outline-variant/30 hover:border-tertiary/30"
              }`}
            >
              <span className="material-symbols-outlined text-[16px] mr-1 align-middle">trending_up</span>
              LONG
            </button>
            <button
              onClick={() => setDirection("SHORT")}
              className={`py-3 rounded-lg font-mono font-bold text-sm transition-all border ${
                direction === "SHORT"
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                  : "bg-surface-container-low text-outline border-outline-variant/30 hover:border-rose-500/30"
              }`}
            >
              <span className="material-symbols-outlined text-[16px] mr-1 align-middle">trending_down</span>
              SHORT
            </button>
          </div>
          <p className="text-on-surface-variant font-mono text-xs mt-2">
            {direction === "LONG"
              ? "You profit if this artist's listeners grow"
              : "You profit if this artist's listeners decline"}
          </p>
        </div>

        {/* Credits input */}
        <div className="mb-6">
          <label className="text-outline font-mono text-[11px] uppercase tracking-widest block mb-3">
            Credits to Wager
          </label>
          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            placeholder="0"
            min="1"
            max={user.credits}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-mono text-lg focus:outline-none focus:ring-1 focus:ring-secondary/50 placeholder:text-outline/50"
          />
          {/* Quick select buttons */}
          <div className="flex gap-2 mt-2">
            {[100, 250, 500].map(amount => (
              <button
                key={amount}
                onClick={() => setCredits(String(Math.min(amount, user.credits)))}
                className="flex-1 py-1.5 bg-surface-container-low border border-outline-variant/30 rounded font-mono text-xs text-outline hover:text-secondary hover:border-secondary/30 transition-all"
              >
                {amount}
              </button>
            ))}
            <button
              onClick={() => setCredits(String(user.credits))}
              className="flex-1 py-1.5 bg-surface-container-low border border-outline-variant/30 rounded font-mono text-xs text-outline hover:text-secondary hover:border-secondary/30 transition-all"
            >
              MAX
            </button>
          </div>
        </div>

        {error && (
          <p className="text-error font-mono text-sm mb-4">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-mono font-bold text-sm transition-all disabled:opacity-50 ${
            direction === "LONG"
              ? "bg-tertiary/20 text-tertiary hover:bg-tertiary/30 border border-tertiary/40"
              : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/40"
          }`}
        >
          {loading ? "Opening position..." : `Go ${direction} on ${artist.name.charAt(0).toUpperCase() + artist.name.slice(1)}`}
        </button>
      </div>
    </div>
  )
}