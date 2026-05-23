import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { leadService } from '../../services/leadService';

const STATUSES = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
const SOURCES = ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Outreach', 'Event', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function LeadModal({ lead, onClose, onSave }) {
  const isEdit = !!lead?._id;
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    source: 'Website', status: 'New', priority: 'Medium',
    value: '', tags: '', followUpDate: '',
    ...lead,
    tags: lead?.tags?.join(', ') || '',
    followUpDate: lead?.followUpDate ? lead.followUpDate.split('T')[0] : '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error('Name and email required');
    setLoading(true);
    try {
      const payload = {
        ...form,
        value: parseFloat(form.value) || 0,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        followUpDate: form.followUpDate || null,
      };
      let saved;
      if (isEdit) {
        const { data } = await leadService.updateLead(lead._id, payload);
        saved = data;
        toast.success('Lead updated');
      } else {
        const { data } = await leadService.createLead(payload);
        saved = data;
        toast.success('Lead created');
      }
      onSave(saved);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-bright border border-[#21262d] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#e6edf3]">{isEdit ? 'Edit Lead' : 'New Lead'}</h2>
            <button onClick={onClose} className="text-[#8b949e] hover:text-[#e6edf3] cursor-pointer p-1 rounded-lg hover:bg-[#21262d] transition-colors">
              <RiCloseLine size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8b949e] mb-1 block">Name *</label>
                <input className="input-field w-full px-3 py-2 rounded-lg text-sm" value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" required />
              </div>
              <div>
                <label className="text-xs text-[#8b949e] mb-1 block">Email *</label>
                <input type="email" className="input-field w-full px-3 py-2 rounded-lg text-sm" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8b949e] mb-1 block">Phone</label>
                <input className="input-field w-full px-3 py-2 rounded-lg text-sm" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 0100" />
              </div>
              <div>
                <label className="text-xs text-[#8b949e] mb-1 block">Company</label>
                <input className="input-field w-full px-3 py-2 rounded-lg text-sm" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Acme Inc." />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[#8b949e] mb-1 block">Status</label>
                <select className="input-field w-full px-3 py-2 rounded-lg text-sm cursor-pointer" value={form.status} onChange={e => set('status', e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8b949e] mb-1 block">Priority</label>
                <select className="input-field w-full px-3 py-2 rounded-lg text-sm cursor-pointer" value={form.priority} onChange={e => set('priority', e.target.value)}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8b949e] mb-1 block">Source</label>
                <select className="input-field w-full px-3 py-2 rounded-lg text-sm cursor-pointer" value={form.source} onChange={e => set('source', e.target.value)}>
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8b949e] mb-1 block">Deal Value ($)</label>
                <input type="number" className="input-field w-full px-3 py-2 rounded-lg text-sm" value={form.value} onChange={e => set('value', e.target.value)} placeholder="5000" />
              </div>
              <div>
                <label className="text-xs text-[#8b949e] mb-1 block">Follow-up Date</label>
                <input type="date" className="input-field w-full px-3 py-2 rounded-lg text-sm" value={form.followUpDate} onChange={e => set('followUpDate', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#8b949e] mb-1 block">Tags (comma separated)</label>
              <input className="input-field w-full px-3 py-2 rounded-lg text-sm" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="enterprise, priority, hot-lead" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 btn-primary px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-50">
                {loading ? 'Saving...' : (isEdit ? 'Update Lead' : 'Create Lead')}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
