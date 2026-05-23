import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine, RiEditLine, RiDeleteBin6Line, RiMailLine, RiPhoneLine, RiBuildingLine, RiCalendarLine } from 'react-icons/ri';
import { StatusBadge, PriorityBadge } from '../ui/Badges';
import NotesTimeline from '../notes/NotesTimeline';
import { formatDate, formatCurrency, getInitials } from '../../utils/helpers';

export default function LeadDrawer({ lead, onClose, onEdit, onDelete, onUpdate }) {
  if (!lead) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md glass-bright border-l border-[#21262d] z-50 overflow-y-auto"
      >
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#58a6ff] flex items-center justify-center font-bold text-[#e6edf3]">
                {getInitials(lead.name)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#e6edf3]">{lead.name}</h2>
                <p className="text-sm text-[#8b949e]">{lead.company || 'No company'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onEdit} className="btn-secondary p-2 rounded-lg cursor-pointer">
                <RiEditLine size={16} />
              </button>
              <button onClick={onDelete} className="btn-danger p-2 rounded-lg cursor-pointer">
                <RiDeleteBin6Line size={16} />
              </button>
              <button onClick={onClose} className="text-[#8b949e] hover:text-[#e6edf3] cursor-pointer p-2 rounded-lg hover:bg-[#21262d] transition-colors">
                <RiCloseLine size={20} />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={lead.status} />
            <PriorityBadge priority={lead.priority} />
            {lead.source && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#21262d] text-[#8b949e] border border-white/10">
                {lead.source}
              </span>
            )}
          </div>

          {/* Contact details */}
          <div className="glass rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-medium text-[#8b949e] uppercase tracking-widest">Contact</h3>
            <div className="space-y-2">
              {lead.email && (
                <div className="flex items-center gap-2 text-sm">
                  <RiMailLine size={14} className="text-[#58a6ff] flex-shrink-0" />
                  <a href={`mailto:${lead.email}`} className="text-[#e6edf3]/70 hover:text-[#58a6ff] transition-colors">{lead.email}</a>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <RiPhoneLine size={14} className="text-[#58a6ff] flex-shrink-0" />
                  <a href={`tel:${lead.phone}`} className="text-[#e6edf3]/70 hover:text-[#58a6ff] transition-colors">{lead.phone}</a>
                </div>
              )}
              {lead.company && (
                <div className="flex items-center gap-2 text-sm">
                  <RiBuildingLine size={14} className="text-[#58a6ff] flex-shrink-0" />
                  <span className="text-[#e6edf3]/70">{lead.company}</span>
                </div>
              )}
              {lead.followUpDate && (
                <div className="flex items-center gap-2 text-sm">
                  <RiCalendarLine size={14} className="text-[#d29922] flex-shrink-0" />
                  <span className="text-[#e6edf3]/70">Follow up: {formatDate(lead.followUpDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Deal value */}
          {lead.value > 0 && (
            <div className="glass rounded-xl p-4">
              <div className="text-xs text-[#8b949e] mb-1 uppercase tracking-widest">Deal Value</div>
              <div className="text-2xl font-bold text-[#3fb950] font-mono">{formatCurrency(lead.value)}</div>
            </div>
          )}

          {/* Tags */}
          {lead.tags?.length > 0 && (
            <div>
              <div className="text-xs text-[#8b949e] mb-2 uppercase tracking-widest">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-xs font-medium text-[#8b949e] uppercase tracking-widest mb-3">Activity & Notes</h3>
            <NotesTimeline lead={lead} onUpdate={onUpdate} />
          </div>

          <div className="text-xs text-[#e6edf3]/20 text-center">
            Added {formatDate(lead.createdAt)}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
