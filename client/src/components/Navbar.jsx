import React, { useState, useEffect } from 'react';
import { Search, Bell, Sun, Moon, LogIn, User, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export const Navbar = ({ activeView, setActiveView, setSearchQuery, searchQuery }) => {
  const { currentUser, loginAs, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res.success) setNotifications(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkRead = async () => {
    try {
      const res = await api.markNotificationsRead();
      if (res.success) setNotifications(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-slate-950/40 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alumni, companies, roles..."
            value={searchQuery}
            onFocus={() => {
              if (activeView !== 'directory') setActiveView('directory');
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-violet-500/40 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-violet-500 animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-violet-500" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Notifications</span>
                <button
                  onClick={handleMarkRead}
                  className="text-[10px] text-violet-400 hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto mt-2 space-y-2">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-lg text-xs transition-colors ${
                      n.unread ? 'bg-violet-950/40 border border-violet-800/40' : 'bg-slate-950/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-snug">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-violet-500/40 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile / Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 transition-colors"
          >
            <img
              src={currentUser.photo}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-violet-500/40"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white line-clamp-1">{currentUser.name}</div>
              <div className="text-[10px] text-violet-400 capitalize font-semibold">{currentUser.role} Mode</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
              <div className="p-2 border-b border-slate-800">
                <span className="text-[10px] text-slate-400">Logged in as</span>
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[10px] text-violet-400 capitalize font-medium">{currentUser.role} Account</div>
              </div>

              <div className="py-1">
                <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Switch Role</span>
                <button
                  onClick={() => { loginAs('student'); setShowProfileMenu(false); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                >
                  <span>Student View</span>
                  {currentUser.role === 'student' && <Check className="w-3 h-3 text-violet-400" />}
                </button>
                <button
                  onClick={() => { loginAs('alumni'); setShowProfileMenu(false); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                >
                  <span>Alumni View</span>
                  {currentUser.role === 'alumni' && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
                <button
                  onClick={() => { loginAs('faculty'); setShowProfileMenu(false); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                >
                  <span>Faculty Coordinator</span>
                  {currentUser.role === 'faculty' && <Check className="w-3 h-3 text-pink-400" />}
                </button>
                <button
                  onClick={() => { loginAs('guest'); setShowProfileMenu(false); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                >
                  <span>Guest Mode</span>
                  {currentUser.role === 'guest' && <Check className="w-3 h-3 text-slate-400" />}
                </button>
              </div>

              <div className="border-t border-slate-800 pt-1 mt-1">
                <button
                  onClick={() => { setActiveView('settings'); setShowProfileMenu(false); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg"
                >
                  Settings & Preferences
                </button>
                <button
                  onClick={() => { logout(); setShowProfileMenu(false); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-red-400 hover:bg-red-950/40 rounded-lg flex items-center gap-1.5 mt-1"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
