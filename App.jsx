import './App.css'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import ReportWaste from './pages/ReportWaste'
import Dashboard from './pages/Dashboard'
import Blog from './pages/Blog'
import Login from './pages/login'
import Register from './pages/register'
import Quiz from './pages/Quiz'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur border-b z-10">
          <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="font-bold text-emerald-700">
              Waste-to-Energy
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'text-emerald-700 font-semibold' : 'text-gray-700'}>
                Home
              </NavLink>
              <NavLink to="/report" className={({ isActive }) => isActive ? 'text-emerald-700 font-semibold' : 'text-gray-700'}>
                Report Waste
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-emerald-700 font-semibold' : 'text-gray-700'}>
                Dashboard
              </NavLink>
              <NavLink to="/blog" className={({ isActive }) => isActive ? 'text-emerald-700 font-semibold' : 'text-gray-700'}>
                Blog
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'text-emerald-700 font-semibold' : 'text-gray-700'}>
                Login
              </NavLink>
              <NavLink to="/Quiz" className={({ isActive }) => isActive ? 'text-emerald-700 font-semibold' : 'text-gray-700'}>
                Quiz
              </NavLink>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportWaste />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Quiz" element={<Quiz />}/>
            
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Waste-to-Energy
        </footer>
      </div>
    </BrowserRouter>
  )
}
