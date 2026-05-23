import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowRightLine, RiKanbanView, RiLineChartLine, RiUserSearchLine, RiTeamLine, RiCalendarLine } from 'react-icons/ri';

const features = [
  { icon: RiUserSearchLine, title: 'Lead Management', desc: 'Track every lead from first contact to closed deal with full history and notes.' },
  { icon: RiKanbanView, title: 'BDA Pipeline Board', desc: '6-stage Kanban board tailored for BDA workflows. Drag and drop to move deals.' },
  { icon: RiLineChartLine, title: 'Analytics Dashboard', desc: 'Visual insights on conversion rates, revenue won, and monthly lead trends.' },
  { icon: RiTeamLine, title: 'Team Performance', desc: 'Track each BDA\'s deals closed, conversion rate, and pipeline value.' },
  { icon: RiCalendarLine, title: 'Follow-up Reminders', desc: 'Never miss a follow-up. See overdue and upcoming tasks at a glance.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {/* Nav */}
      <nav className="border-b border-[#21262d] px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">LF</span>
          </div>
          <span className="font-semibold text-[#e6edf3]">LeadFlow CRM</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login')} className="btn-secondary px-4 py-2 rounded-lg text-sm">Sign In</button>
          <button onClick={() => navigate('/register')} className="btn-primary px-4 py-2 rounded-lg text-sm">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 bg-[#1c2d4a] border border-[#58a6ff33] text-[#58a6ff] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            BDA Team Management System
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Manage Your Sales Pipeline<br />
            <span className="gradient-text">The Smart Way</span>
          </h1>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto mb-8">
            LeadFlow CRM is purpose-built for BDA teams. Track leads, manage your pipeline, monitor team performance, and close more deals.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/register')} className="btn-primary px-6 py-3 rounded-lg text-sm flex items-center gap-2">
              Start Free <RiArrowRightLine size={16} />
            </button>
            <button onClick={() => navigate('/login')} className="btn-secondary px-6 py-3 rounded-lg text-sm">
              Sign In
            </button>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-2">Everything a BDA team needs</h2>
          <p className="text-[#8b949e]">Streamline your business development workflow from lead to revenue</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              className="card p-6 hover:border-[#58a6ff33] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#1c2d4a] flex items-center justify-center mb-4">
                <f.icon size={20} className="text-[#58a6ff]" />
              </div>
              <h3 className="font-semibold text-[#e6edf3] mb-2">{f.title}</h3>
              <p className="text-sm text-[#8b949e] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#21262d] text-center py-6 text-xs text-[#484f58]">
        LeadFlow CRM — BDA Team Management System · Built with MERN Stack
      </div>
    </div>
  );
}
