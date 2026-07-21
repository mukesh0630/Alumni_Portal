import React from 'react';
import {
  LayoutDashboard,
  Users,
  Award,
  BarChart3,
  Sparkles,
  Info,
  Phone,
  Settings,
  ShieldCheck,
  UserCog,
  GraduationCap,
  Sparkle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeView, setActiveView }) => {
  const { currentUser } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'directory', label: 'Directory', icon: Users },
    { id: 'hall-of-fame', label: 'Hall of Fame', icon: Award },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'AI' },
    { id: 'about', label: 'About Dept', icon: Info },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-950/60 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0 left-0 z-30 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-violet-500/25">
            CS
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white leading-tight">Alumni Portal</h2>
            <span className="text-[10px] text-slate-400 font-medium">B.Sc CS Dept (1994 - Pres.)</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-violet-800 text-white shadow-lg shadow-violet-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md bg-pink-500/20 text-pink-300 text-[9px] font-extrabold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Role Based Navigation */}
          {currentUser.role === 'faculty' && (
            <button
              onClick={() => setActiveView('faculty-dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs mt-4 transition-all ${
                activeView === 'faculty-dashboard'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
                  : 'bg-pink-950/30 border border-pink-500/20 text-pink-300 hover:bg-pink-900/40'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-pink-400" />
              <span>Faculty Verification Panel</span>
            </button>
          )}

          {currentUser.role === 'alumni' && (
            <button
              onClick={() => setActiveView('alumni-dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs mt-4 transition-all ${
                activeView === 'alumni-dashboard'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-900/40'
              }`}
            >
              <UserCog className="w-4 h-4 text-emerald-400" />
              <span>My Profile & Timeline</span>
            </button>
          )}

          {currentUser.role === 'student' && (
            <button
              onClick={() => setActiveView('student-graduation')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs mt-4 transition-all ${
                activeView === 'student-graduation'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-blue-950/30 border border-blue-500/20 text-blue-300 hover:bg-blue-900/40'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Request Alumni Status</span>
            </button>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 text-center">
        <span className="text-[10px] text-slate-500 font-medium">© 2026 Dept of Computer Science</span>
      </div>
    </aside>
  );
};
