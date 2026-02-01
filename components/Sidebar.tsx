import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Edit2, Check, X, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSystemLog } from '../context/SystemLogContext';

interface SidebarProps {
  isLightMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isLightMode }) => {
  const {
    sessions, activeSessionId, createNewSession, deleteSession,
    setActiveSession, updateActiveSessionTitle
  } = useSystemLog();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = (id: string) => {
    updateActiveSessionTitle(editTitle);
    setEditingId(null);
  };

  const bgColor = isLightMode ? 'bg-slate-50' : 'bg-slate-950';
  const borderColor = isLightMode ? 'border-slate-200' : 'border-slate-800';
  const hoverColor = isLightMode ? 'hover:bg-slate-200' : 'hover:bg-slate-900';
  const activeColor = isLightMode ? 'bg-blue-100 text-blue-700' : 'bg-emerald-500/10 text-emerald-400';

  return (
    <div
      className={`fixed left-0 top-0 h-full z-50 border-r transition-all duration-300 flex flex-col ${bgColor} ${borderColor} ${isCollapsed ? 'w-12' : 'w-64'}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-3 top-20 bg-emerald-500 text-white rounded-full p-1 shadow-lg z-50 hover:bg-emerald-600 transition-colors`}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Header */}
      <div className={`p-4 border-b ${borderColor} flex items-center justify-between overflow-hidden whitespace-nowrap`}>
        {!isCollapsed && <h2 className="font-bold flex items-center gap-2 text-emerald-500"><History size={18} /> HISTORY</h2>}
        <button
          onClick={createNewSession}
          className={`p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all ${isCollapsed ? 'mx-auto' : ''}`}
          title="New Chat"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group relative rounded-lg transition-all cursor-pointer ${hoverColor} ${activeSessionId === session.id ? activeColor : 'text-slate-500'} ${isCollapsed ? 'p-2 flex justify-center' : 'p-3'}`}
            onClick={() => setActiveSession(session.id)}
          >
            {isCollapsed ? (
              <MessageSquare size={18} />
            ) : (
              <div className="flex items-center gap-3 w-full pr-12">
                <MessageSquare size={18} className="shrink-0" />
                {editingId === session.id ? (
                  <input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(session.id)}
                    className="bg-transparent border-b border-emerald-500 outline-none w-full"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate text-sm font-medium">{session.title}</span>
                )}
              </div>
            )}

            {!isCollapsed && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId === session.id ? (
                  <button onClick={(e) => { e.stopPropagation(); handleSaveEdit(session.id); }} className="p-1 hover:text-emerald-500"><Check size={14} /></button>
                ) : (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); handleStartEdit(session.id, session.title); }} className="p-1 hover:text-emerald-500"><Edit2 size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }} className="p-1 hover:text-red-500"><Trash2 size={14} /></button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className={`p-4 border-t ${borderColor} text-[10px] text-slate-500 text-center font-mono uppercase tracking-widest`}>
          Phase 2 // ThinkMode
        </div>
      )}
    </div>
  );
};

export default Sidebar;
