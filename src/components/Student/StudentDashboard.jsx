import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import RadarChart from './RadarChart';
import DigitalPortfolio from './DigitalPortfolio';
import SkillAssessmentModal from './SkillAssessmentModal';
import {
  Sparkles,
  Briefcase,
  PieChart,
  FileCheck2,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  IndianRupee,
  Calendar,
  ExternalLink,
  ChevronRight,
  Search,
  BookOpen,
  ArrowUpRight,
  Sliders,
  Star,
  History
} from 'lucide-react';

export default function StudentDashboard() {
  const {
    studentProfile,
    internships,
    applications,
    benchmarks,
    skillCourses,
    calculateCosineMatch,
    applyToOpportunity,
    matchThreshold,
    setMatchThreshold,
    studentPersonas,
    switchStudentPersona,
    theme
  } = useApp();

  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState('opportunities');
  const [filterDiscipline, setFilterDiscipline] = useState('all'); // 'all' | 'engineering' | 'commerce' | 'healthcare'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'internship' | 'job' | 'training'
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'hybrid' | 'onsite' | 'remote'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [selectedOppForFit, setSelectedOppForFit] = useState(null);
  const [selectedAppHistory, setSelectedAppHistory] = useState(null);

  // Compute opportunities with vector cosine similarity scores
  const opportunitiesWithScore = (internships || []).map(opp => {
    const match = calculateCosineMatch(studentProfile?.skills || {}, opp.requiredSkills || {});
    const hasApplied = (applications || []).some(a => a.opportunity_id === opp.id && a.student_id === studentProfile?.id);
    return {
      ...opp,
      matchScore: match.score,
      cosineSim: match.cosineSim,
      matchedSkills: match.matchedSkills,
      gapSkills: match.gapSkills,
      hasApplied
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  // Filter based on configurable threshold (TRD Section 5), discipline, and search
  const filteredOpps = opportunitiesWithScore.filter(opp => {
    if (opp.matchScore < matchThreshold) return false;
    if (filterDiscipline !== 'all' && opp.discipline && opp.discipline !== filterDiscipline) return false;
    if (filterType !== 'all' && opp.type !== filterType) return false;
    if (filterMode !== 'all' && opp.mode !== filterMode) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchCompany = opp.company.toLowerCase().includes(q);
      const matchCategory = opp.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchCategory) return false;
    }
    return true;
  });

  return (
    <div className="container" style={{ padding: '24px 24px 60px 24px' }}>
      {/* Student Welcome & Readiness Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        marginBottom: '24px',
        background: isLight
          ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 60%, #e0e7ff 100%)'
          : 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(14, 165, 233, 0.08) 50%, rgba(10, 16, 30, 0.85) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={studentProfile.avatar}
            alt={studentProfile.name}
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '16px',
              border: '2px solid #2563eb',
              objectFit: 'cover',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.45rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                Welcome back, {studentProfile.name}
              </h2>
              <span className="badge badge-sky">Verified Scholar</span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: isLight ? '#475569' : 'var(--text-secondary)', fontSize: '0.88rem' }}>
              {studentProfile.degree} • {studentProfile.institution}
            </p>

            {/* Quick Demo Persona Switcher */}
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : 'var(--text-muted)', fontWeight: 600 }}>Switch Branch:</span>
              {[
                { key: 'aditya_cs', label: '💻 B.Tech CS (IIT Delhi)' },
                { key: 'rhea_commerce', label: '📊 B.Com Finance (SRCC)' },
                { key: 'karan_mech', label: '⚙️ B.Tech Mech (BITS)' },
                { key: 'aarav_health', label: '🩺 Healthcare (AIIA)' }
              ].map(p => {
                const isSelected = studentProfile.id === studentPersonas?.[p.key]?.id;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => switchStudentPersona(p.key)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? '1.5px solid #2563eb' : (isLight ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)'),
                      background: isSelected ? (isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.25)') : (isLight ? '#ffffff' : 'rgba(255,255,255,0.05)'),
                      color: isSelected ? '#2563eb' : (isLight ? '#334155' : '#cbd5e1')
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Institutional Readiness */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.6)',
            padding: '12px 22px',
            borderRadius: '9999px',
            border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.35)',
            boxShadow: isLight ? '0 2px 8px rgba(37, 99, 235, 0.08)' : 'none'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: isLight ? '#475569' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Institutional Readiness
              </div>
              <div className={`text-3xl sm:text-4xl font-black bg-clip-text text-transparent ${isLight ? 'bg-gradient-to-r from-blue-600 to-emerald-600' : 'bg-gradient-to-r from-blue-400 to-emerald-400'} leading-tight`}>
                {studentProfile.readinessIndex}%
              </div>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'conic-gradient(#2563eb ' + studentProfile.readinessIndex + '%, ' + (isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)') + ' 0%)', padding: '4px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: isLight ? '#ffffff' : '#0a0a0a' }}></div>
            </div>
          </div>

          <button
            onClick={() => setIsAssessmentOpen(true)}
            className="btn btn-primary rounded-full px-6 py-3 font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 transition-all cursor-pointer"
            style={{ borderRadius: '9999px', padding: '12px 24px', gap: '8px' }}
          >
            <Sparkles size={16} />
            Diagnostic Skill Test
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          <Briefcase size={18} />
          Matched Opportunities ({filteredOpps.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
          onClick={() => setActiveTab('radar')}
        >
          <PieChart size={18} />
          Skill Proficiency Heatmap & Roadmap
        </button>

        <button
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <FileCheck2 size={18} />
          Applied Internships & Jobs Tracker ({(applications || []).filter(a => a.student_id === studentProfile?.id).length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          <UserCheck size={18} />
          Digital Portfolio & Resume Upload
        </button>
      </div>

      {/* TAB 1: Matched Opportunities with TRD Section 5 Cosine Scoring & Configurable Threshold */}
      {activeTab === 'opportunities' && (
        <div>
          {/* Controls Bar: Search, Filters & TRD Threshold Slider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '16px',
            background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.02)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
            boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: isLight ? '#64748b' : 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search clinical trials, HPLC, company..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  background: isLight ? '#f8fafc' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Opportunity Discipline, Type & Mode Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <select
                value={filterDiscipline}
                onChange={e => setFilterDiscipline(e.target.value)}
                style={{
                  background: isLight ? '#f8fafc' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1.5px solid #3b82f6' : '1.5px solid #38bdf8',
                  color: isLight ? '#0f172a' : '#fff',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <option value="all">🌐 All Disciplines</option>
                <option value="engineering">💻 B.Tech Engineering & AI</option>
                <option value="commerce">📊 Commerce & Management</option>
                <option value="healthcare">🩺 Healthcare & Life Sciences</option>
              </select>

              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                style={{
                  background: isLight ? '#f8fafc' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem'
                }}
              >
                <option value="all">All Types</option>
                <option value="internship">Internships</option>
                <option value="job">Placements (Jobs)</option>
                <option value="training">Training Programs</option>
              </select>

              <select
                value={filterMode}
                onChange={e => setFilterMode(e.target.value)}
                style={{
                  background: isLight ? '#f8fafc' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem'
                }}
              >
                <option value="all">All Modes</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-Site</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            {/* TRD Section 5: Configurable Cosine Match Threshold Slider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: isLight ? '#f1f5f9' : 'rgba(0,0,0,0.4)',
              padding: '6px 14px',
              borderRadius: '8px',
              border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)'
            }}>
              <Sliders size={15} color="#2563eb" />
              <span style={{ fontSize: '0.78rem', color: isLight ? '#334155' : 'var(--text-secondary)' }}>
                Min Match: <strong style={{ color: '#2563eb' }}>{matchThreshold}%</strong>
              </span>
              <input
                type="range"
                min="40"
                max="90"
                step="5"
                value={matchThreshold}
                onChange={e => setMatchThreshold(Number(e.target.value))}
                style={{ width: '80px', accentColor: '#2563eb', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredOpps.map(opp => {
              const scoreColor = opp.matchScore >= 80 ? '#38bdf8' : opp.matchScore >= 65 ? '#60a5fa' : '#93c5fd';
              return (
                <div
                  key={opp.id}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Top Row: Logo, Company, Vector Cosine Match Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.8rem' }}>{opp.companyLogo}</span>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isLight ? '#0f172a' : '#f8fafc' }}>
                            {opp.company}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
                            {opp.location}
                          </div>
                        </div>
                      </div>

                      {/* Cosine Score Badge */}
                      <div style={{
                        background: isLight ? '#eff6ff' : 'rgba(0, 0, 0, 0.4)',
                        border: `1.5px solid ${isLight ? '#2563eb' : scoreColor}`,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Sparkles size={13} color={isLight ? '#2563eb' : scoreColor} />
                        <span style={{ color: isLight ? '#1d4ed8' : scoreColor, fontWeight: 800, fontSize: '0.85rem' }}>
                          {opp.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    {/* Role Title & Mode Badges */}
                    <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                      {opp.title}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      <span className="badge badge-teal">{opp.type.toUpperCase()}</span>
                      <span className="badge badge-blue">{opp.mode.toUpperCase()}</span>
                      <span style={{
                        fontSize: '0.78rem',
                        color: isLight ? '#0f172a' : '#cbd5e1',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginLeft: '4px'
                      }}>
                        <IndianRupee size={12} /> {opp.stipend_formatted}
                      </span>
                      <span style={{
                        fontSize: '0.78rem',
                        color: isLight ? '#64748b' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={12} /> {opp.duration_weeks} Weeks
                      </span>
                    </div>

                    <p style={{
                      fontSize: '0.84rem',
                      color: isLight ? '#334155' : 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {opp.description}
                    </p>

                    {/* Skill Breakdown */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isLight ? '#475569' : 'var(--text-muted)', marginBottom: '6px' }}>
                        Skill Overlap Breakdown:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {opp.matchedSkills.map(s => (
                          <span
                            key={s.skill}
                            style={{
                              background: isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.16)',
                              color: isLight ? '#1d4ed8' : '#93c5fd',
                              border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.35)',
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <CheckCircle2 size={11} color={isLight ? '#2563eb' : '#60a5fa'} />
                            {s.skill.split(' ')[0]} ({s.userScore}%)
                          </span>
                        ))}
                        {opp.gapSkills.map(g => (
                          <span
                            key={g.skill}
                            style={{
                              background: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.12)',
                              color: isLight ? '#b45309' : '#fbbf24',
                              border: isLight ? '1px solid #fde68a' : '1px solid rgba(245, 158, 11, 0.25)',
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <AlertCircle size={11} color={isLight ? '#d97706' : '#fbbf24'} />
                            Needs {g.targetScore}% (Gap: {g.gap}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '14px',
                    marginTop: '8px'
                  }}>
                    <button
                      onClick={() => setSelectedOppForFit(opp)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: isLight ? '#2563eb' : '#38bdf8',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Skill Fit Details <ChevronRight size={14} />
                    </button>

                    {opp.hasApplied ? (
                      <span className="badge badge-emerald" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                        <CheckCircle2 size={14} />
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => applyToOpportunity(opp.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Apply Now <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Radar & Skill Proficiency Heatmap (TRD Section 5) */}
      {activeTab === 'radar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* DEDICATED SKILL PROFICIENCY HEATMAP */}
          <div className="glass-panel" style={{ padding: '24px 28px', border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                    Skill Proficiency Heatmap
                  </h3>
                  <span className="badge badge-sky">AI Assessed</span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                  Visual heatmap of candidate domain competencies graded against AYUSH & biotechnology industry benchmarks
                </p>
              </div>

              {/* Heatmap Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem', color: isLight ? '#334155' : '#cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: isLight ? '#0284c7' : 'rgba(56, 189, 248, 0.85)' }}></span>
                  <span style={{ fontWeight: 600 }}>Mastery (80%+)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: isLight ? '#2563eb' : 'rgba(37, 99, 235, 0.75)' }}></span>
                  <span style={{ fontWeight: 600 }}>Proficient (60-79%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: isLight ? '#64748b' : 'rgba(29, 78, 216, 0.5)' }}></span>
                  <span style={{ fontWeight: 600 }}>Intermediate (45-59%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: isLight ? '#d97706' : 'rgba(245, 158, 11, 0.6)' }}></span>
                  <span style={{ fontWeight: 600 }}>Gap Alert (&lt;45%)</span>
                </div>
              </div>
            </div>

            {/* Heatmap Tiles Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {Object.entries(studentProfile?.skills || {}).map(([skill, score]) => {
                const target = (typeof benchmarks === 'object' && !Array.isArray(benchmarks) && benchmarks?.[skill]) || 75;
                const isMastery = score >= 80;
                const isProficient = score >= 60 && score < 80;
                const isIntermediate = score >= 45 && score < 60;
                const isGap = score < 45;

                let heatBg = isLight ? '#f8fafc' : 'rgba(29, 78, 216, 0.2)';
                let heatBorder = isLight ? '#cbd5e1' : 'rgba(59, 130, 246, 0.3)';
                let heatText = isLight ? '#1e40af' : '#93c5fd';
                let statusLabel = 'Intermediate';

                if (isMastery) {
                  heatBg = isLight ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : 'linear-gradient(135deg, rgba(37, 99, 235, 0.35), rgba(56, 189, 248, 0.25))';
                  heatBorder = isLight ? '#3b82f6' : '#38bdf8';
                  heatText = isLight ? '#1d4ed8' : '#38bdf8';
                  statusLabel = 'Mastery / Ready';
                } else if (isProficient) {
                  heatBg = isLight ? '#f0f9ff' : 'rgba(37, 99, 235, 0.25)';
                  heatBorder = isLight ? '#93c5fd' : 'rgba(59, 130, 246, 0.45)';
                  heatText = isLight ? '#2563eb' : '#60a5fa';
                  statusLabel = 'Proficient';
                } else if (isGap) {
                  heatBg = isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.12)';
                  heatBorder = isLight ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)';
                  heatText = isLight ? '#b45309' : '#fbbf24';
                  statusLabel = 'Skill Deficit';
                }

                return (
                  <div
                    key={skill}
                    style={{
                      background: heatBg,
                      border: `1.5px solid ${heatBorder}`,
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: isLight ? '#64748b' : 'var(--text-muted)', fontWeight: 600 }}>
                          Target: {target}%
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: isLight ? '#ffffff' : 'rgba(0,0,0,0.3)',
                          color: heatText,
                          border: `1px solid ${heatBorder}`
                        }}>
                          {statusLabel}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', lineHeight: 1.3, marginBottom: '12px' }}>
                        {skill}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.76rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>Proficiency:</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: heatText }}>
                          {score}%
                        </span>
                      </div>
                      <div className="progress-bar-bg" style={{ height: '6px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${score}%`,
                            background: isMastery
                              ? 'linear-gradient(90deg, #2563eb, #38bdf8)'
                              : isGap
                              ? 'linear-gradient(90deg, #b45309, #f59e0b)'
                              : 'linear-gradient(90deg, #1e3a8a, #60a5fa)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
            {/* SVG Radar Chart */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <RadarChart studentSkills={studentProfile?.skills || {}} benchmarks={Array.isArray(benchmarks) ? benchmarks : []} />
            </div>

            {/* Gap Analysis & Curated Micro-Certifications */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                  Identified Skill Gaps & Curated Courses
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                  Prioritized deficits mapped from TRD <code>skill_courses</code> catalog
                </p>
              </div>

              {/* Gap Breakdown Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {Object.entries(studentProfile?.skills || {}).map(([skill, score]) => {
                  return (
                    <div key={skill} style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 600, color: isLight ? '#0f172a' : '#f8fafc' }}>{skill}</span>
                        <span style={{ color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                          Score: <strong style={{ color: isLight ? '#1d4ed8' : (score >= 70 ? '#38bdf8' : '#93c5fd') }}>{score}%</strong> / 80%
                        </span>
                      </div>
                      <div className="progress-bar-bg" style={{ height: '6px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${score}%`,
                            background: score >= 70 ? 'linear-gradient(90deg, #2563eb, #38bdf8)' : 'linear-gradient(90deg, #1e3a8a, #60a5fa)'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommended Micro-Certifications (TRD skill_courses) */}
              <div>
                <h4 style={{ fontSize: '0.95rem', color: isLight ? '#1d4ed8' : '#93c5fd', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <BookOpen size={16} /> Targeted Remedial Certifications (TRD Course Catalog)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {skillCourses.map(c => (
                    <div
                      key={c.id}
                      style={{
                        background: isLight ? '#f8fafc' : 'rgba(37, 99, 235, 0.08)',
                        border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(59, 130, 246, 0.25)',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isLight ? '#0f172a' : '#ffffff' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                          {c.provider} • Level: {c.level} • Duration: {c.duration}
                        </div>
                      </div>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 10px', textDecoration: 'none' }}
                      >
                        Enroll <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: My Applications Pipeline with Transition History (schema: application_status_history) */}
      {activeTab === 'applications' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0, color: isLight ? '#0f172a' : '#f8fafc' }}>
              Internship & Placement Applications Pipeline
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
              Tracked across TRD pipeline statuses (applied → shortlisted → interview → offered → completed)
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(applications || []).filter(a => a.student_id === studentProfile?.id).map(app => {
              let badgeClass = 'badge-blue';
              if (app.status === 'offered' || app.status === 'completed') badgeClass = 'badge-emerald';
              else if (app.status === 'interview') badgeClass = 'badge-purple';
              else if (app.status === 'shortlisted') badgeClass = 'badge-teal';

              return (
                <div
                  key={app.id}
                  className="glass-panel"
                  style={{
                    padding: '22px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ fontSize: '1.15rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                          {app.opportunityTitle}
                        </h4>
                        <span className={`badge ${badgeClass}`}>{app.status.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginTop: '4px' }}>
                        🏢 {app.company} • Vector Cosine Match: <strong style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>{app.match_score}%</strong> • Applied: {app.applied_at?.slice(0, 10)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => setSelectedAppHistory(app)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '6px' }}
                      >
                        <History size={14} /> View Audit Trail ({app.history?.length || 1})
                      </button>
                    </div>
                  </div>

                  {app.interview_date && (
                    <div style={{
                      fontSize: '0.82rem',
                      color: isLight ? '#6b21a8' : '#c084fc',
                      background: isLight ? '#f3e8ff' : 'rgba(139, 92, 246, 0.12)',
                      border: isLight ? '1px solid #d8b4fe' : 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      width: 'fit-content'
                    }}>
                      <Calendar size={14} /> Scheduled Interview: {app.interview_date}
                    </div>
                  )}

                  {/* Mentor Feedback if present (schema: mentor_feedback) */}
                  {app.feedback && (
                    <div style={{
                      background: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.08)',
                      border: isLight ? '1px solid #a7f3d0' : '1px solid rgba(16, 185, 129, 0.2)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isLight ? '#b45309' : '#fbbf24', fontWeight: 600 }}>
                        <Star size={14} fill={isLight ? '#b45309' : '#fbbf24'} />
                        <span>Industry Mentor Rating: {app.feedback.rating} / 5 Stars</span>
                      </div>
                      <div style={{ color: isLight ? '#334155' : '#cbd5e1', marginTop: '4px' }}>
                        "{app.feedback.text}"
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Verified Digital Portfolio */}
      {activeTab === 'portfolio' && (
        <DigitalPortfolio />
      )}

      {/* Assessment Modal */}
      <SkillAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
      />

      {/* Application Status History Timeline Modal (backend_schema.sql Section 5) */}
      {selectedAppHistory && (
        <div className="modal-overlay" onClick={() => setSelectedAppHistory(null)}>
          <div
            className="modal-content glass-panel"
            onClick={e => e.stopPropagation()}
            style={{ padding: '28px', maxWidth: '600px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>Application Status History Log</h3>
                <p style={{ fontSize: '0.8rem', color: isLight ? '#475569' : 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Table: <code>application_status_history</code> • App ID: {selectedAppHistory.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppHistory(null)}
                style={{ background: 'transparent', border: 'none', color: isLight ? '#475569' : '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {(selectedAppHistory.history || []).map((h, i) => (
                <div
                  key={h.id || i}
                  style={{
                    background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
                    borderLeft: `3px solid ${isLight ? '#2563eb' : '#38bdf8'}`,
                    border: isLight ? '1px solid #e2e8f0' : 'none',
                    borderLeftWidth: '3px',
                    padding: '12px 16px',
                    borderRadius: '0 8px 8px 0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isLight ? '#1d4ed8' : '#38bdf8', textTransform: 'uppercase' }}>
                      {h.new_status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                      {h.changed_at}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: isLight ? '#334155' : '#cbd5e1', marginTop: '4px' }}>
                    {h.remarks}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedAppHistory(null)}
                className="btn btn-secondary btn-sm"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Fit Breakdown Modal */}
      {selectedOppForFit && (
        <div className="modal-overlay" onClick={() => setSelectedOppForFit(null)}>
          <div
            className="modal-content glass-panel"
            onClick={e => e.stopPropagation()}
            style={{ padding: '28px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>Vector Cosine Skill Fit Analysis</h3>
                <p style={{ fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  {selectedOppForFit.title} • {selectedOppForFit.company}
                </p>
              </div>
              <div style={{
                background: isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.2)',
                color: isLight ? '#1d4ed8' : '#38bdf8',
                border: isLight ? '1px solid #bfdbfe' : 'none',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                {selectedOppForFit.matchScore}% Vector Fit
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {Object.entries(selectedOppForFit?.requiredSkills || {}).map(([skill, target]) => {
                const userScore = (studentProfile?.skills && studentProfile.skills[skill]) || 0;
                const meets = userScore >= target;
                return (
                  <div
                    key={skill}
                    style={{
                      background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
                      padding: '12px',
                      borderRadius: '8px',
                      border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: isLight ? '#0f172a' : '#ffffff' }}>{skill}</span>
                      <span style={{ color: isLight ? (meets ? '#15803d' : '#b45309') : (meets ? '#38bdf8' : '#93c5fd'), fontWeight: 700 }}>
                        Candidate: {userScore}% / Target: {target}% {meets ? '✓' : `(-${target - userScore}%)`}
                      </span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '6px' }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${userScore}%`,
                          background: meets ? 'linear-gradient(90deg, #2563eb, #38bdf8)' : 'linear-gradient(90deg, #1e3a8a, #60a5fa)'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedOppForFit(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
              {!selectedOppForFit.hasApplied && (
                <button
                  onClick={() => {
                    applyToOpportunity(selectedOppForFit.id);
                    setSelectedOppForFit(null);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Confirm & Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
