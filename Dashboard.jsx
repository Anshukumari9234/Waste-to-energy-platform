import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const API_URL = 'http://localhost:3001'
const socket = io(API_URL)
const COLORS = ['#059669', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6']

// Utility to safely format date
const formatDate = (t) => {
  const d = new Date(t)
  return isNaN(d) ? '-' : d.toLocaleDateString()
}

const ChartCard = ({ title, children, subtitle }) => (
  <div className="border rounded-2xl p-6 bg-white shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    {subtitle && <div className="text-sm text-gray-500 mb-2">{subtitle}</div>}
    <div className="h-72">{children}</div>
  </div>
)

const SummaryCard = ({ title, value, unit, color }) => (
  <div className={`rounded-2xl p-6 shadow-lg border border-${color}-200 bg-white`}>
    <h4 className="text-sm font-medium text-gray-500">{title}</h4>
    <div className={`mt-2 text-3xl font-bold text-${color}-600`}>
      {new Intl.NumberFormat().format(Math.round(value))}
      <span className="text-lg font-semibold text-gray-400 ml-1">{unit}</span>
    </div>
  </div>
)

export default function Dashboard() {
  const [series, setSeries] = useState([])
  const [byType, setByType] = useState([])

  const totalWaste = series.reduce((sum, item) => sum + item.tons, 0)
  const totalEnergy = series.reduce((sum, item) => sum + item.kwh, 0)

  const reportDateRange = series.length > 0 
    ? `${formatDate(series[0].t)} - ${formatDate(series[series.length - 1].t)}`
    : ''

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/series`)
        if (res.ok) {
          const data = await res.json()
          setSeries(data.series)
          setByType(data.byType)
        } else {
          console.error('Failed to fetch initial data:', res.statusText)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    loadData()

    socket.on('series', payload => {
      setSeries(payload.series)
      setByType(payload.byType)
    })

    return () => socket.off('series')
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Sustainability Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">
          Real-time insights into waste management and energy generation.
        </p>
      </div>

      <section className="max-w-7xl mx-auto grid gap-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <SummaryCard title="Total Waste Processed" value={totalWaste} unit="tons" color="emerald" />
          <SummaryCard title="Total Energy Generated" value={totalEnergy} unit="kWh" color="sky" />
          <SummaryCard title="Total Waste Types" value={byType.length} unit="types" color="amber" />
        </div>

        {/* Line and Bar Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ChartCard title="Waste Processed Over Time (tons)" subtitle={`Report: ${reportDateRange}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="t" tickFormatter={formatDate} label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Tons', angle: -90, position: 'insideLeft' }} />
                <Tooltip labelFormatter={formatDate} />
                <Line type="monotone" dataKey="tons" stroke="#059669" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Energy Generated Over Time (kWh)" subtitle={`Report: ${reportDateRange}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="t" tickFormatter={formatDate} label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                <Tooltip labelFormatter={formatDate} />
                <Bar dataKey="kwh" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Pie Chart */}
        <div className="grid grid-cols-1">
          <ChartCard title="Waste Composition by Type">
            <div className="flex flex-col md:flex-row items-center justify-center h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byType}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {byType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 md:mt-0 md:ml-8">
                {byType.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-gray-700">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      </section>
    </div>
  )
}
