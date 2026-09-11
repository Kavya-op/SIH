import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { ASSESSMENT_QUESTIONS } from '../../data/mockData';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

export default function SkillAssessmentModal({ isOpen, onClose }) {
  const { studentProfile, updateStudentAssessment, theme } = useApp();
  const isLight = theme === 'light';
  const [selectedTrack, setSelectedTrack] = useState(() => studentProfile.discipline || 'engineering');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultSummary, setResultSummary] = useState(null);

  if (!isOpen) return null;

  const trackQuestions = ASSESSMENT_QUESTIONS.filter(q => selectedTrack === 'all' || q.track === selectedTrack);
  const activeQuestions = trackQuestions.length > 0 ? trackQuestions : ASSESSMENT_QUESTIONS;
  const currentQ = activeQuestions[currentIdx] || activeQuestions[0];
  const totalQuestions = activeQuestions.length;
  const answeredCount = Object.keys(answers).filter(id => activeQuestions.some(q => q.id === id)).length;

  const handleSelectTrack = (track) => {
    setSelectedTrack(track);
    setCurrentIdx(0);
    setAnswers({});
    setIsCompleted(false);
    setResultSummary(null);
  };

  const handleSelectOption = (optionIdx) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate results
    let correctCount = 0;
    const categoryScores = {};

    activeQuestions.forEach(q => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;

      // Update skill map
      const currentSkillLevel = (studentProfile?.skills && studentProfile.skills[q.skillMap]) || 60;
      const newScore = isCorrect
        ? Math.min(95, currentSkillLevel + 15)
        : Math.max(45, currentSkillLevel - 5);

      categoryScores[q.skillMap] = newScore;
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);

    const updatedSkills = {
      ...(studentProfile?.skills || {}),
      ...categoryScores
    };

    const skillVals = Object.values(updatedSkills);
    const newReadiness = Math.round(skillVals.reduce((a, b) => a + b, 0) / skillVals.length);

    setResultSummary({
      correctCount,
      totalQuestions,
      percentage,
      newReadiness,
      updatedSkills
    });

    setIsCompleted(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }

    updateStudentAssessment(updatedSkills, newReadiness);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={e => e.stopPropagation()}
        style={{ padding: '32px', background: isLight ? '#ffffff' : undefined, border: isLight ? '1px solid #cbd5e1' : undefined }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.2)',
              color: isLight ? '#2563eb' : '#38bdf8',
              padding: '6px',
              borderRadius: '8px'
            }}>
              <Award size={20} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: isLight ? '#0f172a' : '#ffffff' }}>
                {isCompleted ? 'Assessment Evaluation Completed' : 'Multidisciplinary Skill Diagnostic Test'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                {isCompleted
                  ? 'Your verified profile and opportunity recommendations have been recalibrated.'
                  : `Question ${currentIdx + 1} of ${totalQuestions} • Module: ${currentQ?.category}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: isLight ? '#475569' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Track Selector Bar */}
        {!isCompleted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-muted)', fontWeight: 600 }}>Select Branch Track:</span>
            {[
              { id: 'engineering', label: '💻 B.Tech Engineering & AI' },
              { id: 'commerce', label: '📊 Commerce & Finance' },
              { id: 'healthcare', label: '🩺 Healthcare & Life Sciences' },
              { id: 'all', label: '🌐 All Tracks' }
            ].map(track => (
              <button
                key={track.id}
                type="button"
                onClick={() => handleSelectTrack(track.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedTrack === track.id ? '1.5px solid #2563eb' : (isLight ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)'),
                  background: selectedTrack === track.id ? (isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.25)') : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)'),
                  color: selectedTrack === track.id ? '#2563eb' : (isLight ? '#475569' : '#cbd5e1')
                }}
              >
                {track.label}
              </button>
            ))}
          </div>
        )}

        {!isCompleted ? (
          <div>
            {/* Progress Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-muted)', marginBottom: '6px' }}>
                <span>Answered: {answeredCount} / {totalQuestions}</span>
                <span>{Math.round((answeredCount / totalQuestions) * 100)}% Completed</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Box */}
            <div style={{
              background: isLight ? '#f8fafc' : 'var(--bg-surface-elevated)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)',
              marginBottom: '24px'
            }}>
              <span className="badge badge-teal" style={{ marginBottom: '12px' }}>
                {currentQ.category}
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5, color: isLight ? '#0f172a' : '#f8fafc' }}>
                {currentQ.question}
              </h4>
            </div>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected
                        ? (isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.18)')
                        : (isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.03)'),
                      border: isSelected
                        ? `2px solid ${isLight ? '#2563eb' : '#3b82f6'}`
                        : (isLight ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)'),
                      color: isLight ? '#0f172a' : (isSelected ? '#ffffff' : 'var(--text-secondary)'),
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: isSelected ? '#2563eb' : (isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)'),
                      color: isSelected ? '#ffffff' : (isLight ? '#1e293b' : '#cbd5e1')
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: '0.92rem', flex: 1, fontWeight: isSelected ? 600 : 400 }}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="btn btn-secondary btn-sm"
                style={{ opacity: currentIdx === 0 ? 0.4 : 1, cursor: currentIdx === 0 ? 'not-allowed' : 'pointer' }}
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              {currentIdx < totalQuestions - 1 ? (
                <button
                  onClick={handleNext}
                  className="btn btn-primary btn-sm"
                >
                  Next Question
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount < totalQuestions}
                  className="btn btn-primary"
                  style={{
                    background: answeredCount === totalQuestions
                      ? 'linear-gradient(135deg, #2563eb, #0ea5e9)'
                      : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 0 16px rgba(37, 99, 235, 0.45)'
                  }}
                >
                  <Sparkles size={16} />
                  Submit Diagnostic Evaluation
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results View */
          <div>
            <div style={{
              textAlign: 'center',
              padding: '24px',
              background: isLight ? '#eff6ff' : 'linear-gradient(180deg, rgba(37, 99, 235, 0.18) 0%, rgba(10, 16, 30, 0) 100%)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '24px',
              border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.25)'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: isLight ? '#dbeafe' : 'rgba(37, 99, 235, 0.2)',
                color: '#2563eb',
                marginBottom: '12px'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: isLight ? '#0f172a' : '#f8fafc', marginBottom: '6px' }}>
                Evaluation Score: {resultSummary?.percentage}%
              </h3>
              <p style={{ color: isLight ? '#334155' : 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Answered {resultSummary?.correctCount} of {resultSummary?.totalQuestions} questions correctly.
                Your institutional readiness index improved to <strong style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>{resultSummary?.newReadiness}%</strong>.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: isLight ? '#0f172a' : '#e2e8f0' }}>
                Recalibrated Competency Levels:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {Object.entries(resultSummary?.updatedSkills || {}).map(([skill, val]) => (
                  <div
                    key={skill}
                    style={{
                      background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span style={{ color: isLight ? '#0f172a' : '#cbd5e1', fontWeight: 600 }}>{skill}</span>
                      <span style={{ color: isLight ? '#1d4ed8' : (val >= 75 ? '#38bdf8' : val >= 60 ? '#60a5fa' : '#93c5fd'), fontWeight: 700 }}>
                        {val}%
                      </span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '5px' }}>
                      <div className="progress-bar-fill" style={{ width: `${val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              View Updated Opportunity Matches & Radar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
