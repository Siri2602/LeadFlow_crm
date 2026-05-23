import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { leadService } from '../services/leadService';
import StatCard from '../components/dashboard/StatCard';
import ConversionRing from '../components/dashboard/ConversionRing';
import { SkeletonPage } from '../components/ui/Skeletons';
import { StatusBadge } from '../components/ui/Badges';
import { formatDate, formatCurrency, timeAgo, ACTIVITY_ICONS } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  RiUserSearchLine, RiCheckLine, RiCloseLine, RiRefreshLine,
  RiAlertLine, RiCalendarLine, RiArrowRightLine,
} from 'react-icons/ri';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CHART_COLORS = ['#58a6ff','#3fb950','#d29922','#f97316','#8b5cf6','#f85149'];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [followUps, setFollowUps] = useState({ overdue: [], upcoming: [] });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, leadsRes, fuRes, actRes] = await Promise.all([
        leadService.getStats(),
        leadService.getLeads({ limit: 5, sort: '-createdAt' }),
        leadService.getFollowUps(),
        leadService.getActivities(),
      ]);
      setStats(statsRes.data);
      setRecentLeads(leadsRes.data.leads || []);
      setFollowUps(fuRes.data);
      setActivities(actRes.data.slice(0, 6));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <SkeletonPage />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const monthlyData = (stats?.monthly || []).map(m => ({
    name: MONTH_NAMES[m._id.month - 1],
    leads: m.count,
  }));
  const sourceData = (stats?.bySource || []).map(s => ({ name: s._id || 'Other', value: s.count }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#e6edf3]">
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-[#8b949e] text-sm mt-0.5">BDA Team Dashboard · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={fetchData} className="btn-secondary px-3 py-2 rounded-lg text-sm flex items-center gap-2">
          <RiRefreshLine size={15} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats?.total || 0} icon={RiUserSearchLine} color="blue" delay={0} subtitle="All time" />
        <StatCard title="Closed Won" value={stats?.closedWon || 0} icon={RiCheckLine} color="green" delay={0.08} subtitle={`${stats?.conversionRate || 0}% rate`} />
        <StatCard title="Closed Lost" value={stats?.closedLost || 0} icon={RiCloseLine} color="red" delay={0.16} subtitle="Review required" />
        <StatCard title="Overdue Follow-ups" value={stats?.followUps?.overdue || 0} icon={RiAlertLine} color="amber" delay={0.24} subtitle="Need attention" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#e6edf3]">Lead Volume</h3>
            <span className="text-xs text-[#8b949e]">Last 6 months</span>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#58a6ff" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#58a6ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b949e', fontSize: 11 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }} />
                <Area type="monotone" dataKey="leads" stroke="#58a6ff" strokeWidth={2} fill="url(#areaFill)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-[#484f58] text-sm">Add leads to see monthly trends</div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
          className="card p-5 flex flex-col items-center justify-center gap-4">
          <ConversionRing rate={parseFloat(stats?.conversionRate || 0)} />
          <div className="text-center w-full space-y-1">
            <div className="text-xs text-[#8b949e]">Won Revenue</div>
            <div className="text-lg font-bold font-mono text-[#3fb950]">{formatCurrency(stats?.wonValue || 0)}</div>
            <div className="text-xs text-[#8b949e]">Pipeline Value</div>
            <div className="text-sm font-mono text-[#58a6ff]">{formatCurrency(stats?.pipelineValue || 0)}</div>
          </div>
        </motion.div>
      </div>

      {/* Follow-ups + Activity + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Follow-up Reminders */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} className="card p-5">
          <h3 className="text-sm font-semibold text-[#e6edf3] mb-3 flex items-center gap-2">
            <RiCalendarLine size={15} className="text-[#58a6ff]" /> Follow-up Reminders
          </h3>
          {followUps.overdue.length === 0 && followUps.upcoming.length === 0 ? (
            <div className="text-xs text-[#484f58] text-center py-6">No upcoming follow-ups</div>
          ) : (
            <div className="space-y-2">
              {followUps.overdue.slice(0, 3).map(lead => (
                <div key={lead._id} onClick={() => navigate('/leads')} className="flex items-center gap-2 p-2 rounded-lg bg-[#f8514915] border border-[#f8514930] cursor-pointer hover:border-[#f85149] transition-colors">
                  <RiAlertLine size={13} className="text-[#f85149] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[#e6edf3] truncate">{lead.name}</div>
                    <div className="text-xs text-[#f85149]">Overdue · {formatDate(lead.followUpDate)}</div>
                  </div>
                </div>
              ))}
              {followUps.upcoming.slice(0, 3).map(lead => (
                <div key={lead._id} onClick={() => navigate('/leads')} className="flex items-center gap-2 p-2 rounded-lg bg-[#58a6ff10] border border-[#58a6ff25] cursor-pointer hover:border-[#58a6ff] transition-colors">
                  <RiCalendarLine size={13} className="text-[#58a6ff] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[#e6edf3] truncate">{lead.name}</div>
                    <div className="text-xs text-[#8b949e]">{formatDate(lead.followUpDate)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity Timeline */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5">
          <h3 className="text-sm font-semibold text-[#e6edf3] mb-3">Activity Timeline</h3>
          {activities.length === 0 ? (
            <div className="text-xs text-[#484f58] text-center py-6">No recent activity</div>
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act._id} className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#21262d] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {ACTIVITY_ICONS[act.action] || '·'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#e6edf3] font-medium truncate">{act.leadName}</div>
                    <div className="text-xs text-[#8b949e] truncate">{act.description}</div>
                    <div className="text-xs text-[#484f58]">{timeAgo(act.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Leads */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.56 }} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#e6edf3]">Recent Leads</h3>
            <button onClick={() => navigate('/leads')} className="text-xs text-[#58a6ff] hover:underline flex items-center gap-1 cursor-pointer">
              View all <RiArrowRightLine size={11} />
            </button>
          </div>
          <div className="space-y-2">
            {recentLeads.length === 0 ? (
              <div className="text-xs text-[#484f58] text-center py-6">
                <button onClick={() => navigate('/leads')} className="text-[#58a6ff] hover:underline">Add your first lead →</button>
              </div>
            ) : recentLeads.map(lead => (
              <div key={lead._id} onClick={() => navigate('/leads')} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#21262d] cursor-pointer transition-colors">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(lead.name)}&backgroundColor=1c2d4a&textColor=58a6ff`}
                  alt={lead.name}
                  className="w-7 h-7 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[#e6edf3] truncate">{lead.name}</div>
                  <div className="text-xs text-[#8b949e] truncate">{lead.company || lead.email}</div>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lead Sources */}
      {sourceData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }} className="card p-5">
          <h3 className="text-sm font-semibold text-[#e6edf3] mb-4">Lead Sources Breakdown</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={sourceData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fill: '#8b949e', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {sourceData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
