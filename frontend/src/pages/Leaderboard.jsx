import { useEffect, useState } from "react"
import axios from "axios"
import SignalBadge from "../components/SignalBadge"
import SearchBar from "../components/SearchBar"

export default function Leaderboard({ onSelect }) {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/leaderboard`)
      .then(res => setArtists(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleSearchResult = (artist) => {
    setArtists(prev => {
      const exists = prev.find(a => a.artist_id === artist.artist_id)
      if (exists) return prev
      return [...prev, artist]
    })
    onSelect(artist)
  }

  if (loading) return <p className="text-gray-400">Loading...</p>

  return (
    <div>
      <SearchBar onResult={handleSearchResult} />
      <h2 className="text-xl font-semibold mb-4">Signal Leaderboard</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 text-left border-b border-gray-800">
            <th className="pb-2">Artist</th>
            <th className="pb-2">Signal</th>
            <th className="pb-2">7D %</th>
            <th className="pb-2">30D %</th>
            <th className="pb-2">Acceleration</th>
            <th className="pb-2">Z-Score</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((a, i) => (
            <tr
              key={i}
              onClick={() => onSelect(a)}
              className="border-b border-gray-800 hover:bg-gray-900 cursor-pointer transition"
            >
              <td className="py-3 font-medium">{a.name[0].toUpperCase() + a.name.slice(1, a.length)}</td>
              <td className="py-3"><SignalBadge signal={a.signal} /></td>
              <td className="py-3">{a.listener_growth_7d}%</td>
              <td className="py-3">{a.listener_growth_30d}%</td>
              <td className="py-3">{a.acceleration}</td>
              <td className="py-3">{a.z_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}