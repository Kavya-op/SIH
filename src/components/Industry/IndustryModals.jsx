import React, { useState } from 'react';
import {
  X,
  Award,
  History
} from 'lucide-react';

export function PostOpportunityModal({
  isOpen,
  onClose,
  onSubmit,
  skillCategories = [],
  activeCompany,
  isLight
}) {
  const [form, setForm] = useState(() => ({
    title: '',
    company: activeCompany?.name || 'Google India R&D',
    companyLogo: activeCompany?.logo || '🌐',
    discipline: activeCompany?.discipline && activeCompany.discipline !== 'all' ? activeCompany.discipline : 'engineering',
    category: 'Software Engineering & AI',
    type: 'internship',
    mode: 'hybrid',
    location: 'Bengaluru / Hybrid',
    duration_weeks: 16,
    stipend_min: 45000,
    stipend_max: 75000,
    openings: 4,
    application_deadline: '2026-10-31',
    description: '',
    selectedSkills: [skillCategories[0] || 'Data Structures & System Design', skillCategories[1] || 'Artificial Intelligence & Machine Learning'],
    skillWeights: {
      [skillCategories[0] || 'Data Structures & System Design']: 80,
      [skillCategories[1] || 'Artificial Intelligence & Machine Learning']: 75
    }
  }));

  if (!isOpen) return null;

  const handleToggleSkill = (skill) => {
    setForm(prev => {
      const exists = prev.selectedSkills.includes(skill);
      if (exists) {
        const nextSkills = prev.selectedSkills.filter(s => s !== skill);
        const nextWeights = { ...prev.skillWeights };
        delete nextWeights[skill];
        return { ...prev, selectedSkills: nextSkills, skillWeights: nextWeights };
      } else {
        return {
          ...prev,
          selectedSkills: [...prev.selectedSkills, skill],
          skillWeights: { ...prev.skillWeights, [skill]: 70 }
        };
      }
    });
  };

  const handleWeightChange = (skill, val) => {
    setForm(prev => ({
      ...prev,
      skillWeights: { ...prev.skillWeights, [skill]: Number(val) }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return;

    onSubmit({
      title: form.title,
      company: form.company,
      companyLogo: form.companyLogo,
      discipline: form.discipline,
      category: form.category,
      type: form.type,
      mode: form.mode,
      location: form.location,
      duration_weeks: Number(form.duration_weeks) || 12,
      stipend_min: Number(form.stipend_min) || 20000,
      stipend_max: Number(form.stipend_max) || 25000,
      stipend_formatted: form.type === 'job'
        ? `₹${(Number(form.stipend_max) * 12 / 100000).toFixed(1)} LPA`
        : `₹${Number(form.stipend_max).toLocaleString()} / month`,
      openings: Number(form.openings) || 2,
      application_deadline: form.application_deadline,
      description: form.description || 'Hands-on industry opportunity for scholars.',
      requiredSkills: form.skillWeights,
      benefits: ['Industrial Certification', 'Pre-Placement Offer (PPO) Track', 'Mentorship']
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={e => e.stopPropagation()}
        style={{
          padding: '28px',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: isLight ? '#ffffff' : undefined,
          border: isLight ? '1px solid #cbd5e1' : undefined
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
              Publish Vacancy Posting (TRD §4)
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
              Configure position requirements, stipend, and skill vector weights for matching
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Position Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SDE Intern (Cloud & AI) or Equity Research Analyst"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Discipline / Branch Track *
              </label>
              <select
                value={form.discipline}
                onChange={e => setForm({ ...form, discipline: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1.5px solid #93c5fd' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff'
                }}
              >
                <option value="engineering">💻 B.Tech Engineering & AI</option>
                <option value="commerce">📊 Commerce & Management</option>
                <option value="healthcare">🩺 Healthcare & Sciences</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Role Type (ENUM)
              </label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff'
                }}
              >
                <option value="internship">Internship</option>
                <option value="job">Full-Time Job</option>
                <option value="training">Industrial Training / FDP</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Work Mode (ENUM)
              </label>
              <select
                value={form.mode}
                onChange={e => setForm({ ...form, mode: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff'
                }}
              >
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-Site</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Stipend / Package (Monthly ₹)
              </label>
              <input
                type="number"
                value={form.stipend_max}
                onChange={e => setForm({ ...form, stipend_max: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Duration (Weeks)
              </label>
              <input
                type="number"
                value={form.duration_weeks}
                onChange={e => setForm({ ...form, duration_weeks: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Openings Count
              </label>
              <input
                type="number"
                value={form.openings}
                onChange={e => setForm({ ...form, openings: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Role Scope & Responsibilities
            </label>
            <textarea
              rows={2}
              placeholder="Outline project objectives, instrumentation access, and protocols..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff'
              }}
            />
          </div>

          {/* Required Competencies Vector Selector */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
              Required Competencies & Vector Weights (% target):
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {skillCategories.map(skill => {
                const selected = form.selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    style={{
                      fontSize: '0.74rem',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: selected ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                      background: selected ? (isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.25)') : 'transparent',
                      color: selected ? '#2563eb' : (isLight ? '#64748b' : '#cbd5e1')
                    }}
                  >
                    {selected ? '✓ ' : '+ '} {skill}
                  </button>
                );
              })}
            </div>

            {/* Sliders for selected skills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {form.selectedSkills.map(skill => (
                <div
                  key={skill}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isLight ? '#0f172a' : '#fff' }}>
                    {skill}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      step="5"
                      value={form.skillWeights[skill] || 70}
                      onChange={e => handleWeightChange(skill, e.target.value)}
                      style={{ width: '100px' }}
                    />
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, minWidth: '35px', color: '#2563eb' }}>
                      {form.skillWeights[skill] || 70}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Publish to Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function StatusTransitionModal({
  isOpen,
  onClose,
  app,
  onConfirmStatus,
  isLight
}) {
  const [newStatus, setNewStatus] = useState(() => app?.status || 'shortlisted');
  const [remarks, setRemarks] = useState('');
  const [interviewDate, setInterviewDate] = useState(() => app?.interview_date || '2026-09-18 11:30 AM IST');

  if (!isOpen || !app) return null;

  const statuses = ['applied', 'shortlisted', 'interview', 'offered', 'completed', 'rejected'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmStatus(app.id, newStatus, remarks || `Transitioned to ${newStatus}`, newStatus === 'interview' ? interviewDate : null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={e => e.stopPropagation()}
        style={{
          padding: '28px',
          maxWidth: '500px',
          background: isLight ? '#ffffff' : undefined,
          border: isLight ? '1px solid #cbd5e1' : undefined
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
          <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
            Transition Application Stage
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
            Candidate: <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>{app.studentName}</strong> • {app.opportunityTitle}
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Target Stage:
            </label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff'
              }}
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {newStatus === 'interview' && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Technical Interview Date & Time:
              </label>
              <input
                type="text"
                placeholder="e.g. 2026-09-18 11:30 AM IST"
                value={interviewDate}
                onChange={e => setInterviewDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Transition Remarks (Logged to <code>application_status_history</code>):
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Candidate selected based on analytical competence and GCP trial credentials..."
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Commit Transition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CandidateDossierModal({
  isOpen,
  onClose,
  app,
  studentProfile,
  onTransitionStatus,
  isLight
}) {
  if (!isOpen || !app) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={e => e.stopPropagation()}
        style={{
          padding: '28px',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: isLight ? '#ffffff' : undefined,
          border: isLight ? '1px solid #cbd5e1' : undefined
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.2)',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}
            >
              {app.studentName.charAt(0)}
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                {app.studentName}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
                Application Dossier • ID: {app.id} • Applied on {app.applied_at?.slice(0, 10)}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Top Status & Fit Row */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)',
              border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>Target Position</div>
              <strong style={{ fontSize: '0.96rem', color: isLight ? '#0f172a' : '#ffffff' }}>{app.opportunityTitle}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-sky">{app.match_score}% Vector Fit</span>
              <span className="badge badge-teal">{app.status.toUpperCase()}</span>
            </div>
          </div>

          {/* Cover Note */}
          <div>
            <h5 style={{ fontSize: '0.84rem', margin: '0 0 6px 0', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
              Candidate Statement / Cover Note:
            </h5>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)',
                border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                fontSize: '0.84rem',
                color: isLight ? '#334155' : '#cbd5e1',
                lineHeight: 1.5,
                fontStyle: 'italic'
              }}
            >
              "{app.cover_note || 'Direct verified application via AyushSetu platform.'}"
            </div>
          </div>

          {/* Chronological Status Audit Timeline (schema application_status_history) */}
          <div>
            <h5 style={{ fontSize: '0.84rem', margin: '0 0 8px 0', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
              Application Status Audit Trail:
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(app.history || []).map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem'
                  }}
                >
                  <div>
                    <span className="badge badge-sky" style={{ fontSize: '0.68rem', marginRight: '8px' }}>
                      {h.new_status?.toUpperCase()}
                    </span>
                    <span style={{ color: isLight ? '#334155' : '#cbd5e1' }}>{h.remarks}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                    {h.changed_at}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => onTransitionStatus(app)}
              className="btn btn-primary btn-sm"
              style={{ gap: '6px' }}
            >
              <History size={14} />
              <span>Update Application Stage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IssueCredentialModal({
  isOpen,
  onClose,
  app,
  onIssueCredential,
  isLight
}) {
  const [credType, setCredType] = useState('internship_completion');
  const [credTitle, setCredTitle] = useState(() =>
    app ? `Certificate of Industrial Training in ${app.opportunityTitle}` : 'Certificate of Excellence'
  );
  const [credIssuer, setCredIssuer] = useState('Himalaya Wellness R&D Directorate');

  if (!isOpen || !app) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onIssueCredential(app.student_id, {
      type: credType,
      title: credTitle,
      issuer: credIssuer,
      badge: credType === 'internship_completion' ? 'Industrial Training Completed' : 'Formal Offer Extended'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={e => e.stopPropagation()}
        style={{
          padding: '28px',
          maxWidth: '520px',
          background: isLight ? '#ffffff' : undefined,
          border: isLight ? '1px solid #cbd5e1' : undefined
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} className="text-blue-600" />
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
              Issue Verifiable Digital Credential
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
            Recipient: <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>{app.studentName}</strong> (ID: {app.student_id})
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Credential Type
            </label>
            <select
              value={credType}
              onChange={e => setCredType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff'
              }}
            >
              <option value="internship_completion">Certificate of Industrial Internship Completion</option>
              <option value="certificate">Official Pre-Placement Offer (PPO) Letter</option>
              <option value="achievement">Special Merit Recognition Certificate</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Credential Title
            </label>
            <input
              type="text"
              required
              value={credTitle}
              onChange={e => setCredTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Issuing Organization / Authority
            </label>
            <input
              type="text"
              required
              value={credIssuer}
              onChange={e => setCredIssuer(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff'
              }}
            />
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              fontSize: '0.78rem',
              color: isLight ? '#065f46' : '#6ee7b7'
            }}
          >
            🔒 Credential is automatically issued with a cryptographically verifiable SHA256 signature and pushed immediately to the candidate's public Digital Portfolio.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Issue & Sync to Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewChallengeModal({
  isOpen,
  onClose,
  onSubmit,
  isLight
}) {
  const [form, setForm] = useState({
    title: '',
    category: 'Bioavailability & Formulation',
    domain: 'Ayurvedic Formulations & Drug Delivery',
    prize_pool: '₹3,00,000 + R&D Incubation',
    deadline: '2026-11-20',
    problem_statement: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return;
    onSubmit({
      ...form,
      company: 'Himalaya Wellness Company',
      companyLogo: '🌿'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={e => e.stopPropagation()}
        style={{
          padding: '28px',
          maxWidth: '540px',
          background: isLight ? '#ffffff' : undefined,
          border: isLight ? '1px solid #cbd5e1' : undefined
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
          <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
            Launch Innovation Hackathon (PRD §5.4)
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Challenge Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AI-Assisted Phytochemical Fingerprinting Hackathon"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Prize Pool & Grants
              </label>
              <input
                type="text"
                value={form.prize_pool}
                onChange={e => setForm({ ...form, prize_pool: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                  color: isLight ? '#0f172a' : '#fff'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Submission Deadline
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Problem Statement & Deliverables
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe the research bottleneck and expected deliverables from student teams..."
              value={form.problem_statement}
              onChange={e => setForm({ ...form, problem_statement: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Launch Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
