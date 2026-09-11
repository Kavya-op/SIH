import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Kanban,
  List,
  Sparkles,
  Calendar,
  Clock,
  History,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Star,
  Award,
  FileText,
  Send,
  SlidersHorizontal
} from 'lucide-react';

export default function CandidatePipeline({
  applications = [],
  internships = [],
  selectedOppFilter,
  setSelectedOppFilter,
  onOpenStatusModal,
  onOpenDossierModal,
  onOpenCredentialModal,
  isLight
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [statusFilter, setStatusFilter] = useState('all');
  const [minMatchFilter, setMinMatchFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const stages = [
    { key: 'applied', label: 'Applied', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)' },
    { key: 'shortlisted', label: 'Shortlisted', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)' },
    { key: 'interview', label: 'Interview Scheduled', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
    { key: 'offered', label: 'Offer Extended', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { key: 'completed', label: 'Hired / Completed', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
    { key: 'rejected', label: 'Rejected', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' }
  ];

  // Filtering
  const filteredApps = applications.filter(app => {
    if (selectedOppFilter !== 'all' && app.opportunity_id !== selectedOppFilter) return false;
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (app.match_score < minMatchFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const mName = app.studentName?.toLowerCase().includes(q);
      const mOpp = app.opportunityTitle?.toLowerCase().includes(q);
      if (!mName && !mOpp) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ATS Toolbar & Filters */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          border: isLight ? '1px solid #cbd5e1' : undefined
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate name or role..."
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
        </div>

        {/* Filters and View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Opportunity Selector */}
          <select
            value={selectedOppFilter}
            onChange={e => setSelectedOppFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
              border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
              color: isLight ? '#0f172a' : '#ffffff',
              maxWidth: '220px'
            }}
          >
            <option value="all">All Opportunities ({applications.length})</option>
            {internships.map(opp => (
              <option key={opp.id} value={opp.id}>
                {opp.title}
              </option>
            ))}
          </select>

          {/* Match Score Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
            <span style={{ color: isLight ? '#64748b' : 'var(--text-muted)' }}>Min Fit:</span>
            <select
              value={minMatchFilter}
              onChange={e => setMinMatchFilter(Number(e.target.value))}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#ffffff'
              }}
            >
              <option value={0}>All Scores (0%+)</option>
              <option value={60}>60%+ Fit (TRD Target)</option>
              <option value={75}>75%+ Strong Fit</option>
              <option value={85}>85%+ Elite Match</option>
            </select>
          </div>

          {/* View Switcher: Kanban vs List */}
          <div
            style={{
              display: 'flex',
              padding: '3px',
              borderRadius: '8px',
              background: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)',
              border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)'
            }}
          >
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: viewMode === 'kanban' ? (isLight ? '#fff' : '#2563eb') : 'transparent',
                color: viewMode === 'kanban' ? (isLight ? '#2563eb' : '#fff') : (isLight ? '#64748b' : '#94a3b8')
              }}
            >
              <Kanban size={14} />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: viewMode === 'list' ? (isLight ? '#fff' : '#2563eb') : 'transparent',
                color: viewMode === 'list' ? (isLight ? '#2563eb' : '#fff') : (isLight ? '#64748b' : '#94a3b8')
              }}
            >
              <List size={14} />
              <span>List ({filteredApps.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            alignItems: 'flex-start'
          }}
        >
          {stages.map(stage => {
            const stageApps = filteredApps.filter(a => a.status === stage.key);

            return (
              <div
                key={stage.key}
                style={{
                  background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.65)',
                  borderRadius: '14px',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: '480px'
                }}
              >
                {/* Stage Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: `2px solid ${stage.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: stage.color
                      }}
                    />
                    <h4 style={{ fontSize: '0.88rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                      {stage.label}
                    </h4>
                  </div>
                  <span
                    style={{
                      background: stage.bg,
                      color: stage.color,
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}
                  >
                    {stageApps.length}
                  </span>
                </div>

                {/* Candidate Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stageApps.map(app => {
                    const scoreColor = app.match_score >= 80 ? '#10b981' : app.match_score >= 65 ? '#38bdf8' : '#f59e0b';

                    return (
                      <div
                        key={app.id}
                        className="glass-panel"
                        style={{
                          padding: '14px',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          border: isLight ? '1px solid #cbd5e1' : undefined,
                          background: isLight ? '#ffffff' : undefined,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                        }}
                      >
                        {/* Top: Student & Match */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div
                              onClick={() => onOpenDossierModal(app)}
                              style={{
                                fontSize: '0.92rem',
                                fontWeight: 700,
                                color: isLight ? '#0f172a' : '#ffffff',
                                cursor: 'pointer'
                              }}
                              className="hover:text-blue-600 hover:underline"
                            >
                              {app.studentName}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                              App ID: {app.id}
                            </div>
                          </div>

                          {/* Match Fit */}
                          <span
                            style={{
                              background: 'rgba(0,0,0,0.2)',
                              border: `1px solid ${scoreColor}`,
                              color: scoreColor,
                              padding: '2px 7px',
                              borderRadius: '10px',
                              fontSize: '0.7rem',
                              fontWeight: 700
                            }}
                          >
                            {app.match_score}% Fit
                          </span>
                        </div>

                        {/* Opportunity Title */}
                        <div style={{ fontSize: '0.78rem', color: isLight ? '#334155' : '#cbd5e1', fontWeight: 600 }}>
                          💼 {app.opportunityTitle}
                        </div>

                        {/* Interview Date Tag if Scheduled */}
                        {app.interview_date && (
                          <div
                            style={{
                              fontSize: '0.72rem',
                              background: 'rgba(168, 85, 247, 0.12)',
                              color: isLight ? '#7e22ce' : '#c084fc',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Calendar size={12} />
                            <span>{app.interview_date}</span>
                          </div>
                        )}

                        {/* Mentor Rating if given */}
                        {app.feedback && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>
                            <Star size={12} fill="#d97706" />
                            <span>Mentor Review: {app.feedback.rating}/5</span>
                          </div>
                        )}

                        {/* Card Actions */}
                        <div
                          style={{
                            borderTop: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                            paddingTop: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <button
                            onClick={() => onOpenDossierModal(app)}
                            className="text-xs text-blue-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>Dossier</span>
                            <ExternalLink size={11} />
                          </button>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            {app.status === 'offered' && (
                              <button
                                onClick={() => onOpenCredentialModal(app)}
                                title="Issue Official Verifiable Credential / Offer Letter"
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.7rem', padding: '4px 8px', gap: '2px' }}
                              >
                                <Award size={12} />
                                <span>Issue Credential</span>
                              </button>
                            )}

                            <button
                              onClick={() => onOpenStatusModal(app)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.7rem', padding: '4px 8px', gap: '4px' }}
                            >
                              <History size={12} />
                              <span>Stage</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {stageApps.length === 0 && (
                    <div
                      style={{
                        padding: '24px 12px',
                        textAlign: 'center',
                        color: isLight ? '#94a3b8' : 'var(--text-muted)',
                        fontSize: '0.78rem',
                        border: '1px dashed var(--border-subtle)',
                        borderRadius: '8px'
                      }}
                    >
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="glass-panel" style={{ padding: '20px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredApps.map(app => {
              const scoreColor = app.match_score >= 80 ? '#10b981' : app.match_score >= 65 ? '#38bdf8' : '#f59e0b';

              return (
                <div
                  key={app.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '10px',
                    background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'rgba(37, 99, 235, 0.18)',
                        color: isLight ? '#2563eb' : '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem'
                      }}
                    >
                      {app.studentName.charAt(0)}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4
                          onClick={() => onOpenDossierModal(app)}
                          style={{
                            fontSize: '0.98rem',
                            margin: 0,
                            color: isLight ? '#0f172a' : '#ffffff',
                            cursor: 'pointer'
                          }}
                          className="hover:text-blue-600 hover:underline font-bold"
                        >
                          {app.studentName}
                        </h4>
                        <span
                          style={{
                            background: 'rgba(0,0,0,0.3)',
                            border: `1px solid ${scoreColor}`,
                            color: scoreColor,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}
                        >
                          {app.match_score}% Vector Fit
                        </span>
                        <span className="badge badge-teal" style={{ fontSize: '0.68rem' }}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginTop: '2px' }}>
                        Target Position: <strong style={{ color: isLight ? '#0f172a' : '#cbd5e1' }}>{app.opportunityTitle}</strong> • App ID: {app.id}
                      </div>

                      {app.interview_date && (
                        <div style={{ fontSize: '0.76rem', color: '#a855f7', marginTop: '3px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} />
                          <span>Interview: {app.interview_date}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => onOpenDossierModal(app)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '4px' }}
                    >
                      <FileText size={13} />
                      <span>View Dossier</span>
                    </button>

                    <button
                      onClick={() => onOpenStatusModal(app)}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '4px' }}
                    >
                      <History size={13} />
                      <span>Transition Stage</span>
                    </button>

                    {app.status === 'offered' && (
                      <button
                        onClick={() => onOpenCredentialModal(app)}
                        className="btn btn-outline btn-sm"
                        style={{ gap: '4px' }}
                      >
                        <Award size={13} />
                        <span>Issue Credential</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredApps.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
                No applications match the current criteria.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
