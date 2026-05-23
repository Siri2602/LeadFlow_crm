import { motion } from 'framer-motion';

const ACCENTS = {
  blue: 'stat-accent-blue',
  green: 'stat-accent-green',
  amber: 'stat-accent-amber',
  red: 'stat-accent-red',
  purple: 'stat-accent-purple',
};

const VALUE_COLORS = {
  blue: 'text-[#58a6ff]',
  green: 'text-[#3fb950]',
  amber: 'text-[#d29922]',
  red: 'text-[#f85149]',
  purple: 'text-[#8b5cf6]',
};

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`card p-5 ${ACCENTS[color]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#8b949e] font-medium uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#21262d] flex items-center justify-center">
            <Icon size={16} className={VALUE_COLORS[color]} />
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold font-mono ${VALUE_COLORS[color]}`}>{value}</div>
      {subtitle && <div className="text-xs text-[#484f58] mt-1">{subtitle}</div>}
    </motion.div>
  );
}
