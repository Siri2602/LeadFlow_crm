import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  RiDashboardLine, RiUserSearchLine, RiKanbanView, RiLineChartLine,
  RiSettings3Line, RiLogoutBoxLine, RiMenuFoldLine, RiMenuUnfoldLine,
  RiTeamLine,
} from 'react-icons/ri';
import { getInitials } from '../../utils/helpers';

const NAV_ITEMS = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/leads', icon: RiUserSearchLine, label: 'Leads' },
  { to: '/kanban', icon: RiKanbanView, label: 'Pipeline' },
  { to: '/analytics', icon: RiLineChartLine, label: 'Analytics' },
  { to: '/team', icon: RiTeamLine, label: 'Team Performance' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="sidebar-bg flex flex-col h-screen sticky top-0 overflow-hidden z-30 flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#21262d] min-h-[60px]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs">LF</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <div className="font-semibold text-[#e6edf3] text-sm leading-none">LeadFlow CRM</div>
              <div className="text-xs text-[#58a6ff] mt-0.5">BDA Platform</div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-[#484f58] hover:text-[#e6edf3] transition-colors cursor-pointer p-1 rounded"
        >
          {collapsed ? <RiMenuUnfoldLine size={15} /> : <RiMenuFoldLine size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-[#21262d] space-y-0.5">
        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title={collapsed ? 'Settings' : undefined}>
          <RiSettings3Line size={17} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button onClick={handleLogout} className="nav-link w-full hover:text-red-400 cursor-pointer">
          <RiLogoutBoxLine size={17} />
          {!collapsed && <span>Logout</span>}
        </button>
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 mt-1">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=1c2d4a&textColor=58a6ff`}
              alt={user.name}
              className="w-7 h-7 rounded-full flex-shrink-0"
            />
            {!collapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-[#e6edf3] truncate">{user.name}</div>
                <div className="text-xs text-[#8b949e] truncate capitalize">{user.role}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
}
