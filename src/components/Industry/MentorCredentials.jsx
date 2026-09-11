import React, { useState } from 'react';
import {
  Star,
  Award,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Send,
  Sparkles,
  ExternalLink,
  Users
} from 'lucide-react';

export default function MentorCredentials({
  applications = [],
  onSubmitFeedback,
  onOpenCredentialModal,
  isLight
}) {
  const [feedbackApp, setFeedbackApp] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Laboratory & Clinical Rigor');
  const [feedbackText, setFeedbackText] = useState('');

  const reviewedApps = applications.filter(a => a.feedback);

  const handleConfirmFeedback = (e) => {
    e.preventDefault();
    if (!feedbackApp) return;

    onSubmitFeedback(feedbackApp.id, feedbackRating, feedbackText);
    setFeedbackApp(null);
    setFeedbackText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          border: isLight ? '1px solid #cbd5e1' : undefined
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} className="text-blue-600 dark:text-sky-400" />
            <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
              Mentor Evaluations & Verifiable Digital Credentials
            </h3>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
            Structured industry mentor competency reviews (TRD §4) and tamper-verifiable digital credentials issued directly to student portfolios.
          </p>
        </div>

        <button
          onClick={() => {
            const firstOffered = applications.find(a => a.status === 'offered' || a.status === 'completed') || applications[0];
            if (firstOffered) onOpenCredentialModal(firstOffered);
          }}
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
        >
          <ShieldCheck size={16} />
          <span>Issue Verifiable Certificate / Offer</span>
        </button>
      </div>

      {/* 2-Column: Active Candidates for Evaluation + Issued Reviews Archive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Column: Candidates Awaiting / Eligible for Evaluation */}
        <div className="glass-panel" style={{ padding: '24px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <h4 style={{ fontSize: '1.1rem', margin: '0 0 4px 0', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
            Active Scholars in Pipeline
          </h4>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
            Log formal 1-5 star reviews or dispatch verified credentials
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applications.slice(0, 5).map(app => (
              <div
                key={app.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '0.94rem', color: isLight ? '#0f172a' : '#ffffff' }}>
                      {app.studentName}
                    </strong>
                    <span className="badge badge-sky" style={{ fontSize: '0.68rem' }}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-muted)', marginTop: '2px' }}>
                    {app.opportunityTitle}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => {
                      setFeedbackApp(app);
                      setFeedbackRating(app.feedback?.rating || 5);
                      setFeedbackText(app.feedback?.text || '');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem', padding: '6px 10px', gap: '4px' }}
                  >
                    <Star size={12} />
                    <span>Review</span>
                  </button>

                  <button
                    onClick={() => onOpenCredentialModal(app)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.74rem', padding: '6px 10px', gap: '4px' }}
                  >
                    <Award size={12} />
                    <span>Issue</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recorded Mentor Reviews Archive */}
        <div className="glass-panel" style={{ padding: '24px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <h4 style={{ fontSize: '1.1rem', margin: '0 0 4px 0', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
            Logged Mentor Evaluations ({reviewedApps.length})
          </h4>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
            Recorded in <code>mentor_feedback</code> table
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reviewedApps.map(app => (
              <div
                key={app.id}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                      {app.studentName}
                    </h5>
                    <div style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                      Role: {app.opportunityTitle}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 800 }}>
                    <Star size={16} fill="#d97706" />
                    <span>{app.feedback.rating} / 5</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.84rem', color: isLight ? '#334155' : '#cbd5e1', marginTop: '10px', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "{app.feedback.text}"
                </div>

                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                  <span>Verified Mentor Evaluation</span>
                  <span style={{ color: isLight ? '#2563eb' : '#38bdf8', fontWeight: 600 }}>Sync: Digital Portfolio</span>
                </div>
              </div>
            ))}

            {reviewedApps.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
                No mentor evaluations recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review / Feedback Modal */}
      {feedbackApp && (
        <div className="modal-overlay" onClick={() => setFeedbackApp(null)}>
          <div
            className="modal-content glass-panel"
            onClick={e => e.stopPropagation()}
            style={{
              padding: '28px',
              maxWidth: '500px',
              background: isLight ? '#ffffff' : undefined,
              border: isLight ? '1px solid #e2e8f0' : undefined
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                Record Industry Mentor Evaluation
              </h3>
              <button onClick={() => setFeedbackApp(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleConfirmFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                Candidate: <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>{feedbackApp.studentName}</strong> • {feedbackApp.opportunityTitle}
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Rating (1 to 5 Stars):
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setFeedbackRating(r)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: feedbackRating >= r ? '1.5px solid #3b82f6' : '1px solid var(--border-medium)',
                        background: feedbackRating >= r ? (isLight ? '#eff6ff' : 'rgba(37,99,235,0.25)') : 'transparent',
                        color: feedbackRating >= r ? '#2563eb' : (isLight ? '#64748b' : '#94a3b8'),
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700
                      }}
                    >
                      <Star size={14} fill={feedbackRating >= r ? '#2563eb' : 'none'} />
                      <span>{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Evaluation Rubric & Competency Observations:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Evaluate technical competence, protocol rigor, analytical accuracy..."
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
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
                <button type="button" onClick={() => setFeedbackApp(null)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
