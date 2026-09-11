import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  LogOut,
  Sun,
  Moon,
  Layers
} from 'lucide-react';

export default function Header() {
  const {
    currentUser,
    role,
    logout,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    theme,
    toggleTheme
  } = useApp();

  const isLight = theme === 'light';
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-2xl border-b transition-colors duration-200 ${
        isLight
          ? 'bg-white/95 border-slate-200 shadow-sm'
          : 'bg-slate-950/85 border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Layers size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-black tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Collaboration<span className="text-blue-600">Portal</span>
              </span>
            </div>
            <p
              className={`text-[11px] hidden sm:block font-medium ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Academia & Industry Platform
            </p>
          </div>
        </div>

        {/* Active Role Portal Badge (Non-switchable, represents authenticated user's workspace) */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            {role === 'student' && 'Student Portal & Skill Hub'}
            {role === 'industry' && 'Industry & Enterprise Portal'}
            {(role === 'academia' || role === 'faculty') && 'Academician & Faculty Research Hub'}
            {(role === 'institution' || role === 'admin') && 'Institution & Accreditation Directorate'}
          </span>
        </div>

        {/* Right: Notifications, Theme Toggle & User Session */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* In-App Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-full border transition-all cursor-pointer relative ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
              title="Notifications"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl p-4 z-50 border ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/80'
                    : 'bg-[#0a0f1d] border-slate-800 text-white shadow-2xl'
                }`}
              >
                <div className={`flex items-center justify-between pb-3 border-b mb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                  <span className="text-xs font-bold">
                    Notifications ({unreadCount} unread)
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        n.is_read
                          ? isLight
                            ? 'bg-slate-50 border border-slate-100 text-slate-500'
                            : 'bg-white/[0.02] border border-white/5 text-slate-400'
                          : isLight
                          ? 'bg-blue-50/80 border-l-2 border-blue-600 text-slate-800'
                          : 'bg-blue-600/10 border-l-2 border-blue-400 text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{n.title}</div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{n.body}</div>
                      <div className={`text-[9px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{n.sent_at}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Session & Sign Out */}
          {currentUser && (
            <div className={`flex items-center gap-2.5 pl-2 border-l ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className="text-right hidden sm:block">
                <div className={`text-xs font-bold truncate max-w-[130px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-blue-600 dark:text-sky-400 uppercase font-semibold">
                  {currentUser.role}
                </div>
              </div>
              <button
                onClick={logout}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border-slate-200'
                    : 'bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border-white/10'
                }`}
                title="Sign Out to Login Portal"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
