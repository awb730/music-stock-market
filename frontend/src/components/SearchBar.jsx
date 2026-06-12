import { useState } from "react"
import axios from "axios"

export default function SearchBar({ onResult }) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`http://localhost:8000/search?name=${encodeURIComponent(query)}`)
      onResult(res.data)
    } catch (e) {
        console.error(e)
      setError("Artist not found. Try a different name.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div className="mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search any artist..."
          className="bg-gray-900 border border-gray-700 text-white rounded px-4 py-2 w-80 focus:outline-none focus:border-green-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  )
}