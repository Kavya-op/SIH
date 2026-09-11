import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import ToastContainer from './components/ToastContainer';
import AuthPortal from './components/Auth/AuthPortal';
import StudentDashboard from './components/Student/StudentDashboard';
import IndustryDashboard from './components/Industry/IndustryDashboard';
import FacultyHub from './components/Academician/FacultyHub';
import AdminDashboard from './components/Admin/AdminDashboard';

function MainContent() {
  const { role } = useApp();

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {role === 'student' && <StudentDashboard />}
      {role === 'industry' && <IndustryDashboard />}
      {(role === 'academia' || role === 'faculty') && <FacultyHub />}
      {(role === 'institution' || role === 'admin') && <AdminDashboard />}
    </main>
  );
}

function MinimalFooter() {
  const { theme } = useApp();
  const isLight = theme === 'light';

  return (
    <footer
      className={`border-t py-6 px-6 text-xs text-center transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200 text-slate-500'
          : 'bg-slate-950 border-white/10 text-slate-400'
      }`}
    >
      © 2026 Collaboration Portal. All rights reserved.
    </footer>
  );
}

function AppContent() {
  const { currentUser } = useApp();

  // If user is not authenticated, render ONLY the completely minimalistic 2-page login portal (Login & Create Account)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col justify-center">
        <ToastContainer />
        <AuthPortal defaultPage="login" />
      </div>
    );
  }

  // Once authenticated, render their role dashboard with clean header & sign out
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      <Header />
      <MainContent />
      <MinimalFooter />
      <ToastContainer />
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4 border border-red-500/30">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 font-mono text-xs bg-slate-900 p-3 rounded-lg border border-white/5">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.removeItem('portal_active_session');
                window.location.reload();
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-600/25"
            >
              Reset Session & Return to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/10"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
