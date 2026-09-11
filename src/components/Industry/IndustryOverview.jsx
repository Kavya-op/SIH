import React from 'react';
import {
  Users,
  Briefcase,
  Sparkles,
  GraduationCap,
  ArrowUpRight,
  Zap
} from 'lucide-react';

export default function IndustryOverview({
  internships = [],
  applications = [],
  candidates = [],
  onNavigateTab,
  onOpenPostModal,
  isLight
}) {
  // Funnel calculations
  const totalApplied = applications.length;
  const shortlisted = applications.filter(a => a.status === 'shortlisted' || a.status === 'interview' || a.status === 'offered' || a.status === 'completed').length;
  const interviewing = applications.filter(a => a.status === 'interview').length;
  const offered = applications.filter(a => a.status === 'offered' || a.status === 'completed').length;
  const completed = applications.filter(a => a.status === 'completed').length;

  const funnelStages = [
    { label: 'Applications Received', count: totalApplied, pct: 100, color: '#38bdf8' },
    { label: 'Shortlisted for Review', count: shortlisted, pct: totalApplied ? Math.round((shortlisted / totalApplied) * 100) : 0, color: '#60a5fa' },
    { label: 'Technical Rounds / Interview', count: interviewing, pct: totalApplied ? Math.round((interviewing / totalApplied) * 100) : 0, color: '#a855f7' },
    { label: 'Offers Extended', count: offered, pct: totalApplied ? Math.round((offered / totalApplied) * 100) : 0, color: '#10b981' },
    { label: 'Joined / Completed', count: completed, pct: totalApplied ? Math.round((completed / totalApplied) * 100) : 0, color: '#06b6d4' }
  ];

  // University distribution
  const universityStats = [
    { name: 'All India Institute of Ayurveda (AIIA), New Delhi', count: 18, share: '46%', badge: 'Apex CoE' },
    { name: 'National Institute of Ayurveda (NIA), Jaipur', count: 11, share: '28%', badge: 'Deemed Univ' },
    { name: 'Banaras Hindu University (BHU) - Faculty of Ayurveda', count: 7, share: '18%', badge: 'Central Univ' },
    { name: 'ITRA Jamnagar (Institute of Teaching & Research)', count: 3, share: '8%', badge: 'National Importance' }
  ];

  // In-demand skills breakdown
  const inDemandSkills = [
    { name: 'Formulation & Analytical Chemistry (HPLC/HPTLC)', count: 4, match: 86 },
    { name: 'Clinical Trials & GCP Protocols', count: 3, match: 82 },
    { name: 'Ayur-Informatics & Computational Biology', count: 2, match: 74 },
    { name: 'Pharmacovigilance & Drug Safety', count: 3, match: 89 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Quick Launchpad & Welcome Hero */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          background: isLight
            ? 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)'
            : 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>🏢</span>
            <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
              Talent Acquisition & Institutional Engagement Overview
            </h3>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.88rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
            Real-time pipeline analytics, university scholar sourcing metrics, and active campus collaboration workflows.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigateTab('pipeline')}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <Users size={15} />
            ATS Kanban Board
          </button>
          <button
            onClick={() => onNavigateTab('talent')}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <Sparkles size={15} />
            AI Talent Scout ({candidates.length})
          </button>
          <button
            onClick={onOpenPostModal}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Zap size={15} />
            Post New Opportunity
          </button>
        </div>
      </div>

      {/* 2-Column Grid: Funnel + University Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* ATS Recruitment Funnel */}
        <div className="glass-panel" style={{ padding: '24px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                ATS Candidate Pipeline Funnel
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
                Application progression from initial screening to onboarding
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('pipeline')}
              className="text-blue-600 dark:text-sky-400 text-xs font-bold hover:underline flex items-center gap-1"
            >
              <span>Manage Pipeline</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {funnelStages.map((stage, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: isLight ? '#1e293b' : '#f1f5f9' }}>
                    {stage.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: stage.color }}>{stage.count} candidates</strong>
                    <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                      ({stage.pct}%)
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    background: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(4, stage.pct)}%`,
                      height: '100%',
                      background: stage.color,
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)',
              border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem'
            }}
          >
            <span style={{ color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
              Avg. Time to Shortlist: <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>2.4 Days</strong>
            </span>
            <span style={{ color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
              Offer Acceptance Rate: <strong style={{ color: '#10b981' }}>94.2%</strong>
            </span>
          </div>
        </div>

        {/* Scholar Sourcing by University */}
        <div className="glass-panel" style={{ padding: '24px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                University Talent Sourcing Distribution
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
                Registered scholars engaged via institutional MoUs
              </p>
            </div>
            <span className="badge badge-emerald">4 Partner Institutes</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {universityStats.map((uni, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(37, 99, 235, 0.12)',
                      color: isLight ? '#2563eb' : '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.82rem'
                    }}
                  >
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: isLight ? '#0f172a' : '#ffffff' }}>
                      {uni.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                      {uni.share} of candidate pool • <span style={{ color: isLight ? '#2563eb' : '#38bdf8' }}>{uni.badge}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: isLight ? '#0f172a' : '#f8fafc'
                    }}
                  >
                    {uni.count}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                    Applicants
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <button
              onClick={() => onNavigateTab('talent')}
              className="text-blue-600 dark:text-sky-400 text-xs font-bold hover:underline flex items-center justify-end gap-1"
            >
              <span>Explore All Verified Scholars</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* In-Demand Competencies & Quick Vacancies Snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Active Skill In-Demand Index */}
        <div className="glass-panel" style={{ padding: '24px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <h4 style={{ fontSize: '1.05rem', margin: '0 0 4px 0', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
            Core Skill Demand & Average Competency Match
          </h4>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
            Vector cosine evaluation across required role benchmarks
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {inDemandSkills.map((sk, i) => (
              <div
                key={i}
                style={{
                  background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: isLight ? '#0f172a' : '#ffffff' }}>
                    {sk.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                    {sk.count} active roles require this competency
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: sk.match >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                      color: sk.match >= 80 ? '#10b981' : '#38bdf8'
                    }}
                  >
                    {sk.match}% Avg Fit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Active Opportunities Snapshot */}
        <div className="glass-panel" style={{ padding: '24px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
              Published Opportunities ({internships.length})
            </h4>
            <button
              onClick={() => onNavigateTab('postings')}
              className="text-blue-600 dark:text-sky-400 text-xs font-bold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {internships.slice(0, 3).map((opp) => (
              <div
                key={opp.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-sky" style={{ fontSize: '0.68rem' }}>{opp.type.toUpperCase()}</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: isLight ? '#0f172a' : '#ffffff' }}>
                      {opp.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : 'var(--text-muted)', marginTop: '2px' }}>
                    📍 {opp.location} • 💰 {opp.stipend_formatted} • {opp.openings} Openings
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: opp.status === 'open' ? '#10b981' : '#f59e0b',
                    textTransform: 'uppercase'
                  }}
                >
                  ● {opp.status || 'open'}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            <button
              onClick={onOpenPostModal}
              className="btn btn-outline btn-sm w-full"
              style={{ justifyContent: 'center', gap: '6px' }}
            >
              <Briefcase size={14} />
              <span>Create New Vacancy Posting (TRD §4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
