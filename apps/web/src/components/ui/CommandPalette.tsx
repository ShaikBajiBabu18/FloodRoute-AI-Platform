import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Map, 
  Navigation, 
  CloudRain, 
  Waves, 
  AlertTriangle, 
  PhoneCall, 
  FileText, 
  User, 
  ExternalLink, 
  Layers, 
  CornerDownLeft,
  X
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    {
      id: 'live-map',
      title: 'Open Full GIS Live Map',
      category: 'Navigation',
      icon: <Map className="w-4 h-4 text-cyan-400" />,
      action: () => { navigate('/map'); onClose(); },
      shortcut: 'G M'
    },
    {
      id: 'safe-routes',
      title: 'Plan Flood-Safe Route',
      category: 'Navigation',
      icon: <Navigation className="w-4 h-4 text-emerald-400" />,
      action: () => { navigate('/routes'); onClose(); },
      shortcut: 'G R'
    },
    {
      id: 'weather',
      title: 'Hyperlocal Weather & Rainfall Radar',
      category: 'Intelligence',
      icon: <CloudRain className="w-4 h-4 text-sky-400" />,
      action: () => { navigate('/weather'); onClose(); },
      shortcut: 'G W'
    },
    {
      id: 'flood-intel',
      title: 'National Flood Intelligence & River Stages',
      category: 'Intelligence',
      icon: <Waves className="w-4 h-4 text-blue-400" />,
      action: () => { navigate('/flood'); onClose(); },
      shortcut: 'G F'
    },
    {
      id: 'report-hazard',
      title: 'Report Live Flood Hazard or Road Blockage',
      category: 'Citizen Action',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      action: () => { navigate('/report'); onClose(); },
      shortcut: 'G H'
    },
    {
      id: 'emergency',
      title: 'Emergency Lifeline Directory (112, Hospitals, Rescue)',
      category: 'Safety',
      icon: <PhoneCall className="w-4 h-4 text-rose-400" />,
      action: () => { navigate('/emergency'); onClose(); },
      shortcut: 'G E'
    },
    {
      id: 'alerts',
      title: 'Official NDMA / IMD Disaster Bulletins',
      category: 'Safety',
      icon: <FileText className="w-4 h-4 text-orange-400" />,
      action: () => { navigate('/alerts'); onClose(); },
    },
    {
      id: 'profile',
      title: 'Responder Profile & My Submissions',
      category: 'Account',
      icon: <User className="w-4 h-4 text-indigo-400" />,
      action: () => { navigate('/profile'); onClose(); },
    },
    {
      id: 'city-chennai',
      title: 'Quick Location: Chennai Adyar & Velachery Corridor',
      category: 'Locations',
      icon: <Map className="w-4 h-4 text-slate-400" />,
      action: () => { navigate('/map?lat=12.9756&lng=80.2207&zoom=13'); onClose(); },
    },
    {
      id: 'city-mumbai',
      title: 'Quick Location: Mumbai Mithi River Basin & Kurla',
      category: 'Locations',
      icon: <Map className="w-4 h-4 text-slate-400" />,
      action: () => { navigate('/map?lat=19.0728&lng=72.8797&zoom=13'); onClose(); },
    },
    {
      id: 'city-guwahati',
      title: 'Quick Location: Guwahati Brahmaputra River Basin',
      category: 'Locations',
      icon: <Map className="w-4 h-4 text-slate-400" />,
      action: () => { navigate('/map?lat=26.1445&lng=91.7362&zoom=13'); onClose(); },
    }
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 px-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl bg-slate-900/90 border border-slate-700/60 rounded-[20px] shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search commands, cities, flood maps, weather... (Press ESC to close)"
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none"
            />
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                No matching results found for "{query}"
              </div>
            ) : (
              filteredCommands.map((command, idx) => (
                <div
                  key={command.id}
                  onClick={command.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    idx === selectedIndex
                      ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/10 border border-cyan-500/30 text-white'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                      {command.icon}
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-medium">{command.title}</span>
                      <span className="ml-2 text-xs text-slate-500 font-mono">[{command.category}]</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {command.shortcut && (
                      <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {command.shortcut}
                      </kbd>
                    )}
                    {idx === selectedIndex && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer info */}
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">↓</kbd>
              to navigate
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] ml-2">↵</kbd>
              to select
            </span>
            <span className="text-cyan-400 font-mono">FloodRoute AI GIS Platform</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
