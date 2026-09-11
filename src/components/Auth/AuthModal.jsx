import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { signUpWithRole, signInUser } from '../../lib/supabase';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Building,
  ShieldCheck,
  X,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'register' }) {
  const {
    institutions,
    setRole,
    setCurrentView,
    setCurrentUser,
    addToast,
    logAuditEvent,
    dispatchNotification,
    theme
  } = useApp();

  const isLight = theme === 'light';
  const [mode, setMode] = useState(initialMode); // 'register' | 'login'
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'academia' | 'institution' | 'industry'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync mode whenever modal opens with a new initialMode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    // Student specific
    enrollmentNo: '',
    institutionId: 'inst-aiia-01',
    department: 'Dravyaguna (Clinical Pharmacology)',
    course: 'Bachelor of Ayurvedic Medicine & Surgery (BAMS)',
    yearOfStudy: '4',
    // Academia specific
    facultyDepartment: 'Dravyaguna (Herbal Pharmacology)',
    facultyDesignation: 'Associate Professor',
    specialization: 'Phytochemistry & LC-MS Standardization',
    researchAreas: 'Reverse Pharmacology, Network Biology',
    // Institution specific
    institutionName: 'All India Institute of Ayurveda (AIIA)',
    institutionType: 'Autonomous National Institute of Ayush',
    nirfCode: 'AIIA-DEL-2026',
    // Industry specific
    companyName: '',
    industrySector: 'Phytopharmaceuticals & Formulations',
    designation: 'Head of Clinical R&D / Talent Partner',
    cinGstin: ''
  });

  if (!isOpen) return null;

  const rolesConfig = [
    {
      id: 'student',
      title: 'Student',
      label: 'Student / Scholar',
      desc: 'BAMS, MD & BioTech Scholars',
      icon: GraduationCap,
      color: '#38bdf8'
    },
    {
      id: 'academia',
      title: 'Academia',
      label: 'Academia / Faculty',
      desc: 'Professors, Guides & Researchers',
      icon: BookOpen,
      color: '#60a5fa'
    },
    {
      id: 'institution',
      title: 'Institution',
      label: 'Institution / Directorate',
      desc: 'Colleges, Universities & T&P Cells',
      icon: Building,
      color: '#93c5fd'
    },
    {
      id: 'industry',
      title: 'Industry',
      label: 'Industry / Recruiter',
      desc: 'Pharma, CROs & AYUSH Enterprises',
      icon: Briefcase,
      color: '#2563eb'
    }
  ];

  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: digitsOnly }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.fullName.trim()) {
      addToast('Please enter your Full Legal Name.', 'warning');
      return;
    }

    if (!/^[a-zA-Z\s.]{3,60}$/.test(formData.fullName.trim())) {
      addToast('Full name must be at least 3 characters (letters only).', 'warning');
      return;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      addToast('Please enter a valid email address.', 'warning');
      return;
    }

    const cleanPhone = (formData.phone || '').replace(/\D/g, '');
    if (!cleanPhone) {
      addToast('10-digit Indian mobile number is required.', 'warning');
      return;
    }

    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      addToast('Indian mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.', 'warning');
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      addToast('Password must be at least 8 characters long.', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Execute registration with SQLite local persistence / Supabase
      const result = await signUpWithRole({
        email: formData.email.trim(),
        password: formData.password,
        role: selectedRole,
        fullName: formData.fullName.trim(),
        metadata: {
          phone: `+91 ${cleanPhone}`,
          enrollmentNo: formData.enrollmentNo,
          companyName: formData.companyName,
          specialization: formData.specialization,
          institutionName: formData.institutionName
        }
      });

      if (result.error) {
        addToast(result.error, 'warning');
        setLoading(false);
        return;
      }

      // Update context state
      setCurrentUser(result.user);
      setRole(selectedRole);
      setCurrentView('dashboard');

      logAuditEvent('user.register', 'users', result.user.id, {
        role: selectedRole,
        email: formData.email,
        provider: result.provider
      });

      dispatchNotification(
        'Welcome to AyushSetu!',
        `Account successfully registered as ${selectedRole.toUpperCase()}. Your custom profile dashboard is active.`
      );

      addToast(
        `Welcome ${formData.fullName}! Stored in ${result.provider === 'supabase' ? 'Supabase' : 'Secure Platform Storage'}.`,
        'success'
      );

      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (_) {}

      onClose();
    } catch (err) {
      addToast(err.message || 'Registration failed', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      addToast('Please provide both email and password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const result = await signInUser({
        email: formData.email,
        password: formData.password
      });

      if (result.error) {
        addToast(result.error, 'warning');
        setLoading(false);
        return;
      }

      const roleToUse = result.user?.role || selectedRole;
      setCurrentUser(result.user);
      setRole(roleToUse);
      setCurrentView('dashboard');

      logAuditEvent('user.login', 'users', result.user.id, {
        role: roleToUse,
        provider: result.provider
      });

      addToast(`Signed in as ${roleToUse.toUpperCase()}. Routing to Profile...`, 'success');
      onClose();
    } catch (err) {
      addToast(err.message || 'Login failed', 'warning');
    } finally {
      setLoading(false);
    }
  };

  // Instant 1-click persona sign-in for SIH evaluators
  const handleQuickLogin = (roleId, personaName, email) => {
    const personaUser = {
      id: `usr-${roleId}-eval`,
      email,
      fullName: personaName,
      role: roleId
    };

    setCurrentUser(personaUser);
    setRole(roleId);
    setCurrentView('dashboard');
    logAuditEvent('user.quick_login', 'users', personaUser.id, { role: roleId });
    addToast(`Authenticated as ${personaName} (${roleId.toUpperCase()}). Routing to profile...`, 'info');
    onClose();
  };

  return (
    /* Outermost wrapper with strict dead-center requirements */
    <div
      className="fixed inset-0 z-50 min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      {/* Spacious Frosted Card: max-w-lg, centered horizontally, p-10/p-12 breathing room */}
      <div
        className={`w-full max-w-lg mx-auto p-8 sm:p-10 md:p-12 rounded-3xl border shadow-2xl transition-all duration-200 my-auto ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-blue-500/10'
            : 'bg-slate-900/90 backdrop-blur-2xl border-white/10 text-white shadow-blue-500/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CARD HEADER */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {mode === 'register' ? 'Create Account' : 'Sign In to Portal'}
                </h3>
              </div>
              <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {mode === 'register'
                  ? 'Select your role and start your customized workspace'
                  : 'Access your verified role profile or test with pre-seeded personas'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isLight
                ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODE SWITCHER TABS - PILL SHAPED */}
        <div className="mb-8">
          <div
            className={`grid grid-cols-2 p-1.5 rounded-full border ${
              isLight
                ? 'bg-slate-100 border-slate-200'
                : 'bg-slate-950/80 border-white/10'
            }`}
          >
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-3 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-3 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In / Personas
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODE 1: CREATE ACCOUNT FORM (FLEX-COL & GAP-6 BETWEEN EVERY ELEMENT)      */}
        {/* ========================================================================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-6">
            {/* ELEMENT 1: MANDATORY ROLE SELECTION DROPDOWN & TILES */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="role-select-dropdown"
                  className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-400 dark:text-sky-400 flex items-center gap-1.5"
                >
                  <span>1. Select Mandatory Role *</span>
                  <span className="text-[11px] font-normal opacity-80">(Required)</span>
                </label>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  4 Distinct Roles
                </span>
              </div>

              {/* Premium Dark Dropdown input: bg-slate-800, border-slate-700, focus:ring-blue-500 */}
              <select
                id="role-select-dropdown"
                required
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className={`w-full py-3.5 px-4 rounded-xl border font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer shadow-sm ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                    : 'bg-slate-800 border-slate-700 text-white'
                }`}
              >
                <option value="student">🎓 Student (Scholar & Internships)</option>
                <option value="academia">📖 Academia (Faculty & Joint R&D)</option>
                <option value="institution">🏛️ Institution (Directorate & NAAC/NIRF Records)</option>
                <option value="industry">💼 Industry (Corporate Partner & Hiring)</option>
              </select>

              {/* Visual Role Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {rolesConfig.map(r => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 dark:text-sky-300 shadow-md'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <Icon size={20} className={isSelected ? 'text-blue-500 dark:text-sky-400' : 'opacity-60'} />
                      <span className="text-xs font-bold leading-tight">{r.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ELEMENT 2: FULL NAME (bg-slate-800, border-slate-700, focus:ring-2 focus:ring-blue-500) */}
            <div className="flex flex-col gap-2">
              <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                Full Name *
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Priyanshu Das"
                  value={formData.fullName}
                  onChange={e => handleInputChange('fullName', e.target.value)}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                      : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* ELEMENT 3: OFFICIAL EMAIL (bg-slate-800, border-slate-700, focus:ring-2 focus:ring-blue-500) */}
            <div className="flex flex-col gap-2">
              <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                Official Email Address *
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder={selectedRole === 'student' ? 'scholar@aiia.gov.in' : 'name@company.com'}
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                      : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* ELEMENT 4: PHONE NUMBER WITH INDIAN COUNTRY CODE (+91) */}
            <div className="flex flex-col gap-2">
              <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                Mobile Number (India) *
              </label>
              <div className="relative flex items-center">
                {/* Fixed Indian Country Code (+91) Badge */}
                <div
                  className={`flex items-center gap-1.5 px-3.5 py-3.5 rounded-l-xl border border-r-0 font-bold text-xs select-none shrink-0 ${
                    formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                      : isLight
                      ? 'bg-slate-100 border-slate-300 text-slate-700'
                      : 'bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                  title="India Country Code (+91) - Mandatory for Indian citizen registration"
                >
                  <span className="text-base leading-none">🇮🇳</span>
                  <span className="font-extrabold tracking-wide">+91</span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="98765 43210"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  className={`w-full pr-8 py-3.5 rounded-r-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)
                      ? 'border-red-500 bg-red-50/20 text-red-900 dark:text-red-200 focus:ring-red-400'
                      : formData.phone && /^[6-9]\d{9}$/.test(formData.phone)
                      ? 'border-emerald-500 bg-emerald-50/10 focus:ring-emerald-400'
                      : isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                      : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                  }`}
                />
                {formData.phone && /^[6-9]\d{9}$/.test(formData.phone) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <Check size={18} />
                  </div>
                )}
              </div>
              {formData.phone && !/^[6-9]\d{9}$/.test(formData.phone) ? (
                <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>Indian mobile numbers must start with 6, 7, 8, or 9 and be 10 digits</span>
                </div>
              ) : formData.phone && /^[6-9]\d{9}$/.test(formData.phone) ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                  <Check size={13} className="shrink-0" />
                  <span>Valid Indian Mobile (+91 {formData.phone})</span>
                </div>
              ) : (
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  10-digit number starting with 6, 7, 8, or 9
                </p>
              )}
            </div>

            {/* ELEMENT 5: PASSWORD (bg-slate-800, border-slate-700, focus:ring-2 focus:ring-blue-500) */}
            <div className="flex flex-col gap-2">
              <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                Password *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  className={`w-full pl-11 pr-12 py-3.5 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                      : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
                    isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ELEMENT 6: ROLE-SPECIFIC EXTENSION FIELDS */}
            {selectedRole === 'student' && (
              <div className="flex flex-col gap-6 pt-2 border-t border-white/10">
                <div className="flex flex-col gap-2">
                  <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Institution
                  </label>
                  <select
                    value={formData.institutionId}
                    onChange={e => handleInputChange('institutionId', e.target.value)}
                    className={`w-full py-3.5 px-4 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  >
                    {institutions.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Enrollment / Roll No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AIIA/2022/BAMS/082"
                    value={formData.enrollmentNo}
                    onChange={e => handleInputChange('enrollmentNo', e.target.value)}
                    className={`w-full py-3.5 px-4 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>
            )}

            {selectedRole === 'academia' && (
              <div className="flex flex-col gap-6 pt-2 border-t border-white/10">
                <div className="flex flex-col gap-2">
                  <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Academic Designation
                  </label>
                  <input
                    type="text"
                    value={formData.facultyDesignation}
                    onChange={e => handleInputChange('facultyDesignation', e.target.value)}
                    placeholder="e.g. Associate Professor"
                    className={`w-full py-3.5 px-4 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.facultyDepartment}
                    onChange={e => handleInputChange('facultyDepartment', e.target.value)}
                    placeholder="e.g. Dravyaguna (Herbal Pharmacology)"
                    className={`w-full py-3.5 px-4 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Research Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={e => handleInputChange('specialization', e.target.value)}
                    placeholder="e.g. Phytochemistry & LC-MS Standardization"
                    className={`w-full py-3.5 px-4 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>
            )}

            {selectedRole === 'institution' && (
              <div className="flex flex-col gap-6 pt-2 border-t border-white/10">
                <div className="flex flex-col gap-2">
                  <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    College / University Name
                  </label>
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={e => handleInputChange('institutionName', e.target.value)}
                    placeholder="e.g. All India Institute of Ayurveda"
                    className={`w-full py-3.5 px-4 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    NIRF / AISHE Code
                  </label>
                  <input
                    type="text"
                    value={formData.nirfCode}
                    onChange={e => handleInputChange('nirfCode', e.target.value)}
                    placeholder="e.g. AIIA-DEL-2026"
                    className={`w-full py-3.5 px-4 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>
            )}

            {selectedRole === 'industry' && (
              <div className="flex flex-col gap-6 pt-2 border-t border-white/10">
                <div className="flex flex-col gap-2">
                  <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Company / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Baidyanath Research & Formulations"
                    value={formData.companyName}
                    onChange={e => handleInputChange('companyName', e.target.value)}
                    className={`w-full py-3.5 px-4 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Corporate CIN / GSTIN (Verification)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. U24233MH1917PLC000450"
                    value={formData.cinGstin}
                    onChange={e => handleInputChange('cinGstin', e.target.value)}
                    className={`w-full py-3.5 px-4 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* ACTION BUTTONS - PILL SHAPED */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3.5">
              <button
                type="button"
                onClick={onClose}
                className={`w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  isLight
                    ? 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                    : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-9 py-4 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Creating Account...' : `Register & Launch ${rolesConfig.find(r => r.id === selectedRole)?.title} Profile`}</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: SIGN IN & EVALUATOR PERSONAS (FLEX-COL & GAP-6)                   */}
        {/* ========================================================================= */}
        {mode === 'login' && (
          <div className="flex flex-col gap-6">
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
              {/* EMAIL */}
              <div className="flex flex-col gap-2">
                <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@institution.gov.in"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-2">
                <label className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Password *
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    className={`w-full pl-11 pr-12 py-3.5 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
                      isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
                    }`}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* SIGN IN BUTTON - PILL SHAPED */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-8 rounded-full text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Your Dashboard'}</span>
                <ArrowRight size={17} />
              </button>
            </form>

            {/* 1-CLICK PERSONA FAST TRACK FOR SIH EVALUATION */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-400 dark:text-sky-400">
                <KeyRound size={16} />
                <span>Instant 1-Click Evaluator Personas (Hackathon Fast-Track)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => handleQuickLogin('student', 'Aarav Sharma', 'aarav.sharma@aiia.gov.in')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isLight
                      ? 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 hover:border-blue-400'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-white/10 hover:border-blue-500/50'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 dark:text-sky-300 border border-blue-500/30">
                      Student
                    </span>
                    <h4 className={`text-sm font-bold mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Aarav Sharma
                    </h4>
                    <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Final Year BAMS • AIIA Scholar
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-blue-400 dark:text-sky-400 shrink-0" />
                </div>

                <div
                  onClick={() => handleQuickLogin('academia', 'Prof. Dr. Ananya Trivedi', 'a.trivedi@aiia.gov.in')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isLight
                      ? 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 hover:border-blue-400'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-white/10 hover:border-blue-500/50'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 dark:text-sky-300 border border-blue-500/30">
                      Academia
                    </span>
                    <h4 className={`text-sm font-bold mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Prof. Dr. Ananya Trivedi
                    </h4>
                    <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      HOD Dravyaguna • AIIA Faculty
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-blue-400 dark:text-sky-400 shrink-0" />
                </div>

                <div
                  onClick={() => handleQuickLogin('institution', 'AIIA Directorate & T&P', 'director@aiia.gov.in')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isLight
                      ? 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 hover:border-blue-400'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-white/10 hover:border-blue-500/50'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 dark:text-sky-300 border border-blue-500/30">
                      Institution
                    </span>
                    <h4 className={`text-sm font-bold mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      AIIA Directorate & T&P
                    </h4>
                    <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      NAAC A++ & NIRF Administration
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-blue-400 dark:text-sky-400 shrink-0" />
                </div>

                <div
                  onClick={() => handleQuickLogin('industry', 'Himalaya Wellness R&D HR', 'recruiter@himalayawellness.com')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isLight
                      ? 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 hover:border-blue-400'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-white/10 hover:border-blue-500/50'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 dark:text-sky-300 border border-blue-500/30">
                      Industry
                    </span>
                    <h4 className={`text-sm font-bold mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Himalaya Wellness HR
                    </h4>
                    <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Clinical Trials & Talent Partner
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-blue-400 dark:text-sky-400 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
