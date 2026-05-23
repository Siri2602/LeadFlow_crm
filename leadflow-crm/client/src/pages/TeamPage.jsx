import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { leadService } from '../services/leadService';
import { SkeletonPage } from '../components/ui/Skeletons';
import { formatCurrency } from '../utils/helpers';
import { RiMedalLine, RiUserLine, RiCheckLine } from 'react-icons/ri';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeamPage() {
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadService.getPerformance()
      .then(r => { setPerformance(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonPage />;

  const topPerformer = performance[0];
  const COLORS = ['#d29922', '#8b949e', '#a06a2c'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#e6edf3]">Team Performance</h1>
        <p className="text-[#8b949e] text-sm">BDA employee metrics & deal scoreboard</p>
      </div>

      {performance.length === 0 ? (
        <div className="card p-12 text-center text-[#484f58]">
          <RiUserLine size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No performance data yet. Add leads and assign them to team members.</p>
        </div>
      ) : (
        <>
          {/* Top performer */}
          {topPerformer && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
              className="card p-6 border-l-4 border-[#d29922]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#21262d] flex items-center justify-center">
                  <RiMedalLine size={24} className="text-[#d29922]" />
                </div>
                <div>
                  <div className="text-xs text-[#d29922] font-semibold uppercase tracking-wider mb-1">Top Performer</div>
                  <div className="text-lg font-bold text-[#e6edf3]">{topPerformer._id}</div>
                  <div className="text-sm text-[#8b949e]">
                    {topPerformer.closedWon} deals closed · {topPerformer.conversionRate.toFixed(1)}% conversion · {formatCurrency(topPerformer.totalValue)} won
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Performance table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-[#21262d]">
              <h3 className="text-sm font-semibold text-[#e6edf3]">Employee Scoreboard</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#21262d]">
                    {['Rank', 'BDA Name', 'Total Leads', 'Closed Won', 'Closed Lost', 'Conversion', 'Revenue Won', 'Pipeline'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs text-[#8b949e] font-medium uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {performance.map((emp, i) => (
                    <motion.tr key={emp._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.05 }}
                      className="border-b border-[#21262d] hover:bg-[#21262d] transition-colors">
                      <td className="px-5 py-3">
                        <span className={`text-xs font-bold ${i === 0 ? 'text-[#d29922]' : i === 1 ? 'text-[#8b949e]' : i === 2 ? 'text-[#a06a2c]' : 'text-[#484f58]'}`}>
                          #{i + 1}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(emp._id)}&backgroundColor=1c2d4a&textColor=58a6ff`}
                            alt={emp._id}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium text-[#e6edf3]">{emp._id}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-[#e6edf3]">{emp.totalLeads}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 text-[#3fb950] font-mono">
                          <RiCheckLine size={12} /> {emp.closedWon}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-[#f85149]">{emp.closedLost}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#21262d] rounded-full h-1.5 w-16">
                            <div className="bg-[#3fb950] h-1.5 rounded-full" style={{ width: `${Math.min(emp.conversionRate, 100)}%` }} />
                          </div>
                          <span className="text-xs font-mono text-[#8b949e]">{emp.conversionRate.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-[#3fb950]">{formatCurrency(emp.totalValue)}</td>
                      <td className="px-5 py-3 font-mono text-[#58a6ff]">{formatCurrency(emp.pipelineValue)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Bar chart of closed won */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
            <h3 className="text-sm font-semibold text-[#e6edf3] mb-4">Deals Closed Won by BDA</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performance.map(e => ({ name: e._id, won: e.closedWon, lost: e.closedLost }))}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b949e', fontSize: 11 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }} />
                <Bar dataKey="won" name="Closed Won" fill="#3fb950" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lost" name="Closed Lost" fill="#f85149" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}
    </div>
  );
}
