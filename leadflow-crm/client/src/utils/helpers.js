export const BDA_STAGES = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];

export const SOURCES = ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Outreach', 'Event', 'Other'];

export const STATUS_CONFIG = {
  'New':           { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', label: 'New' },
  'Contacted':     { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)', label: 'Contacted' },
  'Proposal Sent': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', label: 'Proposal Sent' },
  'Negotiation':   { color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)', label: 'Negotiation' },
  'Closed Won':    { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', label: 'Closed Won' },
  'Closed Lost':   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', label: 'Closed Lost' },
};

// Legacy alias for Kanban
export const STATUS_COLORS = STATUS_CONFIG;

export const PRIORITY_CONFIG = {
  Low:    { color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  High:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

export const PRIORITY_COLORS = PRIORITY_CONFIG;

export const SOURCE_ICONS = {
  Website: '🌐', Referral: '👥', 'Social Media': '📱',
  'Email Campaign': '📧', 'Cold Outreach': '📞', Event: '🎯', Other: '✨',
};

export const ACTIVITY_ICONS = {
  created: '✦', updated: '✎', status_changed: '⇄', note_added: '📝',
};

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatCurrency = (val) => {
  if (!val) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
};

export const exportToCSV = (leads) => {
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Priority', 'Value', 'Assigned To', 'Follow-Up', 'Created'];
  const rows = leads.map(l => [
    l.name, l.email, l.phone, l.company, l.source, l.status, l.priority,
    l.value, l.assignedTo, formatDate(l.followUpDate), formatDate(l.createdAt),
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c || ''}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leadflow-export-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
