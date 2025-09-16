import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

// The URL for the API endpoint
const API_URL = 'http://localhost:3001'

// Initialize the socket connection outside the component
const socket = io(API_URL)

// A reusable component to display a single statistic
function Stat({ label, value, unit, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border p-6 text-center bg-white shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-4xl font-bold text-emerald-600 mt-2">
        {new Intl.NumberFormat().format(Math.round(value))}{' '}
        <span className="text-lg font-semibold text-gray-500">{unit}</span>
      </div>
      {description && <p className="text-gray-400 text-xs mt-2">{description}</p>}
    </div>
  )
}

export default function Home() {
  // State to hold the live statistics
  const [stats, setStats] = useState({ wasteTons: 0, energyKWh: 0, co2SavedTons: 0 })

  useEffect(() => {
    // Listen for real-time stat updates from the socket
    socket.on('stats', setStats)

    // Fetch initial stats data from the API
    fetch(`${API_URL}/api/stats`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(setStats)
      .catch(error => {
        console.error('Failed to fetch initial stats:', error)
      })

    // Cleanup function to turn off the socket listener
    return () => {
      socket.off('stats', setStats)
    }
  }, []) // The empty dependency array ensures this effect runs only once on mount

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-emerald-700 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">Pioneering a Sustainable Future</h1>
        <p className="mt-4 text-xl max-w-2xl mx-auto opacity-90">
          Transforming waste into clean, renewable energy. Our live platform tracks our progress in real-time,
          showcasing our commitment to a greener planet.
        </p>
        <button className="mt-8 px-8 py-3 bg-white text-emerald-700 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105">
          Learn More
        </button>
      </section>

      {/* Live Counters Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 -mt-10 relative z-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Live Impact Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Stat
            label="Waste Processed"
            value={stats.wasteTons}
            unit="tons"
            description="Total waste diverted from landfills and converted."
          />
          <Stat
            label="Energy Generated"
            value={stats.energyKWh}
            unit="kWh"
            description="Clean energy produced to power communities."
          />
          <Stat
            label="CO₂ Saved"
            value={stats.co2SavedTons}
            unit="tons"
            description="Equivalent greenhouse gas emissions prevented."
          />
        </div>
      </section>

      {/* About Us Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At the heart of our operations is a commitment to sustainability and innovation. We leverage
              advanced technology to transform what was once considered waste into a valuable resource: clean energy.
              This process not only reduces landfill waste but also decreases reliance on fossil fuels.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our live counters are more than just numbers; they represent a tangible impact on the environment,
              showcasing our dedication to a circular economy and a healthier planet for future generations.
            </p>
          </div>
          <div className="relative h-64 lg:h-96 rounded-xl overflow-hidden shadow-xl">
            

[Image of a waste-to-energy facility]

          </div>
        </div>
      </section>
    </div>
  )
}