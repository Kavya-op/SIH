import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Users,
  Sparkles,
  MapPin,
  Clock,
  Calendar,
  Eye,
  CheckCircle2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronRight
} from 'lucide-react';

export default function VacancyManager({
  internships = [],
  applications = [],
  onOpenPostModal,
  onToggleStatus,
  onDeleteOpportunity,
  onViewApplicants,
  onScoutForOpp,
  isLight
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('all'); // all | engineering | commerce | healthcare
  const [typeFilter, setTypeFilter] = useState('all'); // all | internship | job | training
  const [modeFilter, setModeFilter] = useState('all'); // all | onsite | hybrid | remote
  const [statusFilter, setStatusFilter] = useState('all'); // all | open | closed

  const filteredOpps = internships.filter(opp => {
    if (disciplineFilter !== 'all' && opp.discipline && opp.discipline !== disciplineFilter) return false;
    if (typeFilter !== 'all' && opp.type !== typeFilter) return false;
    if (modeFilter !== 'all' && opp.mode !== modeFilter) return false;
    if (statusFilter !== 'all' && (opp.status || 'open') !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const mTitle = opp.title?.toLowerCase().includes(q);
      const mLoc = opp.location?.toLowerCase().includes(q);
      const mCat = opp.category?.toLowerCase().includes(q);
      const mComp = opp.company?.toLowerCase().includes(q);
      if (!mTitle && !mLoc && !mCat && !mComp) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Controls Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vacancies by title, company, category, or location..."
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

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={disciplineFilter}
            onChange={e => setDisciplineFilter(e.target.value)}
            style={{
              padding: '8px 12px',
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
            <option value="commerce">📊 Commerce & Management</option>
            <option value="healthcare">🩺 Healthcare & Sciences</option>
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
              border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
              color: isLight ? '#0f172a' : '#ffffff'
            }}
          >
            <option value="all">All Types</option>
            <option value="internship">Internship</option>
            <option value="job">Full-Time Job</option>
            <option value="training">Industrial Training</option>
          </select>

          <select
            value={modeFilter}
            onChange={e => setModeFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
              border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
              color: isLight ? '#0f172a' : '#ffffff'
            }}
          >
            <option value="all">All Modes</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-Site</option>
            <option value="remote">Remote</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
              border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
              color: isLight ? '#0f172a' : '#ffffff'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="open">Active (Open)</option>
            <option value="closed">Closed / Archived</option>
          </select>

          <button
            onClick={onOpenPostModal}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Plus size={16} />
            <span>Post New Vacancy</span>
          </button>
        </div>
      </div>

      {/* Vacancy Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))', gap: '20px' }}>
        {filteredOpps.map(opp => {
          const appCount = applications.filter(a => a.opportunity_id === opp.id).length;
          const isOpen = (opp.status || 'open') === 'open';

          return (
            <div
              key={opp.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isLight ? '1px solid #cbd5e1' : undefined,
                opacity: isOpen ? 1 : 0.75,
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                {/* Header: Type Badge, ID, and Status Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      className={`badge ${
                        opp.discipline === 'engineering'
                          ? 'badge-sky'
                          : opp.discipline === 'commerce'
                          ? 'badge-amber'
                          : 'badge-emerald'
                      }`}
                      style={{ fontSize: '0.7rem', fontWeight: 700 }}
                    >
                      {opp.discipline === 'engineering'
                        ? '💻 B.Tech Engineering'
                        : opp.discipline === 'commerce'
                        ? '📊 Commerce & FinTech'
                        : '🩺 Healthcare & Ayush'}
                    </span>
                    <span
                      className={`badge ${
                        opp.type === 'job'
                          ? 'badge-indigo'
                          : opp.type === 'training'
                          ? 'badge-amber'
                          : 'badge-sky'
                      }`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {opp.type?.toUpperCase()}
                    </span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                      {opp.mode?.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: isOpen ? '#10b981' : '#f59e0b',
                        textTransform: 'uppercase'
                      }}
                    >
                      {isOpen ? 'Open' : 'Closed'}
                    </span>
                    <button
                      onClick={() => onToggleStatus(opp.id)}
                      title={`Mark as ${isOpen ? 'Closed' : 'Open'}`}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isOpen ? '#10b981' : '#94a3b8' }}
                    >
                      {isOpen ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    </button>
                  </div>
                </div>

                {/* Company name if present */}
                {opp.company && (
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#475569' : '#94a3b8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{opp.companyLogo || '🏢'}</span>
                    <span>{opp.company}</span>
                  </div>
                )}

                {/* Title and Category */}
                <h3 style={{ fontSize: '1.15rem', margin: '0 0 6px 0', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                  {opp.title}
                </h3>
                <div style={{ fontSize: '0.78rem', color: isLight ? '#2563eb' : '#38bdf8', fontWeight: 600, marginBottom: '10px' }}>
                  Category: {opp.category || 'Clinical & Technical'} • ID: {opp.id}
                </div>

                {/* Logistics Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} className="text-slate-400" />
                    <span>{opp.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} className="text-slate-400" />
                    <span>{opp.duration_weeks ? `${opp.duration_weeks} Wks` : 'Full-Time'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: isLight ? '#0f172a' : '#38bdf8' }}>
                    <span>💰 {opp.stipend_formatted}</span>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.82rem', color: isLight ? '#334155' : '#cbd5e1', lineHeight: 1.5, margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {opp.description}
                </p>

                {/* Required Skills Vector Pills */}
                {opp.requiredSkills && Object.keys(opp.requiredSkills).length > 0 && (
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
                      Required Competencies (Vector Weights):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {Object.entries(opp.requiredSkills).slice(0, 3).map(([skill, weight]) => (
                        <span
                          key={skill}
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)',
                            border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                            color: isLight ? '#334155' : '#e2e8f0'
                          }}
                        >
                          {skill}: <strong>{weight}%</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div
                style={{
                  borderTop: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  paddingTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                {/* Applicants Counter Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={15} className={appCount > 0 ? 'text-blue-500' : 'text-slate-400'} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isLight ? '#0f172a' : '#f8fafc' }}>
                    {appCount} {appCount === 1 ? 'Applicant' : 'Applicants'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => onScoutForOpp(opp.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.76rem', padding: '6px 10px', gap: '4px' }}
                    title="Evaluate candidate match with vector cosine algorithm"
                  >
                    <Sparkles size={13} />
                    <span>AI Scout</span>
                  </button>

                  <button
                    onClick={() => onViewApplicants(opp.id)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.76rem', padding: '6px 10px', gap: '4px' }}
                  >
                    <Eye size={13} />
                    <span>Pipeline</span>
                  </button>

                  <button
                    onClick={() => onDeleteOpportunity(opp.id)}
                    title="Delete vacancy"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOpps.length === 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '40px',
            textAlign: 'center',
            color: isLight ? '#64748b' : 'var(--text-secondary)'
          }}
        >
          <Briefcase size={36} className="mx-auto mb-3 opacity-40" />
          <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
            No vacancies match your search or filters
          </h4>
          <p style={{ margin: '6px 0 16px 0', fontSize: '0.84rem' }}>
            Try resetting your filters or post a new vacancy opportunity.
          </p>
          <button onClick={onOpenPostModal} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Post New Vacancy</span>
          </button>
        </div>
      )}
    </div>
  );
}
