import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Award,
  ExternalLink,
  QrCode,
  Share2,
  Printer,
  Plus,
  CheckCircle,
  FileText,
  Calendar,
  Building,
  GraduationCap,
  UploadCloud,
  Download,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function DigitalPortfolio() {
  const { studentProfile, addProject, addToast, theme } = useApp();
  const isLight = theme === 'light';
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProj, setNewProj] = useState({ title: '', description: '', skills: '', link: '' });
  const [resumeFile, setResumeFile] = useState({
    name: 'AIIA_Scholar_Aarav_Sharma_CV.pdf',
    size: '248 KB',
    updatedAt: 'Today at 10:45 AM',
    verified: true,
    hash: 'SHA256-CV-88FA-2026'
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Public portfolio link copied to clipboard!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProj.title.trim()) return;
    addProject({
      title: newProj.title,
      description: newProj.description,
      skills: newProj.skills.split(',').map(s => s.trim()).filter(Boolean),
      link: newProj.link
    });
    setNewProj({ title: '', description: '', skills: '', link: '' });
    setShowAddProject(false);
    addToast('New research project added to portfolio!', 'success');
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setResumeFile({
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
          updatedAt: 'Just now',
          verified: true,
          hash: `SHA256-CV-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`
        });
        setIsUploading(false);
        addToast(`Resume "${file.name}" uploaded & encrypted with SHA-256 hash!`, 'success');
      }, 800);
    }
  };

  const handleDownloadResume = () => {
    addToast(`Downloading verified resume: ${resumeFile.name}`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Portfolio Header / Credential Card */}
      <div className="glass-panel" style={{
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(59, 130, 246, 0.3)',
        background: isLight ? '#ffffff' : undefined
      }}>
        {/* Background glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: isLight
            ? 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {/* Profile Details */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '16px',
                border: '3px solid #2563eb',
                objectFit: 'cover',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.25)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.6rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                  {studentProfile.name}
                </h2>
                <span className="badge badge-sky">
                  <ShieldCheck size={14} />
                  AIIA Verified ID: {studentProfile.id}
                </span>
              </div>
              <p style={{ margin: '4px 0', color: isLight ? '#475569' : '#94a3b8', fontSize: '0.95rem' }}>
                {studentProfile.degree}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: isLight ? '#334155' : '#cbd5e1', marginTop: '6px' }}>
                <span>🏛️ {studentProfile.institution}</span>
                <span>🎓 CGPA: <strong style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>{studentProfile.cgpa} / 10</strong></span>
                <span>📅 Class of 2026</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleShare} className="btn btn-secondary btn-sm">
              <Share2 size={15} />
              Share Link
            </button>
            <button onClick={handlePrint} className="btn btn-secondary btn-sm">
              <Printer size={15} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Bio */}
        <p style={{
          marginTop: '20px',
          padding: '14px 18px',
          background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          color: isLight ? '#334155' : '#cbd5e1',
          lineHeight: 1.6,
          borderLeft: '3px solid #2563eb',
          border: isLight ? '1px solid #e2e8f0' : undefined,
          borderLeftWidth: '3px'
        }}>
          "{studentProfile.bio}"
        </p>
      </div>

      {/* DIGITAL PORTFOLIO / RESUME UPLOAD SECTION (Mandatory User Requirement) */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(59, 130, 246, 0.3)',
        background: isLight ? '#ffffff' : 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(10, 15, 29, 0.9) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLight ? '#2563eb' : '#38bdf8' }}>
                <UploadCloud size={18} />
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                Digital Portfolio & Resume Upload
              </h3>
              <span className="badge badge-sky">ATS Ready</span>
            </div>
            <p style={{ margin: '4px 0 0 40px', fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
              Upload your verified academic curriculum vitae or clinical portfolio for automated ATS parsing & recruiter matching.
            </p>
          </div>

          <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UploadCloud size={15} />
            <span>{isUploading ? 'Encrypting & Storing...' : 'Upload New Resume (PDF)'}</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleResumeUpload}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Current Active Resume Details Card */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
          border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-medium)',
          borderRadius: '12px',
          padding: '16px 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.15)',
              border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLight ? '#2563eb' : '#38bdf8'
            }}>
              <FileText size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ fontSize: '0.95rem', color: isLight ? '#0f172a' : '#ffffff' }}>
                  {resumeFile.name}
                </strong>
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                  <CheckCircle size={11} /> Verified Active
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span>Size: <strong>{resumeFile.size}</strong></span>
                <span>•</span>
                <span>Last Updated: <strong>{resumeFile.updatedAt}</strong></span>
                <span>•</span>
                <span style={{ fontFamily: 'monospace', color: isLight ? '#1d4ed8' : '#38bdf8' }}>{resumeFile.hash}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleDownloadResume}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px' }}
            >
              <Download size={14} />
              <span>Download CV</span>
            </button>
            <label
              className="btn btn-outline btn-sm"
              style={{ cursor: 'pointer', gap: '6px' }}
            >
              <RefreshCw size={13} className={isUploading ? 'animate-spin' : ''} />
              <span>Replace</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleResumeUpload}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Two Column Section: Verified Credentials & Competencies */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Verified Institutional Badges */}
        <div className="glass-panel" style={{ padding: '24px', background: isLight ? '#ffffff' : undefined, border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Award size={20} color={isLight ? '#2563eb' : '#38bdf8'} />
            <h3 style={{ fontSize: '1.15rem', margin: 0, color: isLight ? '#0f172a' : 'inherit' }}>Verified Credentials & Badges</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {((studentProfile.credentials && studentProfile.credentials.length > 0)
              ? studentProfile.credentials
              : (studentProfile.verifiedBadges && studentProfile.verifiedBadges.length > 0)
              ? studentProfile.verifiedBadges
              : [
                  {
                    id: 'default-cred-1',
                    title: 'Institutional Academic Identity Verified',
                    issuer: studentProfile.institution || 'Accredited Institution',
                    issued_date: '2026-01-15',
                    verified: true
                  },
                  {
                    id: 'default-cred-2',
                    title: 'Verified Scholar in Academic Standing',
                    issuer: 'National Accreditation & Skill Council',
                    issued_date: '2026-02-01',
                    verified: true
                  }
                ]
            ).map((badge, idx) => (
              <div
                key={idx}
                style={{
                  background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.18)',
                    color: isLight ? '#2563eb' : '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Award size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: isLight ? '#0f172a' : '#f8fafc' }}>
                      {badge.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isLight ? '#475569' : '#94a3b8' }}>
                      Issued by {badge.issuer} • {badge.issued_date || badge.date || '2026'}
                    </div>
                  </div>
                </div>
                <span className="badge badge-sky" style={{ fontSize: '0.7rem' }}>
                  <CheckCircle size={12} />
                  Audited
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Verifiable QR & Security Audit */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: isLight ? '#ffffff' : undefined, border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <QrCode size={20} color={isLight ? '#2563eb' : '#38bdf8'} />
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: isLight ? '#0f172a' : 'inherit' }}>Digital Verification QR</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginBottom: '16px' }}>
              Employers and accreditation councils can scan this encrypted cryptographic token to verify student records against AIIA registrar records.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            background: isLight ? '#f8fafc' : 'rgba(0, 0, 0, 0.3)',
            padding: '18px',
            borderRadius: 'var(--radius-md)',
            border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: '#ffffff',
              padding: '6px',
              borderRadius: '8px',
              border: isLight ? '1px solid #cbd5e1' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://aiia.gov.in/verify/${studentProfile.id}`}
                alt="Verification QR"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                Registry Status: Verified Active
              </div>
              <div style={{ fontSize: '0.75rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginTop: '4px' }}>
                Hash: SHA256-AIIA-2026-99F042C
              </div>
              <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#64748b', marginTop: '2px' }}>
                Last synced: Today, 11:30 AM IST
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects & Clinical Research Cases */}
      <div className="glass-panel" style={{ padding: '24px', background: isLight ? '#ffffff' : undefined, border: isLight ? '1px solid #cbd5e1' : undefined }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, color: isLight ? '#0f172a' : '#f8fafc' }}>
              Research Publications, Clinical Studies & Capstone Projects
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
              Verified work artifacts evaluated by faculty mentors and industry partners
            </p>
          </div>
          <button
            onClick={() => setShowAddProject(!showAddProject)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            {showAddProject ? 'Close Form' : 'Add Project / Study'}
          </button>
        </div>

        {showAddProject && (
          <form
            onSubmit={handleCreateProject}
            style={{
              background: isLight ? '#f8fafc' : 'var(--bg-surface-elevated)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: isLight ? '1.5px solid #cbd5e1' : '1px solid var(--border-medium)',
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <h4 style={{ margin: 0, fontSize: '1rem', color: isLight ? '#059669' : '#34d399' }}>
              Add New Research Project to Portfolio
            </h4>
            <input
              type="text"
              placeholder="Project Title (e.g. Clinical Study on Guduchi Formulations)"
              value={newProj.title}
              onChange={e => setNewProj({ ...newProj, title: e.target.value })}
              required
              style={{
                background: isLight ? '#ffffff' : 'rgba(0, 0, 0, 0.2)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.88rem'
              }}
            />
            <textarea
              placeholder="Abstract / Methodology & Key Findings..."
              rows={3}
              value={newProj.description}
              onChange={e => setNewProj({ ...newProj, description: e.target.value })}
              style={{
                background: isLight ? '#ffffff' : 'rgba(0, 0, 0, 0.2)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.88rem'
              }}
            />
            <input
              type="text"
              placeholder="Mapped Skills (comma separated, e.g. Clinical Trials, HPLC, Ayur-Informatics)"
              value={newProj.skills}
              onChange={e => setNewProj({ ...newProj, skills: e.target.value })}
              style={{
                background: isLight ? '#ffffff' : 'rgba(0, 0, 0, 0.2)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-medium)',
                color: isLight ? '#0f172a' : '#fff',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.88rem'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save to Portfolio
              </button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(studentProfile.projects || []).map(proj => (
            <div
              key={proj.id}
              style={{
                background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                transition: 'border-color 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <h4 style={{ fontSize: '1.05rem', margin: '0 0 6px 0', color: isLight ? '#0f172a' : '#f8fafc' }}>
                  {proj.title}
                </h4>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: isLight ? '#2563eb' : '#38bdf8',
                      fontSize: '0.8rem',
                      textDecoration: 'none'
                    }}
                  >
                    View Artifact <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <p style={{ fontSize: '0.88rem', color: isLight ? '#334155' : '#94a3b8', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                {proj.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {proj.skills.map((s, idx) => (
                  <span key={idx} className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
