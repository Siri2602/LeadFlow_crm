import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { leadService } from '../services/leadService';
import ConversionRing from '../components/dashboard/ConversionRing';
import { SkeletonPage } from '../components/ui/Skeletons';
import { formatCurrency, BDA_STAGES } from '../utils/helpers';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#58a6ff','#3fb950','#d29922','#f97316','#8b5cf6','#f85149','#06b6d4'];

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadService.getStats().then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonPage />;

  const monthlyData = (stats?.monthly || []).map(m => ({ name: MONTH_NAMES[m._id.month - 1], leads: m.count }));
  const statusData = BDA_STAGES.map((s, i) => ({ name: s, value: stats?.byStatus?.find(b => b._id === s)?.count || 0 })).filter(d => d.value > 0);
  const sourceData = (stats?.bySource || []).map(s => ({ name: s._id || 'Other', value: s.count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#e6edf3]">Analytics</h1>
        <p className="text-[#8b949e] text-sm">Pipeline intelligence & performance insights</p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: stats?.total || 0, color: 'text-[#58a6ff]' },
          { label: 'Won Revenue', value: formatCurrency(stats?.wonValue || 0), color: 'text-[#3fb950]' },
          { label: 'Pipeline Value', value: formatCurrency(stats?.pipelineValue || 0), color: 'text-[#d29922]' },
          { label: 'Conversion Rate', value: `${stats?.conversionRate || 0}%`, color: 'text-[#8b5cf6]' },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-5">
            <div className="text-xs text-[#8b949e] uppercase tracking-wider mb-2">{m.label}</div>
            <div className={`text-2xl font-bold font-mono ${m.color}`}>{m.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Area + Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-[#e6edf3] mb-4">Lead Volume — Last 6 Months</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#58a6ff" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#58a6ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b949e', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b949e', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }} />
                <Area type="monotone" dataKey="leads" stroke="#58a6ff" strokeWidth={2} fill="url(#ag1)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#484f58] text-sm">No monthly data yet</div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.43 }}
          className="card p-5 flex flex-col items-center justify-center gap-4">
          <ConversionRing rate={parseFloat(stats?.conversionRate || 0)} size={140} />
          <div className="w-full space-y-1.5">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs px-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-[#8b949e] truncate">{s.name}</span>
                </div>
                <span className="font-mono text-[#e6edf3]">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2: Status + Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5">
          <h3 className="text-sm font-semibold text-[#e6edf3] mb-4">Leads by Stage</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b949e', fontSize: 10 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#484f58] text-sm">No stage data</div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }} className="card p-5">
          <h3 className="text-sm font-semibold text-[#e6edf3] mb-4">Lead Sources</h3>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8b949e' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#484f58] text-sm">No source data</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
