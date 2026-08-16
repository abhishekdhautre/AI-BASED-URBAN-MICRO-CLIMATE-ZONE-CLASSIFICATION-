import { useState } from 'react'
import { LCZ_CLASSES } from '../data/lczData'
import { Search } from 'lucide-react'

const HEAT_COLOR = {
  'Extreme': 'text-red-400', 'Very High': 'text-orange-400', 'High': 'text-orange-300',
  'Moderate': 'text-yellow-500', 'Low': 'text-emerald-400', 'Very Low': 'text-zinc-400'
}

const heatLabel = (id) => {
  if ([1, 7, 15].includes(id)) return 'Extreme'
  if ([2, 10].includes(id)) return 'Very High'
  if ([3, 8].includes(id)) return 'High'
  if ([4, 5, 16].includes(id)) return 'Moderate'
  if ([6, 9, 13, 14].includes(id)) return 'Low'
  return 'Very Low'
}

export default function LCZInfo() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = LCZ_CLASSES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">LCZ Classes</h1>
        <p className="text-zinc-500 text-sm">All 17 Local Climate Zone classes — Stewart & Oke (2012)</p>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        <input
          type="text"
          placeholder="Search classes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#141414] border border-[#242424] rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500"
        />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((lcz) => {
          const heat = heatLabel(lcz.id)
          const isSelected = selected === lcz.id
          return (
            <div
              key={lcz.id}
              className={`card cursor-pointer transition-all duration-200 hover:border-zinc-600
                ${isSelected ? 'border-zinc-500 bg-zinc-800/20' : ''}`}
              onClick={() => setSelected(isSelected ? null : lcz.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: lcz.color + '22', border: `1px solid ${lcz.color}55` }}>
                    <span style={{ color: lcz.color }}>{lcz.id}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-zinc-100">{lcz.code}</p>
                    <p className="text-xs text-zinc-500">{lcz.name}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${HEAT_COLOR[heat] || 'text-zinc-500'}`}>{heat}</span>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed mb-3">{lcz.description}</p>

              {isSelected && (
                <div className="border-t border-[#242424] pt-3 space-y-2.5 text-xs">
                  {[
                    { label: 'Urban Context', value: lcz.urban },
                    { label: 'Building/Vegetation', value: lcz.building },
                    { label: 'Heat Characteristics', value: lcz.heat },
                    { label: 'Sky View Factor', value: lcz.svf },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-zinc-600 font-medium mb-0.5">{label}</p>
                      <p className="text-zinc-300">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-zinc-700 mt-2">{isSelected ? '▲ Click to collapse' : '▼ Click for details'}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
