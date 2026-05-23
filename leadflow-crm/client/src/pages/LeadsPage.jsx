import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leadService } from '../services/leadService';
import LeadModal from '../components/leads/LeadModal';
import LeadDrawer from '../components/leads/LeadDrawer';
import { StatusBadge, PriorityBadge } from '../components/ui/Badges';
import { SkeletonRow } from '../components/ui/Skeletons';
import { formatDate, formatCurrency, getInitials, exportToCSV } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  RiAddLine, RiSearchLine, RiFilterLine, RiDownloadLine,
  RiDeleteBin6Line, RiEditLine, RiStickyNoteLine, RiRefreshLine,
  RiArrowUpLine, RiArrowDownLine
} from 'react-icons/ri';

const STATUSES = ['All', 'New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sort, setSort] = useState('-createdAt');
  const [modal, setModal] = useState(null); // null | 'create' | leadObj
  const [drawer, setDrawer] = useState(null); // leadObj
  const [selected, setSelected] = useState(new Set());
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort, limit: 100 };
      if (search) params.search = search;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;
      const { data } = await leadService.getLeads(params);
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sort]);

  useEffect(() => {
    const t = setTimeout(fetchLeads, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchLeads]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await leadService.deleteLead(id);
      setLeads(l => l.filter(x => x._id !== id));
      if (drawer?._id === id) setDrawer(null);
      toast.success('Lead deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} leads?`)) return;
    setDeleting(true);
    try {
      await Promise.all([...selected].map(id => leadService.deleteLead(id)));
      setLeads(l => l.filter(x => !selected.has(x._id)));
      setSelected(new Set());
      toast.success(`${selected.size} leads deleted`);
    } catch {
      toast.error('Bulk delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = (saved) => {
    setLeads(prev => {
      const idx = prev.findIndex(l => l._id === saved._id);
      if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n; }
      return [saved, ...prev];
    });
    if (drawer?._id === saved._id) setDrawer(saved);
  };

  const handleUpdate = (updated) => {
    setLeads(prev => prev.map(l => l._id === updated._id ? updated : l));
    if (drawer?._id === updated._id) setDrawer(updated);
  };

  const toggleSelect = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const toggleSort = (field) => {
    setSort(s => s === field ? `-${field}` : field);
  };

  const SortIcon = ({ field }) => {
    if (sort === field) return <RiArrowUpLine size={12} className="text-[#58a6ff]" />;
    if (sort === `-${field}`) return <RiArrowDownLine size={12} className="text-[#58a6ff]" />;
    return <RiArrowUpLine size={12} className="text-[#e6edf3]/20" />;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">Leads</h1>
          <p className="text-[#8b949e] text-sm">{total} total leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => exportToCSV(leads)} className="btn-secondary px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 cursor-pointer">
            <RiDownloadLine size={15} /> Export
          </button>
          <button onClick={() => setModal('create')} className="btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 cursor-pointer font-medium">
            <RiAddLine size={16} /> New Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <RiSearchLine size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, company..."
              className="input-field w-full pl-9 pr-4 py-2 rounded-lg text-sm"
            />
          </div>
          <button onClick={fetchLeads} className="btn-secondary px-3 py-2 rounded-lg cursor-pointer">
            <RiRefreshLine size={15} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <RiFilterLine size={13} className="text-[#8b949e]" />
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${statusFilter === s ? 'bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/10' : 'bg-[#21262d] text-[#8b949e] border border-white/5 hover:bg-white/10'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <div className="flex flex-wrap gap-1.5">
            {PRIORITIES.map(p => (
              <button key={p} onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${priorityFilter === p ? 'bg-[#8b5cf6]/10 text-purple-400 border border-purple-500/30' : 'bg-[#21262d] text-[#8b949e] border border-white/5 hover:bg-white/10'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass border border-[#f85149]/20 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <span className="text-sm text-[#e6edf3]/60">{selected.size} selected</span>
            <button onClick={handleBulkDelete} disabled={deleting}
              className="btn-danger px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer">
              <RiDeleteBin6Line size={13} /> Delete Selected
            </button>
            <button onClick={() => setSelected(new Set())} className="text-xs text-[#8b949e] hover:text-[#e6edf3] cursor-pointer ml-auto">
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#21262d] bg-white/2">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox"
                    checked={leads.length > 0 && selected.size === leads.length}
                    onChange={e => setSelected(e.target.checked ? new Set(leads.map(l => l._id)) : new Set())}
                    className="cursor-pointer accent-[#58a6ff]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs text-[#8b949e] uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1">Name <SortIcon field="name" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs text-[#8b949e] uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs text-[#8b949e] uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs text-[#8b949e] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs text-[#8b949e] uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs text-[#8b949e] uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('value')}>
                  <div className="flex items-center gap-1">Value <SortIcon field="value" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs text-[#8b949e] uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('createdAt')}>
                  <div className="flex items-center gap-1">Created <SortIcon field="createdAt" /></div>
                </th>
                <th className="px-4 py-3 text-right text-xs text-[#8b949e] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
              {!loading && leads.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-[#e6edf3]/20">
                    <div className="space-y-2">
                      <div className="text-4xl">🔍</div>
                      <div>No leads found</div>
                      <button onClick={() => setModal('create')} className="text-[#58a6ff] text-sm hover:underline cursor-pointer">
                        Add your first lead →
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              <AnimatePresence>
                {!loading && leads.map((lead, i) => (
                  <motion.tr
                    key={lead._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-[#21262d]/50 hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(lead._id)} onChange={() => toggleSelect(lead._id)} className="cursor-pointer accent-[#58a6ff]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setDrawer(lead)}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-[#58a6ff]/10 border border-[#21262d] flex items-center justify-center text-xs font-bold text-[#e6edf3] flex-shrink-0">
                          {getInitials(lead.name)}
                        </div>
                        <span className="font-medium text-[#e6edf3] hover:text-[#58a6ff] transition-colors">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#8b949e] text-xs">{lead.email}</td>
                    <td className="px-4 py-3 text-[#8b949e] text-xs">{lead.company || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={lead.priority} /></td>
                    <td className="px-4 py-3 text-xs font-mono text-[#3fb950]">{lead.value > 0 ? formatCurrency(lead.value) : '—'}</td>
                    <td className="px-4 py-3 text-[#8b949e] text-xs">{formatDate(lead.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setDrawer(lead)} title="Notes" className="p-1.5 rounded-lg hover:bg-[#21262d] text-[#8b949e] hover:text-[#58a6ff] cursor-pointer transition-colors">
                          <RiStickyNoteLine size={14} />
                        </button>
                        <button onClick={() => setModal(lead)} title="Edit" className="p-1.5 rounded-lg hover:bg-[#21262d] text-[#8b949e] hover:text-[#58a6ff] cursor-pointer transition-colors">
                          <RiEditLine size={14} />
                        </button>
                        <button onClick={() => handleDelete(lead._id)} title="Delete" className="p-1.5 rounded-lg hover:bg-[#21262d] text-[#8b949e] hover:text-[#f85149] cursor-pointer transition-colors">
                          <RiDeleteBin6Line size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <LeadModal
          lead={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {drawer && (
        <LeadDrawer
          lead={drawer}
          onClose={() => setDrawer(null)}
          onEdit={() => { setModal(drawer); setDrawer(null); }}
          onDelete={() => { handleDelete(drawer._id); setDrawer(null); }}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
