import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { HEAT_ANALYSIS_DATA, HEAT_RISK_DATA } from '../data/lczData'
import { Info } from 'lucide-react'

const CHART_STYLE = {
  tooltip: { contentStyle: { backgroundColor: '#141414', border: '1px solid #242424', borderRadius: '8px', fontSize: '12px', color: '#e4e4e7' } },
  axis: { tick: { fill: '#52525b', fontSize: 11 }, axisLine: { stroke: '#242424' }, tickLine: false },
}

const SectionNote = () => (
  <div className="flex items-center gap-1.5 text-xs text-zinc-700 mt-2">
    <Info size={11} /> Sample/mock data — connect real Pune LST data for production analysis
  </div>
)

export default function HeatAnalysis() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Heat Analysis</h1>
        <p className="text-zinc-500 text-sm">LCZ class relationships with Land Surface Temperature — Pune</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Hottest Zone', value: 'LCZ E (Paved)', sub: '~43.2°C avg LST', color: 'text-red-400' },
          { label: 'Coolest Zone', value: 'LCZ G (Water)', sub: '~24.1°C avg LST', color: 'text-emerald-400' },
          { label: 'Heat Difference', value: '~19°C', sub: 'Paved vs Water', color: 'text-amber-400' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="card">
            <p className="text-xs text-zinc-600 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="card mb-6">
        <p className="section-title">LCZ Class vs Average Land Surface Temperature (°C)</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={HEAT_ANALYSIS_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
            <XAxis dataKey="lcz" {...CHART_STYLE.axis} />
            <YAxis domain={[20, 46]} {...CHART_STYLE.axis} />
            <Tooltip {...CHART_STYLE.tooltip} formatter={(v) => [`${v}°C`, 'Avg LST']} />
            <Bar dataKey="lst" radius={[3, 3, 0, 0]}>
              {HEAT_ANALYSIS_DATA.map((entry) => (
                <Cell key={entry.lcz} fill={entry.lst > 40 ? '#ef4444' : entry.lst > 35 ? '#f97316' : entry.lst > 30 ? '#d97706' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <SectionNote />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <p className="section-title">Vegetation Cover vs LST</p>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
              <XAxis dataKey="vegetation" name="Vegetation %" {...CHART_STYLE.axis} label={{ value: 'Vegetation %', position: 'insideBottom', offset: -2, fill: '#52525b', fontSize: 11 }} />
              <YAxis dataKey="lst" name="LST °C" {...CHART_STYLE.axis} />
              <Tooltip {...CHART_STYLE.tooltip} formatter={(v, n) => [n === 'lst' ? `${v}°C` : `${v}%`, n === 'lst' ? 'LST' : 'Vegetation']} />
              <Scatter data={HEAT_ANALYSIS_DATA} fill="#10b981" opacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
          <SectionNote />
        </div>

        <div className="card">
          <p className="section-title">Built-up Intensity vs LST</p>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
              <XAxis dataKey="builtup" name="Built-up %" {...CHART_STYLE.axis} label={{ value: 'Built-up %', position: 'insideBottom', offset: -2, fill: '#52525b', fontSize: 11 }} />
              <YAxis dataKey="lst" name="LST °C" {...CHART_STYLE.axis} />
              <Tooltip {...CHART_STYLE.tooltip} formatter={(v, n) => [n === 'lst' ? `${v}°C` : `${v}%`, n === 'lst' ? 'LST' : 'Built-up']} />
              <Scatter data={HEAT_ANALYSIS_DATA} fill="#f97316" opacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
          <SectionNote />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <p className="section-title">Heat Risk Distribution</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={HEAT_RISK_DATA} dataKey="count" nameKey="risk" cx="50%" cy="50%" outerRadius={90}
                label={({ risk, count }) => `${risk}: ${count}`} labelLine={false} fontSize={11}>
                {HEAT_RISK_DATA.map(({ risk, color }) => (
                  <Cell key={risk} fill={color} />
                ))}
              </Pie>
              <Tooltip {...CHART_STYLE.tooltip} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#71717a' }} />
            </PieChart>
          </ResponsiveContainer>
          <SectionNote />
        </div>

        <div className="card">
          <p className="section-title">Key Insights</p>
          <div className="space-y-3">
            {[
              { color: '#ef4444', title: 'Impervious surfaces drive extreme heat', desc: 'LCZ E (bare paved) and LCZ 1 (compact high-rise) show the highest LST values, exceeding 42°C.' },
              { color: '#10b981', title: 'Vegetation provides strong cooling', desc: 'LCZ A (dense trees) and LCZ G (water) are 15–19°C cooler than paved zones — critical for urban cooling.' },
              { color: '#f97316', title: 'Informal settlements are heat-vulnerable', desc: 'LCZ 7 (lightweight low-rise) shows very high LST despite low building height, due to poor materials.' },
              { color: '#d97706', title: 'Open layouts reduce heat retention', desc: 'Open LCZ types (4, 5, 6) are consistently cooler than compact equivalents at the same height.' },
            ].map(({ color, title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="w-1 rounded-full shrink-0 mt-1" style={{ backgroundColor: color, minHeight: '40px' }} />
                <div>
                  <p className="text-sm font-medium mb-0.5 text-zinc-200">{title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
