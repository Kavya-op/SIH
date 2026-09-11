import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Building,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage({ onOpenAuth, onExploreRole }) {
  const { theme } = useApp();
  const isLight = theme === 'light';

  const roleCards = [
    {
      id: 'student',
      title: 'Student / Scholar',
      roleKey: 'student',
      icon: GraduationCap,
      badge: 'Skill Gap & Placement',
      color: '#2563eb',
      description:
        'Perform diagnostic skill assessments, generate an encrypted cryptographic portfolio, and match with verified industrial internships using Vector Cosine AI.',
      features: [
        'Interactive Skill Heatmap & Radar diagnostic',
        'Digital Portfolio with verified resume upload',
        'Real-time ATS internship & job tracker'
      ]
    },
    {
      id: 'academia',
      title: 'Academia / Faculty',
      roleKey: 'academia',
      icon: BookOpen,
      badge: 'R&D & Mentorship',
      color: '#0284c7',
      description:
        'Bridge classroom scholarship with industrial R&D sabbaticals, submit sponsored research grant proposals, and list yourself as an industrial mentor.',
      features: [
        'Faculty research interests & specialization tags',
        'Live sponsored R&D projects & study tracker',
        'Registered industrial training mentor network'
      ]
    },
    {
      id: 'institution',
      title: 'Institution / Directorate',
      roleKey: 'institution',
      icon: Building,
      badge: 'NIRF & NAAC Audit',
      color: '#059669',
      description:
        'Streamline institutional accreditation reporting with materialized placement funnel views, department curriculum deficit heatmaps, and 1-click audit exports.',
      features: [
        'University-wide placement & stipend analytics',
        'NAAC A++ & NIRF criteria compliance export',
        'Department-level skill readiness metrics'
      ]
    },
    {
      id: 'industry',
      title: 'Industry / Recruiter',
      roleKey: 'industry',
      icon: Briefcase,
      badge: 'Verified Hiring',
      color: '#4f46e5',
      description:
        'Connect directly with top Ayurvedic & biotechnology institutions, publish vacancy opportunities, and evaluate candidates via weighted vector skill match.',
      features: [
        'Corporate profile with CIN/GSTIN verification',
        'Internship & job opportunity publishing wizard',
        'Cosine skill matching engine with gap analysis'
      ]
    }
  ];

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 selection:bg-blue-600 selection:text-white ${
        isLight ? 'bg-white text-slate-900' : 'bg-[#0a0a0a] text-slate-100'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (CENTER-ALIGNED, SPACIOUS & MINIMALIST LIGHT DESIGN)      */}
      {/* ========================================================================= */}
      <section
        className={`relative overflow-hidden py-28 sm:py-36 md:py-44 border-b transition-colors ${
          isLight ? 'border-slate-200/80 bg-gradient-to-b from-slate-50/80 via-white to-white' : 'border-white/10 bg-[#0a0a0a]'
        }`}
      >
        {/* Soft, Minimalist Ambient Glows */}
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none -z-10 ${
            isLight ? 'bg-blue-100/60' : 'bg-blue-500/10'
          }`}
        />
        <div
          className={`absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none -z-10 ${
            isLight ? 'bg-emerald-100/40' : 'bg-emerald-500/10'
          }`}
        />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center justify-center text-center">
          {/* Top Centered Pill / Badge */}
          <div className="flex items-center justify-center mx-auto mb-10">
            <div
              className={`inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-md transition-all text-center ${
                isLight
                  ? 'bg-blue-50/90 border border-blue-200 text-blue-700'
                  : 'bg-blue-500/15 border border-blue-500/30 text-sky-300 shadow-blue-500/10'
              }`}
            >
              <Sparkles size={16} className={isLight ? 'text-blue-600 shrink-0' : 'text-sky-400 shrink-0'} />
              <span>Smart India Hackathon 2026 • Problem ID 26044</span>
              <span className="opacity-40">•</span>
              <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>
                Ministry of Ayush & AIIA
              </span>
            </div>
          </div>

          {/* Main Hero Headline - Perfectly Centered, High Contrast */}
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.12] sm:leading-[1.12] max-w-5xl mx-auto text-center mb-10 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Bridging{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600">
              Academia & Industry
            </span>{' '}
            in Ayush & BioTech Sciences
          </h1>

          {/* Subheading - Center-Aligned with Generous Breathing Room */}
          <p
            className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed sm:leading-loose font-normal text-center mb-14 ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            A unified smart platform connecting{' '}
            <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold'}>
              Students
            </strong>
            ,{' '}
            <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold'}>
              Academic Faculty
            </strong>
            ,{' '}
            <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold'}>
              Institutions
            </strong>
            , and{' '}
            <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold'}>
              Industry Leaders
            </strong>{' '}
            through AI-powered skill mapping, verifiable digital portfolios, and collaborative R&D.
          </p>

          {/* Pill-Shaped Action Buttons - Centered */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 mx-auto w-full max-w-md sm:max-w-none mb-18">
            <button
              id="landing-create-account-btn"
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-10 py-4.5 rounded-full font-extrabold text-base bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-100 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Create Account (Select Role)</span>
              <ArrowRight size={18} />
            </button>

            <button
              id="landing-login-btn"
              onClick={() => onOpenAuth('login')}
              className={`w-full sm:w-auto px-10 py-4.5 rounded-full font-bold text-base transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-sm hover:scale-105 active:scale-100 ${
                isLight
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/90 hover:border-blue-500 shadow-slate-200'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-blue-400 backdrop-blur-xl'
              }`}
            >
              <span>Sign In to Your Portal</span>
            </button>
          </div>

          {/* Platform Credibility Badges - Center-Aligned & Spacious */}
          <div
            className={`pt-12 border-t flex flex-wrap items-center justify-center gap-8 md:gap-12 text-xs sm:text-sm font-medium text-center mx-auto ${
              isLight ? 'border-slate-200/80 text-slate-600' : 'border-white/10 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-center gap-2.5">
              <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
              <span>PostgreSQL 15+ Relational Architecture</span>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
              <span>Vector Cosine Match Engine (TRD §5)</span>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
              <span>Supabase RBAC Authentication Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TAILORED STAKEHOLDER PROFILES (ALL TEXT CENTER-ALIGNED)               */}
      {/* ========================================================================= */}
      <section
        className={`py-28 md:py-36 relative transition-colors ${
          isLight ? 'bg-slate-50/70 border-b border-slate-200/70' : 'bg-[#0a0a0a]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header - Perfectly Centered */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full border inline-block mb-6 ${
                isLight
                  ? 'bg-blue-100/80 text-blue-700 border-blue-200'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }`}
            >
              Role-Based Architecture
            </span>
            <h2
              className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Tailored Profiles for Every Ecosystem Stakeholder
            </h2>
            <p
              className={`text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Select your role when signing up to automatically enter your custom-built operational workspace.
            </p>
          </div>

          {/* Grid of 4 Roles: Completely Center-Aligned Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
            {roleCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className={`group relative rounded-3xl p-8 sm:p-10 transition-all duration-300 flex flex-col items-center text-center justify-between border hover:-translate-y-2 ${
                    isLight
                      ? 'bg-white border-slate-200/90 hover:border-blue-500 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.12)]'
                      : 'bg-slate-900/50 backdrop-blur-xl border-white/10 hover:border-blue-500/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20'
                  }`}
                >
                  <div className="flex flex-col items-center text-center w-full">
                    {/* Centered Icon in Squircle */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md mb-6 transition-transform group-hover:scale-105"
                      style={{
                        background: isLight ? `${card.color}15` : `linear-gradient(135deg, ${card.color}20, ${card.color}40)`,
                        border: `1.5px solid ${card.color}40`,
                        color: card.color
                      }}
                    >
                      <Icon size={30} />
                    </div>

                    {/* Centered Category Badge */}
                    <span
                      className={`text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full border mb-4 ${
                        isLight
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {card.badge}
                    </span>

                    {/* Centered Card Title */}
                    <h3
                      className={`text-2xl font-black mb-4 leading-tight ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {card.title}
                    </h3>

                    {/* Centered Card Description with Increased Line Height */}
                    <p
                      className={`text-sm leading-relaxed mb-8 font-normal max-w-xs mx-auto ${
                        isLight ? 'text-slate-600' : 'text-slate-300'
                      }`}
                    >
                      {card.description}
                    </p>

                    {/* Centered Feature Bullets with Generous Line-Gaps */}
                    <div
                      className={`w-full pt-6 border-t space-y-3.5 flex flex-col items-center text-center ${
                        isLight ? 'border-slate-100' : 'border-white/10'
                      }`}
                    >
                      {card.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-center gap-2 text-xs font-medium text-center leading-relaxed ${
                            isLight ? 'text-slate-700' : 'text-slate-300'
                          }`}
                        >
                          <CheckCircle2
                            size={15}
                            className="text-blue-600 shrink-0"
                          />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Centered Action Button */}
                  <button
                    onClick={() => {
                      if (onExploreRole) {
                        onExploreRole(card.roleKey);
                      } else {
                        onOpenAuth('register');
                      }
                    }}
                    className={`mt-10 w-full max-w-xs mx-auto py-3.5 px-6 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                      isLight
                        ? 'bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border-blue-200 hover:border-blue-600 shadow-sm'
                        : 'bg-white/5 hover:bg-blue-600 text-sky-400 hover:text-white border-blue-500/20 hover:border-blue-500 shadow-md'
                    }`}
                  >
                    <span>Launch {card.title.split('/')[0]} View</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PLATFORM METRICS (OVERSIZED STATS, CENTER-ALIGNED & SPACIOUS)          */}
      {/* ========================================================================= */}
      <section
        className={`py-28 md:py-36 border-b transition-colors ${
          isLight
            ? 'border-slate-200/80 bg-white'
            : 'border-white/10 bg-[#0a0a0a]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full border inline-block mb-6 ${
                isLight
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              Verified Impact Metrics
            </span>
            <h2
              className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Quantifiable Impact Across Academia & Industry
            </h2>
            <p
              className={`text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Empowering real-time tracking from individual scholar skills to national institutional accreditation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-center">
            {/* Metric 1 */}
            <div
              className={`p-10 rounded-3xl border transition-all flex flex-col items-center justify-center text-center ${
                isLight
                  ? 'bg-slate-50/70 border-slate-200/90 shadow-sm hover:shadow-md hover:bg-white'
                  : 'bg-slate-900/50 backdrop-blur-xl border-white/10 hover:border-blue-500/50 shadow-lg'
              }`}
            >
              <div className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 leading-tight mb-3">
                1,280+
              </div>
              <div
                className={`text-base font-bold mb-1.5 ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                Assessed Student Scholars
              </div>
              <div
                className={`text-xs ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                AIIA & Ayush Institutions
              </div>
            </div>

            {/* Metric 2 */}
            <div
              className={`p-10 rounded-3xl border transition-all flex flex-col items-center justify-center text-center ${
                isLight
                  ? 'bg-slate-50/70 border-slate-200/90 shadow-sm hover:shadow-md hover:bg-white'
                  : 'bg-slate-900/50 backdrop-blur-xl border-white/10 hover:border-blue-500/50 shadow-lg'
              }`}
            >
              <div className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 leading-tight mb-3">
                94.2%
              </div>
              <div
                className={`text-base font-bold mb-1.5 ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                Vector Cosine Match Accuracy
              </div>
              <div
                className={`text-xs ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Weighted Skill-Vector Math
              </div>
            </div>

            {/* Metric 3 */}
            <div
              className={`p-10 rounded-3xl border transition-all flex flex-col items-center justify-center text-center ${
                isLight
                  ? 'bg-slate-50/70 border-slate-200/90 shadow-sm hover:shadow-md hover:bg-white'
                  : 'bg-slate-900/50 backdrop-blur-xl border-white/10 hover:border-blue-500/50 shadow-lg'
              }`}
            >
              <div className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 leading-tight mb-3">
                18+
              </div>
              <div
                className={`text-base font-bold mb-1.5 ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                Verified Industry Partners
              </div>
              <div
                className={`text-xs ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Himalaya, Dabur, Zandu, Charak
              </div>
            </div>

            {/* Metric 4 */}
            <div
              className={`p-10 rounded-3xl border transition-all flex flex-col items-center justify-center text-center ${
                isLight
                  ? 'bg-slate-50/70 border-slate-200/90 shadow-sm hover:shadow-md hover:bg-white'
                  : 'bg-slate-900/50 backdrop-blur-xl border-white/10 hover:border-blue-500/50 shadow-lg'
              }`}
            >
              <div className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 leading-tight mb-3">
                ₹1.85 Cr
              </div>
              <div
                className={`text-base font-bold mb-1.5 ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                Facilitated Research Grants
              </div>
              <div
                className={`text-xs ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Faculty Sabbaticals & FDPs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BOTTOM CTA BANNER (LARGE SWEEPING SPACING & CENTERED PILL BUTTONS)     */}
      {/* ========================================================================= */}
      <section
        className={`py-28 md:py-36 relative overflow-hidden transition-colors ${
          isLight
            ? 'bg-slate-50/60'
            : 'bg-[#0a0a0a]'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div
            className={`p-12 sm:p-18 md:p-20 rounded-3xl shadow-2xl relative border flex flex-col items-center justify-center text-center ${
              isLight
                ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-blue-800 text-white'
                : 'bg-slate-900/60 backdrop-blur-2xl border-blue-500/30 text-white'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight max-w-3xl mx-auto mb-6 text-center">
              Ready to Accelerate India's Ayush & BioTech Future?
            </h2>
            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed sm:leading-loose text-center mb-10">
              Join thousands of scholars, educators, institutions, and industrial laboratories on the official collaborative portal.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 mx-auto">
              <button
                onClick={() => onOpenAuth('register')}
                className="px-10 py-4.5 rounded-full font-bold text-sm sm:text-base bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                <span>Create Your Account</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="px-10 py-4.5 rounded-full font-semibold text-sm sm:text-base bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
              >
                <span>Sign In to Existing Profile</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
