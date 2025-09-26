import { Link, Outlet, useLocation } from 'react-router-dom'

export default function App() {
  const { pathname } = useLocation()
  
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <header className="relative">
        <div className="h-1.5 bg-gradient-to-r from-red-700 via-red-600 to-red-500" />
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
          <Link to="/track" className="flex items-center gap-3">
            <span className="inline-block h-5 w-8 bg-red-600 skew-x-[-15deg]" aria-hidden />
            <span className="f1-wordmark text-xl font-extrabold">F1 League</span>
          </Link>
          <nav className="flex gap-2 text-xs uppercase">
            <Link to="/track" className={`px-3 py-1.5 rounded border ${pathname === '/track' || pathname === '/' ? 'border-red-500 text-red-400' : 'border-white/10 text-white/70 hover:border-red-600/50 hover:text-red-300'}`}>Track Selection</Link>
            <Link to="/weather" className={`px-3 py-1.5 rounded border ${pathname.startsWith('/weather') ? 'border-red-500 text-red-400' : 'border-white/10 text-white/70 hover:border-red-600/50 hover:text-red-300'}`}>Weather</Link>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
