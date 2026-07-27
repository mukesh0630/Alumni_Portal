import React from 'react';
import { Settings, Moon, Sun, User, ShieldCheck, GraduationCap, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const SettingsView = ({ setActiveView }) => {
  const { currentUser, loginAs } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Settings & Presentation Simulator</h1>
        <p className="text-xs text-slate-400 mt-1">Theme management and instant presentation session switcher for HOD demo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Portal Preferences */}
        <div className="glass-panel space-y-4">
          <h3 className="text-base font-bold text-violet-400">Portal Preferences</h3>

          <div className="flex justify-between items-center p-3.5 bg-slate-950/40 rounded-xl border border-white/5">
            <div>
              <div className="text-xs font-bold text-white">Interface Theme</div>
              <div className="text-[11px] text-slate-400">Toggle between Light and premium Dark mode.</div>
            </div>
            <button onClick={toggleTheme} className="btn btn-secondary text-xs flex items-center gap-1.5">
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>

        {/* Presentation Session Simulator */}
        <div className="glass-panel space-y-4">
          <h3 className="text-base font-bold text-pink-400 flex items-center gap-2">
            ⚡ Presentation Session Simulator
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click these buttons to immediately switch session states. This allows demonstrating role behaviors (e.g. Faculty verifying alumni) without manual authentication steps.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => loginAs('visitor')}
              className={`btn text-xs font-bold flex items-center gap-1.5 justify-center py-2.5 ${
                currentUser.role === 'visitor' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <User className="w-3.5 h-3.5 text-slate-400" /> Visitor Mode
            </button>

            <button
              onClick={() => loginAs('student')}
              className={`btn text-xs font-bold flex items-center gap-1.5 justify-center py-2.5 ${
                currentUser.role === 'student' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Student Mode
            </button>

            <button
              onClick={() => loginAs('alumni')}
              className={`btn text-xs font-bold flex items-center gap-1.5 justify-center py-2.5 ${
                currentUser.role === 'alumni' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Alumni Mode
            </button>

            <button
              onClick={() => loginAs('faculty')}
              className={`btn text-xs font-bold flex items-center gap-1.5 justify-center py-2.5 ${
                currentUser.role === 'faculty' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-pink-400" /> Faculty Coordinator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
