import React, { useState } from 'react';
import {
  Plus,
  Users,
  Calendar,
  ExternalLink,
  Star
} from 'lucide-react';

export default function InnovationHub({
  innovationChallenges = [],
  facultyOpps = [],
  onOpenNewChallengeModal,
  onGradeSubmission,
  isLight
}) {
  const [activeSubTab, setActiveSubTab] = useState('challenges'); // 'challenges' | 'submissions' | 'joint_rd'
  const [selectedChallengeForGrade, setSelectedChallengeForGrade] = useState(null);
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Collect all submissions across challenges
  const allSubmissions = innovationChallenges.flatMap(c =>
    (c.submissions || []).map(s => ({ ...s, challengeTitle: c.title, challengeId: c.id }))
  );

  const handleConfirmGrade = (e) => {
    e.preventDefault();
    if (!selectedChallengeForGrade) return;
    onGradeSubmission(
      selectedChallengeForGrade.challengeId,
      selectedChallengeForGrade.id,
      Number(gradeScore),
      gradeFeedback || 'Exemplary execution and methodology.'
    );
    setSelectedChallengeForGrade(null);
    setGradeFeedback('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Sub-navigation tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '4px',
            borderRadius: '12px',
            background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.05)',
            border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)'
          }}
        >
          <button
            onClick={() => setActiveSubTab('challenges')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: activeSubTab === 'challenges' ? (isLight ? '#fff' : '#2563eb') : 'transparent',
              color: activeSubTab === 'challenges' ? (isLight ? '#2563eb' : '#fff') : (isLight ? '#475569' : '#94a3b8'),
              boxShadow: activeSubTab === 'challenges' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            🏆 Sponsored Hackathons & Challenges ({innovationChallenges.length})
          </button>

          <button
            onClick={() => setActiveSubTab('submissions')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: activeSubTab === 'submissions' ? (isLight ? '#fff' : '#2563eb') : 'transparent',
              color: activeSubTab === 'submissions' ? (isLight ? '#2563eb' : '#fff') : (isLight ? '#475569' : '#94a3b8'),
              boxShadow: activeSubTab === 'submissions' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            📝 Team Submissions ({allSubmissions.length})
          </button>

          <button
            onClick={() => setActiveSubTab('joint_rd')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: activeSubTab === 'joint_rd' ? (isLight ? '#fff' : '#2563eb') : 'transparent',
              color: activeSubTab === 'joint_rd' ? (isLight ? '#2563eb' : '#fff') : (isLight ? '#475569' : '#94a3b8'),
              boxShadow: activeSubTab === 'joint_rd' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            🤝 Faculty Joint R&D & FDPs ({facultyOpps.length})
          </button>
        </div>

        <button
          onClick={onOpenNewChallengeModal}
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
        >
          <Plus size={16} />
          <span>Launch Innovation Hackathon</span>
        </button>
      </div>

      {/* SUBTAB 1: HACKATHONS LISTING */}
      {activeSubTab === 'challenges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {innovationChallenges.map(chn => (
            <div
              key={chn.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isLight ? '1px solid #cbd5e1' : undefined
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      className={`badge ${
                        chn.discipline === 'engineering'
                          ? 'badge-sky'
                          : chn.discipline === 'commerce'
                          ? 'badge-amber'
                          : 'badge-emerald'
                      }`}
                      style={{ fontSize: '0.7rem', fontWeight: 700 }}
                    >
                      {chn.discipline === 'engineering'
                        ? '💻 B.Tech Engineering'
                        : chn.discipline === 'commerce'
                        ? '📊 Commerce & FinTech'
                        : '🩺 Healthcare'}
                    </span>
                    <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>{chn.category}</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                    ID: {chn.id}
                  </span>
                </div>

                {/* Company info */}
                {chn.company && (
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isLight ? '#475569' : '#94a3b8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{chn.companyLogo || '🏆'}</span>
                    <span>{chn.company}</span>
                  </div>
                )}

                <h3 style={{ fontSize: '1.15rem', margin: '0 0 8px 0', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                  {chn.title}
                </h3>

                <div style={{ fontSize: '0.82rem', color: isLight ? '#2563eb' : '#38bdf8', fontWeight: 600, marginBottom: '12px' }}>
                  💰 Prize & Support: {chn.prize_pool}
                </div>

                <p style={{ fontSize: '0.84rem', color: isLight ? '#334155' : '#cbd5e1', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  {chn.problem_statement}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.78rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    <span>Deadline: {chn.deadline}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={13} />
                    <span>{(chn.submissions || []).length} Teams Submitted</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  paddingTop: '16px',
                  marginTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                  Active Submission Window
                </span>

                <button
                  onClick={() => setActiveSubTab('submissions')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  Review Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: SUBMISSIONS EVALUATION */}
      {activeSubTab === 'submissions' && (
        <div className="glass-panel" style={{ padding: '24px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
              Student Innovation Submissions & Code Repositories
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
              Evaluate student research team deliverables and assign scores
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {allSubmissions.map(sub => (
              <div
                key={sub.id}
                style={{
                  padding: '18px 20px',
                  borderRadius: '10px',
                  background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                      {sub.teamName}
                    </h4>
                    <span className="badge badge-sky" style={{ fontSize: '0.7rem' }}>
                      Lead: {sub.leadStudent}
                    </span>
                    <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                      {sub.institution}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-muted)', marginTop: '2px' }}>
                    Challenge: <strong>{sub.challengeTitle}</strong> • Submitted on {sub.submittedAt}
                  </div>

                  <p style={{ fontSize: '0.84rem', color: isLight ? '#334155' : '#cbd5e1', lineHeight: 1.5, margin: '8px 0 10px 0' }}>
                    "{sub.abstract}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <a
                      href={sub.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Inspect Repository / Code</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Score & Evaluation Action */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  {sub.score ? (
                    <div
                      style={{
                        padding: '6px 14px',
                        borderRadius: '10px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid #10b981',
                        color: '#10b981',
                        fontWeight: 800,
                        fontSize: '0.9rem'
                      }}
                    >
                      Score: {sub.score} / 100
                    </div>
                  ) : (
                    <span className="badge badge-amber">Awaiting Review</span>
                  )}

                  <button
                    onClick={() => {
                      setSelectedChallengeForGrade(sub);
                      setGradeScore(sub.score || 90);
                      setGradeFeedback(sub.feedback || '');
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.76rem', gap: '4px' }}
                  >
                    <Star size={13} />
                    <span>{sub.score ? 'Update Evaluation' : 'Score Submission'}</span>
                  </button>
                </div>
              </div>
            ))}

            {allSubmissions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
                No student team submissions recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: JOINT FACULTY R&D & FDPs */}
      {activeSubTab === 'joint_rd' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {facultyOpps.map(collab => (
            <div
              key={collab.id}
              className="glass-panel"
              style={{
                padding: '24px',
                border: isLight ? '1px solid #cbd5e1' : undefined,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge badge-teal">{collab.type?.toUpperCase()}</span>
                  <span style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                    ID: {collab.id}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', margin: '0 0 8px 0', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                  {collab.title}
                </h4>

                <div style={{ fontSize: '0.82rem', color: isLight ? '#2563eb' : '#38bdf8', fontWeight: 600, marginBottom: '10px' }}>
                  Fellowship / Grant: {collab.stipendOrGrant}
                </div>

                <p style={{ fontSize: '0.84rem', color: isLight ? '#334155' : '#cbd5e1', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                  {collab.description}
                </p>

                <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-muted)', marginBottom: '8px' }}>
                  Faculty Registrations: <strong>{collab.appliedFacultyCount}</strong> / {collab.capacity} Seats
                </div>
              </div>

              <div
                style={{
                  borderTop: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  paddingTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span className="badge badge-emerald">Partnered Institutional R&D</span>
                <span style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                  Active MoU Track
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grade Submission Modal */}
      {selectedChallengeForGrade && (
        <div className="modal-overlay" onClick={() => setSelectedChallengeForGrade(null)}>
          <div
            className="modal-content glass-panel"
            onClick={e => e.stopPropagation()}
            style={{
              padding: '28px',
              maxWidth: '520px',
              background: isLight ? '#ffffff' : undefined,
              border: isLight ? '1px solid #e2e8f0' : undefined
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                Score Project Submission
              </h3>
              <button onClick={() => setSelectedChallengeForGrade(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleConfirmGrade} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                Team: <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>{selectedChallengeForGrade.teamName}</strong> ({selectedChallengeForGrade.institution})
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Score (0 to 100):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradeScore}
                  onChange={e => setGradeScore(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                    border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                    color: isLight ? '#0f172a' : '#fff'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Technical Review & Evaluation Remarks:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Robust model architecture with verified HPLC correlation..."
                  value={gradeFeedback}
                  onChange={e => setGradeFeedback(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                    border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                    color: isLight ? '#0f172a' : '#fff'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setSelectedChallengeForGrade(null)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Commit Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
