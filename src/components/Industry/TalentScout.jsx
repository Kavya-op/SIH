import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  GraduationCap,
  Award,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function TalentScout({
  candidates = [],
  internships = [],
  calculateCosineMatch,
  onSendDirectInvite,
  onOpenCandidatePortfolio,
  isLight
}) {
  const [selectedOppId, setSelectedOppId] = useState(() => internships[0]?.id || 'opp-eng-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('all');
  const [instFilter, setInstFilter] = useState('all');
  const [minCgpaFilter, setMinCgpaFilter] = useState(0);

  const activeOpp = internships.find(o => o.id === selectedOppId) || internships[0];

  // Evaluate candidates against active opportunity required skills
  const evaluatedCandidates = candidates.map(cand => {
    const match = calculateCosineMatch(cand.skills || {}, activeOpp?.requiredSkills || {});
    return {
      ...cand,
      matchScore: match.score,
      cosineSim: match.cosineSim,
      matchedSkills: match.matchedSkills,
      gapSkills: match.gapSkills
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  // Filter
  const filteredCandidates = evaluatedCandidates.filter(cand => {
    if (disciplineFilter !== 'all' && cand.discipline && cand.discipline !== disciplineFilter) return false;
    if (instFilter !== 'all' && !cand.institution?.toLowerCase().includes(instFilter.toLowerCase())) return false;
    if (cand.cgpa < minCgpaFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const mName = cand.name?.toLowerCase().includes(q);
      const mDeg = cand.degree?.toLowerCase().includes(q);
      const mDept = cand.department?.toLowerCase().includes(q);
      const mInst = cand.institution?.toLowerCase().includes(q);
      if (!mName && !mDeg && !mDept && !mInst) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Algorithm Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.3)',
          background: isLight
            ? 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)'
            : 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={24} className="text-blue-600 dark:text-sky-400" />
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                AI Talent Scout & Vector Cosine Matching Engine
              </h3>
              <span className="badge badge-sky" style={{ fontSize: '0.74rem' }}>TRD §5 Active</span>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.86rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
              Computes mathematical cosine similarity between required position skill vectors and verified student competency profiles.
            </p>
          </div>

          {/* Target Role Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: isLight ? '#475569' : 'var(--text-secondary)' }}>
              Evaluate Against Role:
            </span>
            <select
              value={selectedOppId}
              onChange={e => setSelectedOppId(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 600,
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1.5px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#ffffff',
                maxWidth: '280px'
              }}
            >
              {internships.map(opp => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} ({opp.type.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Formula Banner */}
        <div
          style={{
            marginTop: '20px',
            padding: '12px 18px',
            borderRadius: '10px',
            background: isLight ? '#ffffff' : 'rgba(0, 0, 0, 0.25)',
            border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.82rem'
          }}
        >
          <div style={{ fontFamily: 'monospace', color: isLight ? '#2563eb' : '#38bdf8', fontWeight: 700 }}>
            Formula: sim(u, v) = (u • v) / (||u|| × ||v||)
          </div>
          <div style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
            Selected Position: <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{activeOpp?.title}</strong>
          </div>
          <div style={{ color: isLight ? '#64748b' : 'var(--text-muted)' }}>
            Evaluated Pool: <strong>{filteredCandidates.length} Apex Scholars</strong>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          border: isLight ? '1px solid #cbd5e1' : undefined
        }}
      >
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name, degree, or specialization..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
              borderColor: isLight ? '#cbd5e1' : 'var(--border-medium)',
              color: isLight ? '#0f172a' : '#ffffff'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Discipline Filter */}
          <select
            value={disciplineFilter}
            onChange={e => setDisciplineFilter(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
              border: isLight ? '1.5px solid #93c5fd' : '1px solid var(--border-medium)',
              color: isLight ? '#0f172a' : '#ffffff'
            }}
          >
            <option value="all">🌐 All Disciplines</option>
            <option value="engineering">💻 B.Tech Engineering</option>
            <option value="commerce">📊 Commerce & FinTech</option>
            <option value="healthcare">🩺 Healthcare & Sciences</option>
          </select>

          {/* Institution Filter */}
          <select
            value={instFilter}
            onChange={e => setInstFilter(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
              border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
              color: isLight ? '#0f172a' : '#ffffff'
            }}
          >
            <option value="all">All Apex Institutions</option>
            <option value="IIT">IIT Delhi</option>
            <option value="SRCC">SRCC Delhi</option>
            <option value="BITS">BITS Pilani</option>
            <option value="FMS">FMS Delhi</option>
            <option value="AIIA">AIIA New Delhi</option>
            <option value="NIA">NIA Jaipur</option>
          </select>

          {/* Min CGPA Filter */}
          <select
            value={minCgpaFilter}
            onChange={e => setMinCgpaFilter(Number(e.target.value))}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
              border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
              color: isLight ? '#0f172a' : '#ffffff'
            }}
          >
            <option value={0}>All CGPAs</option>
            <option value={8.0}>CGPA ≥ 8.0</option>
            <option value={8.5}>CGPA ≥ 8.5 (High Merit)</option>
            <option value={9.0}>CGPA ≥ 9.0 (Top Scholars)</option>
          </select>
        </div>
      </div>

      {/* Candidate Match Fit Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredCandidates.map((cand, rank) => {
          const scoreColor = cand.matchScore >= 80 ? '#10b981' : cand.matchScore >= 65 ? '#38bdf8' : '#f59e0b';
          const isTopMatch = rank === 0;

          return (
            <div
              key={cand.id}
              className="glass-panel"
              style={{
                padding: '24px 28px',
                border: isLight ? '1px solid #cbd5e1' : undefined,
                borderLeft: `4px solid ${scoreColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                boxShadow: isTopMatch ? '0 4px 18px rgba(37, 99, 235, 0.12)' : undefined
              }}
            >
              {/* Header Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={cand.avatar}
                    alt={cand.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      border: `2px solid ${scoreColor}`,
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                        {cand.name}
                      </h4>
                      <span
                        className={`badge ${
                          cand.discipline === 'engineering'
                            ? 'badge-sky'
                            : cand.discipline === 'commerce'
                            ? 'badge-amber'
                            : 'badge-emerald'
                        }`}
                        style={{ fontSize: '0.7rem', fontWeight: 700 }}
                      >
                        {cand.discipline === 'engineering'
                          ? '💻 B.Tech Engineering'
                          : cand.discipline === 'commerce'
                          ? '📊 Commerce & FinTech'
                          : '🩺 Healthcare & Ayush'}
                      </span>
                      {isTopMatch && <span className="badge badge-sky">#1 Ranked Fit</span>}
                      <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                        CGPA: {cand.cgpa}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginTop: '3px' }}>
                      {cand.degree} • <strong style={{ color: isLight ? '#0f172a' : '#e2e8f0' }}>{cand.institution}</strong>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : 'var(--text-muted)', marginTop: '2px' }}>
                      Enrollment: {cand.enrollment_no} • {cand.year_of_study}
                    </div>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div
                  style={{
                    background: isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.15)',
                    border: `1.5px solid ${scoreColor}`,
                    padding: '10px 18px',
                    borderRadius: '14px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: isLight ? '#2563eb' : '#93c5fd', fontWeight: 700 }}>
                    Vector Match Fit
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: scoreColor }}>
                    {cand.matchScore}%
                  </div>
                </div>
              </div>

              {/* Skills Fit Breakdown against activeOpp */}
              {activeOpp?.requiredSkills && Object.keys(activeOpp.requiredSkills).length > 0 && (
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#1e293b' : '#f1f5f9', marginBottom: '8px' }}>
                    Position Skills Breakdown (Candidate Score vs Target):
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                    {Object.entries(activeOpp.requiredSkills).map(([skill, target]) => {
                      const candScore = cand.skills[skill] || 50;
                      const meets = candScore >= target;

                      return (
                        <div
                          key={skill}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                            border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, color: isLight ? '#0f172a' : '#ffffff' }}>{skill}</span>
                            <span style={{ color: meets ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                              {candScore}% / {target}% {meets ? '✓' : `(-${target - candScore}%)`}
                            </span>
                          </div>
                          <div
                            style={{
                              height: '5px',
                              borderRadius: '3px',
                              background: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)',
                              overflow: 'hidden'
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(100, candScore)}%`,
                                height: '100%',
                                background: meets ? '#10b981' : '#f59e0b',
                                borderRadius: '3px'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Toolbar */}
              <div
                style={{
                  borderTop: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  paddingTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(cand.topBadges || []).map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.05)',
                        border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                        color: isLight ? '#334155' : '#cbd5e1'
                      }}
                    >
                      🏅 {badge}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => onOpenCandidatePortfolio(cand)}
                    className="btn btn-secondary btn-sm"
                  >
                    View Verified Portfolio
                  </button>

                  <button
                    onClick={() => onSendDirectInvite(cand, activeOpp.title)}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <Send size={13} />
                    <span>Send Direct Interview Invite</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCandidates.length === 0 && (
          <div
            className="glass-panel"
            style={{ padding: '40px', textAlign: 'center', color: isLight ? '#64748b' : 'var(--text-secondary)' }}
          >
            No scholars match your criteria. Try loosening the filter parameters.
          </div>
        )}
      </div>
    </div>
  );
}
