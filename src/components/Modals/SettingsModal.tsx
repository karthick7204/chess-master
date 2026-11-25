import React from 'react';
import { GameSettings, TIME_CONTROLS } from '../../types/chess';
import { COACH_PERSONALITIES } from '../../data/personalities';
import { X, Volume2, Shield, Eye, Users, Timer } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSave: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [localSettings, setLocalSettings] = React.useState<GameSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Game & Coach Settings
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Coach Persona Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              Choose Your Coach
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {COACH_PERSONALITIES.map(p => (
                <div
                  key={p.id}
                  onClick={() => setLocalSettings(s => ({ ...s, personalityId: p.id }))}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    localSettings.personalityId === p.id
                      ? 'bg-sky-500/10 border-sky-500/50 shadow-sm'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">{p.avatar}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-white">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Coach Strength / ELO
              </label>
              <span className="text-xs font-bold font-mono text-emerald-400">
                {localSettings.difficulty === 1 && "Novice (~800 ELO)"}
                {localSettings.difficulty === 2 && "Casual (~1200 ELO)"}
                {localSettings.difficulty === 3 && "Club Player (~1500 ELO)"}
                {localSettings.difficulty === 4 && "Expert (~1800 ELO)"}
                {localSettings.difficulty === 5 && "Master (~2200 ELO)"}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={localSettings.difficulty}
              onChange={e => setLocalSettings(s => ({ ...s, difficulty: parseInt(e.target.value) }))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Player Color */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Play As
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLocalSettings(s => ({ ...s, playerColor: 'w' }))}
                className={`py-2 px-3 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-2 ${
                  localSettings.playerColor === 'w'
                    ? 'bg-slate-100 text-slate-900 border-white shadow'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <span>⚪ White (Moves First)</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalSettings(s => ({ ...s, playerColor: 'b' }))}
                className={`py-2 px-3 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-2 ${
                  localSettings.playerColor === 'b'
                    ? 'bg-slate-800 text-white border-slate-600 shadow'
                    : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span>⚫ Black (Coach First)</span>
              </button>
            </div>
          </div>

          {/* Time Control Preference */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-emerald-400" />
              Default Match Clock / Time Control
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_CONTROLS.slice(0, 6).map(tc => {
                const isSelected = (localSettings.timeControlId || 'unlimited') === tc.id;
                return (
                  <button
                    key={tc.id}
                    type="button"
                    onClick={() => setLocalSettings(s => ({ ...s, timeControlId: tc.id }))}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-sm'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{tc.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{tc.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{tc.category}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-sky-400" />
                Spoken Audio Commentary
              </span>
              <input
                type="checkbox"
                checked={localSettings.voiceEnabled}
                onChange={e => setLocalSettings(s => ({ ...s, voiceEnabled: e.target.checked }))}
                className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                Draw Best Move & Threat Arrows
              </span>
              <input
                type="checkbox"
                checked={localSettings.showArrows}
                onChange={e => setLocalSettings(s => ({ ...s, showArrows: e.target.checked }))}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md transition"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
