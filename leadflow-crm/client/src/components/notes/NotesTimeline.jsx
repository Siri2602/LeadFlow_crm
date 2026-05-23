import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSendPlaneLine, RiDeleteBin6Line } from 'react-icons/ri';
import { leadService } from '../../services/leadService';
import { timeAgo } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function NotesTimeline({ lead, onUpdate }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!note.trim()) return;
    setLoading(true);
    try {
      const { data } = await leadService.addNote(lead._id, note);
      setNote('');
      onUpdate(data);
      toast.success('Note added');
    } catch {
      toast.error('Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      const { data } = await leadService.deleteNote(lead._id, noteId);
      onUpdate(data);
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const notes = [...(lead.notes || [])].reverse();

  return (
    <div className="space-y-4">
      {/* Add note */}
      <div className="flex gap-2">
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleAdd()}
          placeholder="Add a note... (Ctrl+Enter to submit)"
          rows={2}
          className="input-field flex-1 px-3 py-2 rounded-xl text-sm resize-none"
        />
        <button
          onClick={handleAdd}
          disabled={loading || !note.trim()}
          className="btn-primary px-4 rounded-xl flex-shrink-0 cursor-pointer disabled:opacity-50"
        >
          <RiSendPlaneLine size={18} />
        </button>
      </div>

      {/* Notes list */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        <AnimatePresence>
          {notes.length === 0 && (
            <div className="text-center py-6 text-[#e6edf3]/20 text-sm">No notes yet</div>
          )}
          {notes.map((n) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group relative glass rounded-xl p-3"
            >
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-[#e6edf3]/80 leading-relaxed">{n.content}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-[#8b949e]">{n.author}</span>
                    <span className="text-xs text-[#e6edf3]/20">·</span>
                    <span className="text-xs text-[#8b949e]">{timeAgo(n.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="opacity-0 group-hover:opacity-100 text-[#e6edf3]/20 hover:text-[#f85149] cursor-pointer transition-all p-1 rounded"
                >
                  <RiDeleteBin6Line size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
