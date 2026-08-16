import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Map, Brain, BarChart3, Info, Thermometer, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/predict', icon: Brain, label: 'LCZ Prediction' },
  { to: '/map', icon: Map, label: 'Interactive Map' },
  { to: '/heat-analysis', icon: Thermometer, label: 'Heat Analysis' },
  { to: '/lcz-info', icon: Info, label: 'LCZ Classes' },
  { to: '/model-info', icon: BarChart3, label: 'Model Info' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden btn-secondary p-2"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-[#0d1526] border-r border-[#1e2d45] z-40
        flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-[#1e2d45]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Thermometer size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-400 leading-tight">URBAN</p>
              <p className="text-xs text-slate-400 leading-tight">Heat Mapping</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150
                ${isActive
                  ? 'bg-blue-600/20 text-blue-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e2d45]'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e2d45]">
          <p className="text-xs text-slate-600">So2Sat-LCZ42 Dataset</p>
          <p className="text-xs text-slate-600">Sentinel-1 + Sentinel-2</p>
        </div>
      </aside>
    </>
  )
}
