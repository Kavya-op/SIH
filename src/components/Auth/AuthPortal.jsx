import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { signUpWithRole, signInUser } from '../../lib/supabase';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Building,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Layers,
  AlertCircle,
  Check
} from 'lucide-react';

export default function AuthPortal({ defaultPage = 'login' }) {
  const {
    institutions,
    setRole,
    setCurrentView,
    setCurrentUser,
    addToast,
    logAuditEvent,
    theme
  } = useApp();

  const isLight = theme === 'light';
  const [page, setPage] = useState(defaultPage); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'academia' | 'institution' | 'industry'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field validation errors and touched tracking
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Role-specific extension states
  const [studentDegree, setStudentDegree] = useState('B.Tech Computer Science & Engineering');
  const [studentInstitutionId, setStudentInstitutionId] = useState(() => institutions[0]?.id || 'inst-univ-01');
  const [studentYear, setStudentYear] = useState('Final Year (Graduation Batch)');
  const [facultySpecialization, setFacultySpecialization] = useState('Artificial Intelligence & Machine Learning');
  const [facultyDesignation, setFacultyDesignation] = useState('Associate Professor');
  const [facultyDepartment, setFacultyDepartment] = useState('Department of Computer Science & Engineering');
  const [institutionCode, setInstitutionCode] = useState('AISHE-U-1029');
  const [institutionType, setInstitutionType] = useState('Autonomous Research University');
  const [industryName, setIndustryName] = useState('Apex Technologies');
  const [industryCin, setIndustryCin] = useState('U72900KA2004PTC033228');

  // Password strength calculator (0 to 4)
  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
    return score;
  };
  const passwordStrength = getPasswordStrength(password);

  // Validate a single field
  const validateField = (name, value, currentValues = {}) => {
    const vals = {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      studentDegree,
      facultySpecialization,
      institutionCode,
      industryName,
      industryCin,
      ...currentValues,
      [name]: value
    };

    switch (name) {
      case 'fullName':
        if (!vals.fullName || !vals.fullName.trim()) return 'Full Name is required';
        if (!/^[a-zA-Z\s.]{3,60}$/.test(vals.fullName.trim())) {
          return 'Enter a valid name (minimum 3 characters, letters only)';
        }
        return '';

      case 'email':
        if (!vals.email || !vals.email.trim()) return 'Email Address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email.trim())) {
          return 'Enter a valid email address (e.g. name@domain.edu)';
        }
        return '';

      case 'phone': {
        const clean = (vals.phone || '').replace(/\D/g, '');
        if (!clean) return '10-digit Indian mobile number is required';
        if (clean.length !== 10) return 'Must be exactly 10 digits';
        if (!/^[6-9]\d{9}$/.test(clean)) return 'Indian mobile numbers must start with 6, 7, 8, or 9';
        return '';
      }

      case 'password':
        if (!vals.password) return 'Password is required';
        if (vals.password.length < 8) return 'Password must be at least 8 characters long';
        if (!/[A-Z]/.test(vals.password) || !/[a-z]/.test(vals.password)) {
          return 'Must include both uppercase and lowercase letters';
        }
        if (!/\d/.test(vals.password)) return 'Must include at least 1 number (0-9)';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(vals.password)) {
          return 'Must include at least 1 special character (!@#$%...)';
        }
        return '';

      case 'confirmPassword':
        if (!vals.confirmPassword) return 'Please confirm your password';
        if (vals.confirmPassword !== vals.password) return 'Passwords do not match';
        return '';

      case 'facultySpecialization':
        if (selectedRole === 'academia') {
          if (!vals.facultySpecialization || vals.facultySpecialization.trim().length < 3) {
            return 'Specialization is required (min 3 characters)';
          }
        }
        return '';

      case 'institutionCode':
        if (selectedRole === 'institution') {
          if (!vals.institutionCode || !vals.institutionCode.trim()) return 'AISHE Code is required';
          if (!/^[A-Za-z0-9-]+$/.test(vals.institutionCode.trim())) return 'Invalid AISHE code format (e.g. AISHE-U-1029)';
        }
        return '';

      case 'industryName':
        if (selectedRole === 'industry') {
          if (!vals.industryName || vals.industryName.trim().length < 3) return 'Company name is required (min 3 characters)';
        }
        return '';

      case 'industryCin':
        if (selectedRole === 'industry') {
          const cin = (vals.industryCin || '').trim().toUpperCase();
          if (!cin) return 'Corporate Identification Number (CIN) is required';
          if (!/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/i.test(cin)) {
            return 'Must be a 21-character MCA CIN (e.g. U72900KA2004PTC033228)';
          }
        }
        return '';

      default:
        return '';
    }
  };

  // Validate all fields at once
  const validateAllFields = () => {
    const errs = {};
    const fieldsToValidate = ['fullName', 'email', 'phone', 'password', 'confirmPassword'];

    if (selectedRole === 'student') fieldsToValidate.push('studentDegree');
    if (selectedRole === 'academia') fieldsToValidate.push('facultySpecialization');
    if (selectedRole === 'institution') fieldsToValidate.push('institutionCode');
    if (selectedRole === 'industry') {
      fieldsToValidate.push('industryName');
      fieldsToValidate.push('industryCin');
    }

    fieldsToValidate.forEach(field => {
      let val = '';
      if (field === 'fullName') val = fullName;
      else if (field === 'email') val = email;
      else if (field === 'phone') val = phone;
      else if (field === 'password') val = password;
      else if (field === 'confirmPassword') val = confirmPassword;
      else if (field === 'studentDegree') val = studentDegree;
      else if (field === 'facultySpecialization') val = facultySpecialization;
      else if (field === 'institutionCode') val = institutionCode;
      else if (field === 'industryName') val = industryName;
      else if (field === 'industryCin') val = industryCin;

      const err = validateField(field, val);
      if (err) errs[field] = err;
    });

    return errs;
  };

  // Field change and blur handlers
  const handleInputChange = (field, value) => {
    if (field === 'fullName') setFullName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') {
      setPassword(value);
      if (touched.confirmPassword && confirmPassword) {
        const confirmErr = value !== confirmPassword ? 'Passwords do not match' : '';
        setErrors(prev => ({ ...prev, confirmPassword: confirmErr }));
      }
    }
    if (field === 'confirmPassword') setConfirmPassword(value);
    if (field === 'facultySpecialization') setFacultySpecialization(value);
    if (field === 'institutionCode') setInstitutionCode(value);
    if (field === 'industryName') setIndustryName(value);
    if (field === 'industryCin') setIndustryCin(value.toUpperCase());

    if (touched[field]) {
      const err = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    if (touched.phone) {
      const err = validateField('phone', raw);
      setErrors(prev => ({ ...prev, phone: err }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'fullName') val = fullName;
    else if (field === 'email') val = email;
    else if (field === 'phone') val = phone;
    else if (field === 'password') val = password;
    else if (field === 'confirmPassword') val = confirmPassword;
    else if (field === 'studentDegree') val = studentDegree;
    else if (field === 'facultySpecialization') val = facultySpecialization;
    else if (field === 'institutionCode') val = institutionCode;
    else if (field === 'industryName') val = industryName;
    else if (field === 'industryCin') val = industryCin;

    const err = validateField(field, val);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signInUser({ email, password });
      if (res.error) {
        throw new Error(res.error);
      }

      const user = res.user;
      setCurrentUser(user);
      if (user.role) {
        setRole(user.role);
      }
      setCurrentView('dashboard');

      logAuditEvent('AUTH_SIGN_IN', user.id, `User logged in with role: ${user.role}`);
      addToast(`Welcome back, ${user.fullName || 'User'}!`, 'success');
    } catch (err) {
      addToast(err.message || 'Invalid email or password', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const touchedAll = {
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      studentDegree: true,
      facultySpecialization: true,
      institutionCode: true,
      industryName: true,
      industryCin: true
    };
    setTouched(touchedAll);

    const validationErrors = validateAllFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.values(validationErrors)[0];
      addToast(firstError || 'Please fix the highlighted errors before submitting.', 'warning');
      return;
    }

    setLoading(true);

    try {
      let roleMetadata = {};
      if (selectedRole === 'student') {
        roleMetadata = { degree: studentDegree, institution_id: studentInstitutionId, year: studentYear };
      } else if (selectedRole === 'academia') {
        roleMetadata = { specialization: facultySpecialization, department: facultyDepartment, designation: facultyDesignation, isMentorListed: true };
      } else if (selectedRole === 'institution') {
        roleMetadata = { aishe_code: institutionCode, type: institutionType };
      } else if (selectedRole === 'industry') {
        roleMetadata = { company_name: industryName, cin: industryCin.toUpperCase() };
      }

      const fullIndianPhone = `+91 ${phone.trim()}`;

      const res = await signUpWithRole({
        email,
        password,
        role: selectedRole,
        fullName,
        phone: fullIndianPhone,
        metadata: roleMetadata
      });

      if (res.error) {
        throw new Error(res.error);
      }

      const user = res.user;
      setCurrentUser(user);
      setRole(selectedRole);
      setCurrentView('dashboard');

      logAuditEvent('AUTH_REGISTER', user.id, `Created account as ${selectedRole} with phone ${fullIndianPhone}`);
      addToast(`Account created successfully! Welcome to the portal, ${user.fullName || fullName}.`, 'success');

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (_) {}
    } catch (err) {
      addToast(err.message || 'Registration failed', 'warning');
    } finally {
      setLoading(false);
    }
  };

  // Quick evaluator demo persona login using seeded database accounts
  const handleFastTrackLogin = async (demoRole) => {
    let demoEmail = 'alex.morgan@student.edu';
    if (demoRole === 'academia') demoEmail = 'sarah.jenkins@university.edu';
    if (demoRole === 'institution') demoEmail = 'dean@institute.edu';
    if (demoRole === 'industry') demoEmail = 'talent@industrylabs.com';

    try {
      const res = await signInUser({ email: demoEmail, password: 'Password123' });
      if (res.user) {
        setCurrentUser(res.user);
        setRole(res.user.role || demoRole);
        setCurrentView('dashboard');
        addToast(`Signed in as ${res.user.fullName} (${res.user.role})`, 'success');
        return;
      }
    } catch (_) {}

    // Fallback if network offline
    let mockUser = {
      id: `usr-demo-${demoRole}`,
      role: demoRole,
      fullName: 'Demo User',
      email: demoEmail,
      metadata: {}
    };

    if (demoRole === 'student') {
      mockUser.fullName = 'Alex Morgan';
    } else if (demoRole === 'academia') {
      mockUser.fullName = 'Dr. Sarah Jenkins';
    } else if (demoRole === 'institution') {
      mockUser.fullName = 'Dean Robert Taylor';
    } else if (demoRole === 'industry') {
      mockUser.fullName = 'David Chen';
    }

    setCurrentUser(mockUser);
    setRole(demoRole);
    setCurrentView('dashboard');
    localStorage.setItem('portal_active_session', JSON.stringify(mockUser));
    addToast(`Signed in as ${mockUser.fullName} (${demoRole})`, 'success');
  };

  const roleOptions = [
    {
      id: 'student',
      title: 'Student / Scholar',
      icon: GraduationCap,
      desc: 'Skill assessments, portfolio & internships'
    },
    {
      id: 'academia',
      title: 'Academia / Faculty',
      icon: BookOpen,
      desc: 'Research projects, grant RFPs & mentorship'
    },
    {
      id: 'institution',
      title: 'Institution',
      icon: Building,
      desc: 'Placement tracking & audit readiness'
    },
    {
      id: 'industry',
      title: 'Industry Partner',
      icon: Briefcase,
      desc: 'Post vacancies & evaluate talent'
    }
  ];

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 transition-colors duration-200 ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0a0a0a] text-slate-100'
      }`}
    >
      {/* Brand Header */}
      <div className="text-center mb-8 max-w-sm mx-auto flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25 mb-4">
          <Layers size={24} className="text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
          Collaboration Portal
        </h1>
        <p className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'} mb-6`}>
          Academia & Industry Collaboration Platform
        </p>

        {/* Segmented Pill Switcher between 2 pages: Sign In & Create Account */}
        <div
          className={`flex items-center p-1.5 rounded-full border w-full transition-colors ${
            isLight
              ? 'bg-slate-200/80 border-slate-300/80'
              : 'bg-slate-800 border-slate-700'
          }`}
        >
          <button
            type="button"
            onClick={() => setPage('login')}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
              page === 'login'
                ? isLight
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'bg-slate-900 text-sky-400 shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setPage('register')}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
              page === 'register'
                ? isLight
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'bg-slate-900 text-sky-400 shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div
        className={`w-full max-w-lg rounded-3xl p-8 sm:p-12 border shadow-xl backdrop-blur-sm transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-slate-200/60'
            : 'bg-[#111827] border-white/10 shadow-2xl'
        }`}
      >
        {/* ========================================================================= */}
        {/* PAGE 1: SIGN IN (LOGIN)                                                   */}
        {/* ========================================================================= */}
        {page === 'login' ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
                Welcome Back
              </h2>
              <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
              {/* Email Field */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@institution.edu or name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2.85rem' }}
                    className={`w-full pr-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => addToast('Password reset link sent to registered email', 'info')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '2.85rem', paddingRight: '2.85rem' }}
                    className={`w-full py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer flex items-center justify-center p-1.5 z-10"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-full font-bold text-sm bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Create Account */}
            <div className={`text-center mt-7 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setPage('register')}
                className="font-bold text-blue-600 hover:text-blue-500 cursor-pointer ml-1"
              >
                Create Account
              </button>
            </div>

            {/* Minimalist 1-Click Test Personas for Evaluators */}
            <div className={`mt-9 pt-7 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="text-center text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-3.5">
                Quick Test Access (1-Click)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { key: 'student', label: 'Student' },
                  { key: 'academia', label: 'Faculty' },
                  { key: 'institution', label: 'Institution' },
                  { key: 'industry', label: 'Industry' }
                ].map((persona) => (
                  <button
                    key={persona.key}
                    type="button"
                    onClick={() => handleFastTrackLogin(persona.key)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center truncate ${
                      isLight
                        ? 'bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 border-slate-200'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {persona.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* PAGE 2: CREATE ACCOUNT                                                    */
          /* ========================================================================= */
          <div>
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
                Create an Account
              </h2>
              <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Select your role and enter your details
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-6">
              {/* Mandatory Role Selection */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Select Your Role *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedRole === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setSelectedRole(opt.id)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? isLight
                              ? 'bg-blue-50/80 border-blue-600 shadow-sm'
                              : 'bg-blue-950/50 border-blue-500 shadow-sm'
                            : isLight
                            ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon
                            size={20}
                            className={isSelected ? (isLight ? 'text-blue-600' : 'text-sky-400') : 'text-slate-400'}
                          />
                          {isSelected && (
                            <CheckCircle2 size={16} className={isLight ? 'text-blue-600' : 'text-sky-400'} />
                          )}
                        </div>
                        <div>
                          <div className={`text-xs font-bold leading-tight ${
                            isSelected
                              ? isLight ? 'text-blue-900' : 'text-white'
                              : isLight ? 'text-slate-800' : 'text-slate-200'
                          }`}>
                            {opt.title}
                          </div>
                          <div className={`text-[10px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {opt.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Full Legal Name *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra or Dr. Ananya Sharma"
                    value={fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    style={{ paddingLeft: '2.85rem' }}
                    className={`w-full pr-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.fullName && touched.fullName
                        ? 'border-red-500 bg-red-50/20 text-red-900 dark:text-red-200 focus:ring-red-400'
                        : touched.fullName && fullName.trim().length >= 3
                        ? 'border-emerald-500 bg-emerald-50/10 focus:ring-emerald-400'
                        : isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-blue-500'
                        : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:ring-blue-500'
                    }`}
                  />
                  {touched.fullName && fullName.trim().length >= 3 && !errors.fullName && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500">
                      <Check size={16} />
                    </div>
                  )}
                </div>
                {errors.fullName && touched.fullName && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{errors.fullName}</span>
                  </div>
                )}
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Email Address *
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.edu or name@company.in"
                      value={email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      style={{ paddingLeft: '2.85rem' }}
                      className={`w-full pr-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.email && touched.email
                          ? 'border-red-500 bg-red-50/20 text-red-900 dark:text-red-200 focus:ring-red-400'
                          : touched.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
                          ? 'border-emerald-500 bg-emerald-50/10 focus:ring-emerald-400'
                          : isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-blue-500'
                          : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:ring-blue-500'
                      }`}
                    />
                    {touched.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && !errors.email && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                  {errors.email && touched.email && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Indian Mobile Number (+91) */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Mobile Number (India) *
                  </label>
                  <div className="relative flex items-center">
                    {/* Fixed Indian Country Code (+91) Badge */}
                    <div
                      className={`flex items-center gap-1.5 px-3.5 py-3.5 rounded-l-xl border border-r-0 font-bold text-xs select-none transition-colors ${
                        errors.phone && touched.phone
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
                      value={phone}
                      onChange={handlePhoneChange}
                      onBlur={() => handleBlur('phone')}
                      className={`w-full pr-8 py-3.5 rounded-r-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.phone && touched.phone
                          ? 'border-red-500 bg-red-50/20 text-red-900 dark:text-red-200 focus:ring-red-400'
                          : touched.phone && /^[6-9]\d{9}$/.test(phone)
                          ? 'border-emerald-500 bg-emerald-50/10 focus:ring-emerald-400'
                          : isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-blue-500'
                          : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:ring-blue-500'
                      }`}
                    />
                    {touched.phone && /^[6-9]\d{9}$/.test(phone) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                        <Check size={16} />
                      </div>
                    )}
                  </div>

                  {/* Inline Indian Mobile Validation Feedback */}
                  {errors.phone && touched.phone ? (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{errors.phone}</span>
                    </div>
                  ) : touched.phone && /^[6-9]\d{9}$/.test(phone) ? (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <Check size={13} className="shrink-0" />
                      <span>Valid Indian Mobile Number (+91 {phone})</span>
                    </div>
                  ) : (
                    <p className={`text-[11px] mt-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      10-digit number starting with 6, 7, 8, or 9
                    </p>
                  )}
                </div>
              </div>

              {/* Password & Confirm Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password Field */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Password *
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 8 chars, uppercase, number & symbol"
                      value={password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      style={{ paddingLeft: '2.85rem', paddingRight: '2.85rem' }}
                      className={`w-full py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.password && touched.password
                          ? 'border-red-500 bg-red-50/20 text-red-900 dark:text-red-200 focus:ring-red-400'
                          : isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-blue-500'
                          : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:ring-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer flex items-center justify-center p-1.5 z-10"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Strength:</span>
                        <span className={
                          passwordStrength <= 1 ? 'text-red-600 dark:text-red-400' :
                          passwordStrength <= 3 ? 'text-amber-600 dark:text-amber-400' :
                          'text-emerald-600 dark:text-emerald-400'
                        }>
                          {passwordStrength <= 1 ? 'Weak' : passwordStrength <= 3 ? 'Moderate' : 'Strong (Secure)'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex gap-0.5">
                        <div className={`h-full flex-1 transition-all ${passwordStrength >= 1 ? (passwordStrength === 1 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 transition-all ${passwordStrength >= 2 ? (passwordStrength <= 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 transition-all ${passwordStrength >= 3 ? (passwordStrength <= 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 transition-all ${passwordStrength >= 4 ? 'bg-emerald-500' : 'bg-transparent'}`} />
                      </div>
                    </div>
                  )}

                  {errors.password && touched.password && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Confirm Password *
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      style={{ paddingLeft: '2.85rem', paddingRight: '2.85rem' }}
                      className={`w-full py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.confirmPassword && touched.confirmPassword
                          ? 'border-red-500 bg-red-50/20 text-red-900 dark:text-red-200 focus:ring-red-400'
                          : touched.confirmPassword && confirmPassword && confirmPassword === password
                          ? 'border-emerald-500 bg-emerald-50/10 focus:ring-emerald-400'
                          : isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-blue-500'
                          : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:ring-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer flex items-center justify-center p-1.5 z-10"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.confirmPassword && touched.confirmPassword ? (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  ) : touched.confirmPassword && confirmPassword && confirmPassword === password ? (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <Check size={13} className="shrink-0" />
                      <span>Passwords match</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Role-Specific Extension Fields */}
              {selectedRole === 'student' && (
                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        Degree / Branch *
                      </label>
                      <select
                        value={studentDegree}
                        onChange={(e) => handleInputChange('studentDegree', e.target.value)}
                        className={`w-full px-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                          isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                            : 'bg-slate-800 border-slate-700 text-white'
                        }`}
                      >
                        <optgroup label="💻 B.Tech Engineering">
                          <option value="B.Tech Computer Science & Engineering">B.Tech Computer Science & Engineering</option>
                          <option value="B.Tech Artificial Intelligence & Machine Learning">B.Tech Artificial Intelligence & Machine Learning</option>
                          <option value="B.Tech Mechanical Engineering & Robotics">B.Tech Mechanical Engineering & Robotics</option>
                          <option value="B.Tech Electronics & Communication">B.Tech Electronics & Communication</option>
                          <option value="B.Tech Electrical Engineering">B.Tech Electrical Engineering</option>
                          <option value="B.Tech Civil Engineering">B.Tech Civil Engineering</option>
                        </optgroup>
                        <optgroup label="📊 Commerce & Finance">
                          <option value="B.Com (Honours) - Accounting & FinTech">B.Com (Honours) - Accounting & FinTech</option>
                          <option value="BBA - Business Analytics & Financial Markets">BBA - Business Analytics & Financial Markets</option>
                          <option value="B.Sc. Quantitative Finance & Economics">B.Sc. Quantitative Finance & Economics</option>
                        </optgroup>
                        <optgroup label="🩺 Healthcare & Pharmacology">
                          <option value="Bachelor of Ayurvedic Medicine & Surgery (BAMS)">Bachelor of Ayurvedic Medicine & Surgery (BAMS)</option>
                          <option value="B.Pharm - Pharmacology & Drug Development">B.Pharm - Pharmacology & Drug Development</option>
                          <option value="B.Sc. Biomedical Sciences & Computational Biology">B.Sc. Biomedical Sciences & Computational Biology</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        Institution / University *
                      </label>
                      <select
                        value={studentInstitutionId}
                        onChange={(e) => setStudentInstitutionId(e.target.value)}
                        className={`w-full px-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
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
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Current Year of Study *
                    </label>
                    <select
                      value={studentYear}
                      onChange={(e) => setStudentYear(e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                          : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    >
                      <option value="1st Year">1st Year (Freshman Batch)</option>
                      <option value="2nd Year">2nd Year (Sophomore Batch)</option>
                      <option value="3rd Year">3rd Year (Pre-Final Batch)</option>
                      <option value="Final Year (Graduation Batch)">Final Year (Graduation Batch 2026)</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedRole === 'academia' && (
                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Academic Specialization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Distributed Artificial Intelligence or Quantitative Risk"
                      value={facultySpecialization}
                      onChange={(e) => handleInputChange('facultySpecialization', e.target.value)}
                      onBlur={() => handleBlur('facultySpecialization')}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.facultySpecialization && touched.facultySpecialization
                          ? 'border-red-500 bg-red-50/20 text-red-900 dark:text-red-200 focus:ring-red-400'
                          : isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:ring-blue-500'
                          : 'bg-slate-800 border-slate-700 text-white focus:bg-slate-800 focus:ring-blue-500'
                      }`}
                    />
                    {errors.facultySpecialization && touched.facultySpecialization && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{errors.facultySpecialization}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        Designation
                      </label>
                      <select
                        value={facultyDesignation}
                        onChange={(e) => setFacultyDesignation(e.target.value)}
                        className={`w-full px-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                          isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                        }`}
                      >
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Professor & Dean">Professor & Dean</option>
                        <option value="Principal Scientist / PI">Principal Scientist / PI</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        Department
                      </label>
                      <input
                        type="text"
                        value={facultyDepartment}
                        onChange={(e) => setFacultyDepartment(e.target.value)}
                        placeholder="e.g. Dept of Computer Science & AI"
                        className={`w-full px-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'institution' && (
                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Institutional AISHE Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AISHE-U-1029"
                      value={institutionCode}
                      onChange={(e) => handleInputChange('institutionCode', e.target.value)}
                      onBlur={() => handleBlur('institutionCode')}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.institutionCode && touched.institutionCode
                          ? 'border-red-500 bg-red-50/20 text-red-900 dark:text-red-200 focus:ring-red-400'
                          : isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:ring-blue-500'
                          : 'bg-slate-800 border-slate-700 text-white focus:bg-slate-800 focus:ring-blue-500'
                      }`}
                    />
                    {errors.institutionCode && touched.institutionCode ? (
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{errors.institutionCode}</span>
                      </div>
                    ) : (
                      <p className={`text-[11px] mt-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        All India Survey on Higher Education (AISHE) code for official accreditation
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Institution Category
                    </label>
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    >
                      <option value="Institute of National Importance (INI)">Institute of National Importance (INI)</option>
                      <option value="Autonomous Research University">Autonomous Research University</option>
                      <option value="Tier-1 NAAC A++ Deemed University">Tier-1 NAAC A++ Deemed University</option>
                      <option value="Central Premier University">Central Premier University</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedRole === 'industry' && (
                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google India R&D or Tata Motors"
                      value={industryName}
                      onChange={(e) => handleInputChange('industryName', e.target.value)}
                      onBlur={() => handleBlur('industryName')}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.industryName && touched.industryName
                          ? 'border-red-500 bg-red-50/20 text-red-900 dark:text-red-200 focus:ring-red-400'
                          : isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:ring-blue-500'
                          : 'bg-slate-800 border-slate-700 text-white focus:bg-slate-800 focus:ring-blue-500'
                      }`}
                    />
                    {errors.industryName && touched.industryName && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{errors.industryName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Corporate Identification Number (CIN) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={21}
                      placeholder="e.g. U72900KA2004PTC033228"
                      value={industryCin}
                      onChange={(e) => handleInputChange('industryCin', e.target.value)}
                      onBlur={() => handleBlur('industryCin')}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none focus:ring-2 ${
                        errors.industryCin && touched.industryCin
                          ? 'border-red-500 bg-red-50/20 text-red-900 dark:text-red-200 focus:ring-red-400'
                          : touched.industryCin && /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/i.test(industryCin)
                          ? 'border-emerald-500 bg-emerald-50/10 focus:ring-emerald-400'
                          : isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:ring-blue-500'
                          : 'bg-slate-800 border-slate-700 text-white focus:bg-slate-800 focus:ring-blue-500'
                      }`}
                    />
                    {errors.industryCin && touched.industryCin ? (
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{errors.industryCin}</span>
                      </div>
                    ) : (
                      <p className={`text-[11px] mt-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        21-character MCA registered CIN (e.g. U72900KA2004PTC033228)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-full font-bold text-sm bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Creating Indian Citizen Account...</span>
                ) : (
                  <>
                    <span>Create Account (India Portal)</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Sign In */}
            <div className={`text-center mt-7 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setPage('login')}
                className="font-bold text-blue-600 hover:text-blue-500 cursor-pointer ml-1"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ultra-Minimalist Clean Footer */}
      <div className={`mt-8 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
        © 2026 Collaboration Portal. All rights reserved.
      </div>
    </div>
  );
}
