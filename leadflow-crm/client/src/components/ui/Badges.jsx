import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/helpers';

export const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { color: '#8b949e', bg: 'rgba(139,148,158,0.12)', border: 'rgba(139,148,158,0.3)' };
  return (
    <span className="badge" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
  const icons = { Low: '↓', Medium: '→', High: '↑' };
  return (
    <span className="badge" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}33` }}>
      {icons[priority]} {priority}
    </span>
  );
};
