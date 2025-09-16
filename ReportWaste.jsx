import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'

export default function ReportWaste() {
  const [position, setPosition] = useState([20.5937, 78.9629])
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('organic')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)

    try {
      const body = { lat: position[0], lng: position[1], amountTons: Number(amount), type }
      const API = 'http://localhost:3001'
      const res = await fetch(API + '/api/waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        setMsg('✅ Reported successfully! Thank you for your contribution.')
        setAmount('')
      } else {
        setMsg('❌ Failed to report. Please try again.')
      }
    } catch (err) {
      setMsg('⚠️ Network error. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      {/* Intro content */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-3xl font-bold text-emerald-700">Waste Reporting Portal</h2>
        <p className="text-gray-600 text-lg">
          Help us track and manage waste more effectively. By reporting waste in your area, 
          you are directly contributing to cleaner cities and renewable energy generation.
        </p>
        <ul className="text-gray-700 text-sm space-y-1">
          <li>♻️ <span className="font-medium">Reduce pollution</span> by identifying waste hotspots</li>
          <li>⚡ <span className="font-medium">Convert waste to energy</span> through sustainable processes</li>
          <li>🌍 <span className="font-medium">Support a greener future</span> with community-driven data</li>
        </ul>
      </div>

      {/* Form + Map */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Form */}
        <form
          onSubmit={submit}
          className="bg-white rounded-xl shadow-md p-6 space-y-5 border"
        >
          <h3 className="text-xl font-semibold text-emerald-700">Submit a Report</h3>
          <p className="text-gray-600 text-sm">
            Fill in the waste details and select the exact location on the map.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (tons)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0"
              step="0.1"
              required
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. 2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type of Waste
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="organic">Organic</option>
              <option value="msw">MSW / RDF</option>
              <option value="agri">Agri residue</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 transition text-white rounded-lg px-4 py-2 font-medium"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>

          {msg && (
            <div
              className={`mt-3 text-sm font-medium ${
                msg.startsWith('✅')
                  ? 'text-green-600'
                  : msg.startsWith('❌')
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}
            >
              {msg}
            </div>
          )}
        </form>

        {/* Map */}
        <div className="h-80 md:h-full rounded-xl overflow-hidden shadow-md border">
          <MapContainer
            center={position}
            zoom={5}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>
      </div>
    </section>
  )
}

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    }
  })
  return <Marker position={position} />
}
