import { useState } from "react"
import Leaderboard from "./pages/Leaderboard"
import ArtistDetail from "./pages/ArtistDetail"

export default function App() {
  const [selectedArtist, setSelectedArtist] = useState(null)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">🎵 Underground Music Exchange</h1>
        <p className="text-gray-400 text-sm mt-1">Artist momentum — powered by data</p>
      </header>

      {selectedArtist ? (
        <ArtistDetail artist={selectedArtist} onBack={() => setSelectedArtist(null)} />
      ) : (
        <Leaderboard onSelect={setSelectedArtist} />
      )}
    </div>
  )
}