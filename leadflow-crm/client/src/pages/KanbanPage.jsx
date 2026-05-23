import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { leadService } from '../services/leadService';
import { StatusBadge, PriorityBadge } from '../components/ui/Badges';
import { formatCurrency, BDA_STAGES, STATUS_CONFIG } from '../utils/helpers';
import LeadModal from '../components/leads/LeadModal';
import LeadDrawer from '../components/leads/LeadDrawer';
import toast from 'react-hot-toast';
import { RiAddLine, RiRefreshLine } from 'react-icons/ri';

export default function KanbanPage() {
  const [columns, setColumns] = useState(() => Object.fromEntries(BDA_STAGES.map(s => [s, []])));
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [drawer, setDrawer] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await leadService.getLeads({ limit: 300 });
      const grouped = Object.fromEntries(BDA_STAGES.map(s => [s, []]));
      (data.leads || []).forEach(l => { if (grouped[l.status]) grouped[l.status].push(l); });
      setColumns(grouped);
    } catch { toast.error('Failed to load pipeline'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const srcCol = source.droppableId;
    const dstCol = destination.droppableId;
    const srcItems = [...columns[srcCol]];
    const dstItems = srcCol === dstCol ? srcItems : [...columns[dstCol]];
    const [moved] = srcItems.splice(source.index, 1);
    dstItems.splice(destination.index, 0, { ...moved, status: dstCol });
    setColumns(prev => ({ ...prev, [srcCol]: srcItems, [dstCol]: dstItems }));
    try {
      await leadService.updateLead(draggableId, { status: dstCol });
      toast.success(`Moved to "${dstCol}"`);
    } catch {
      toast.error('Failed to update status');
      fetchLeads();
    }
  };

  const colTotal = (col) => columns[col].reduce((s, l) => s + (l.value || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#e6edf3]">BDA Pipeline</h1>
          <p className="text-[#8b949e] text-sm">Drag leads across stages to update their status</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchLeads} className="btn-secondary px-3 py-2 rounded-lg text-sm flex items-center gap-1.5">
            <RiRefreshLine size={14} />
          </button>
          <button onClick={() => setModal('create')} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-1.5">
            <RiAddLine size={15} /> New Lead
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {BDA_STAGES.map(s => (
            <div key={s} className="card p-4 w-60 flex-shrink-0 space-y-3">
              <div className="skeleton h-4 w-24" />
              {[1,2].map(i => <div key={i} className="skeleton h-20 rounded-lg" />)}
            </div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4 min-h-[500px]">
            {BDA_STAGES.map(col => {
              const cfg = STATUS_CONFIG[col];
              return (
                <div key={col} className="card w-60 flex-shrink-0 flex flex-col overflow-hidden"
                  style={{ borderTop: `2px solid ${cfg.color}` }}>
                  <div className="px-3 py-3 border-b border-[#21262d]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold" style={{ color: cfg.color }}>{col}</span>
                      <span className="text-xs bg-[#21262d] text-[#8b949e] px-2 py-0.5 rounded-full">
                        {columns[col].length}
                      </span>
                    </div>
                    {columns[col].length > 0 && (
                      <div className="text-xs text-[#484f58] mt-1 font-mono">
                        {formatCurrency(colTotal(col))}
                      </div>
                    )}
                  </div>
                  <Droppable droppableId={col}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-2 space-y-2 min-h-[80px] transition-colors ${snapshot.isDraggingOver ? 'bg-[#21262d]' : ''}`}
                      >
                        {columns[col].map((lead, index) => (
                          <Draggable key={lead._id} draggableId={lead._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setDrawer(lead)}
                                className={`card-hover p-3 rounded-lg cursor-pointer transition-all ${snapshot.isDragging ? 'shadow-lg scale-105 border-[#58a6ff]' : ''}`}
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <img
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(lead.name)}&backgroundColor=1c2d4a&textColor=58a6ff`}
                                    alt={lead.name}
                                    className="w-6 h-6 rounded-full flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-[#e6edf3] truncate">{lead.name}</div>
                                    {lead.company && <div className="text-xs text-[#8b949e] truncate">{lead.company}</div>}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between gap-1">
                                  <PriorityBadge priority={lead.priority} />
                                  {lead.value > 0 && <span className="text-xs font-mono text-[#3fb950]">{formatCurrency(lead.value)}</span>}
                                </div>
                                {lead.notes?.length > 0 && (
                                  <div className="mt-1.5 text-xs text-[#484f58]">{lead.notes.length} note{lead.notes.length > 1 ? 's' : ''}</div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {columns[col].length === 0 && !snapshot.isDraggingOver && (
                          <div className="border border-dashed border-[#30363d] rounded-lg h-16 flex items-center justify-center text-xs text-[#484f58]">
                            Drop here
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {modal && <LeadModal lead={null} onClose={() => setModal(null)} onSave={fetchLeads} />}
      {drawer && (
        <LeadDrawer
          lead={drawer}
          onClose={() => setDrawer(null)}
          onEdit={() => { setModal(drawer); setDrawer(null); }}
          onDelete={async () => { await leadService.deleteLead(drawer._id); fetchLeads(); setDrawer(null); toast.success('Lead deleted'); }}
          onUpdate={(updated) => { fetchLeads(); if (drawer?._id === updated._id) setDrawer(updated); }}
        />
      )}
    </div>
  );
}
