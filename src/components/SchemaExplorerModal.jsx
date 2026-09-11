import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, Code2, Cpu, X, Check, Copy, ExternalLink } from 'lucide-react';

export default function SchemaExplorerModal({ isOpen, onClose }) {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState('schema'); // 'schema' | 'algorithm' | 'api'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const tables = [
    {
      name: 'users',
      purpose: 'Core authentication & identity (RBAC)',
      columns: ['id (UUID PK)', 'email (VARCHAR)', 'role (user_role ENUM)', 'institution_id (FK)', 'industry_id (FK)', 'is_verified (BOOLEAN)']
    },
    {
      name: 'student_profiles',
      purpose: '1:1 Student extension with academic records',
      columns: ['user_id (UUID PK/FK)', 'enrollment_no', 'department', 'course', 'year_of_study', 'graduation_year', 'cgpa', 'resume_url']
    },
    {
      name: 'skills',
      purpose: 'Taxonomy of technical & soft competencies',
      columns: ['id (UUID PK)', 'name (VARCHAR UNIQUE)', 'category (skill_category ENUM)', 'industry_tags (TEXT[])']
    },
    {
      name: 'skill_scores',
      purpose: 'Proficiency levels with auto-generated gaps',
      columns: ['id (UUID PK)', 'student_id (FK)', 'skill_id (FK)', 'proficiency_score (0-100)', 'benchmark_score (0-100)', 'gap (GENERATED ALWAYS)']
    },
    {
      name: 'opportunities',
      purpose: 'Internships, Jobs, & Industrial Training postings',
      columns: ['id (UUID PK)', 'industry_id (FK)', 'type (opportunity_type)', 'mode (opportunity_mode)', 'duration_weeks', 'stipend_min / max', 'status']
    },
    {
      name: 'applications',
      purpose: 'Student-to-opportunity pipeline records',
      columns: ['id (UUID PK)', 'student_id (FK)', 'opportunity_id (FK)', 'match_score (NUMERIC)', 'status (application_status ENUM)', 'mentor_id (FK)']
    },
    {
      name: 'application_status_history',
      purpose: 'Audit trail for ATS pipeline transitions',
      columns: ['id (UUID PK)', 'application_id (FK)', 'old_status', 'new_status', 'remarks (TEXT)', 'changed_at (TIMESTAMPTZ)']
    },
    {
      name: 'credentials',
      purpose: 'Verified portfolio documents & achievements',
      columns: ['id (UUID PK)', 'student_id (FK)', 'type (credential_type ENUM)', 'title', 'file_url', 'verified (BOOLEAN)', 'verified_by (FK)']
    },
    {
      name: 'collaboration_listings',
      purpose: 'Academician-industry FDPs, R&D & consultancies',
      columns: ['id (UUID PK)', 'type (collaboration_type ENUM)', 'title', 'posted_by_industry_id (FK)', 'mode', 'capacity', 'status']
    },
    {
      name: 'audit_logs',
      purpose: 'Security audit trail for sensitive actions',
      columns: ['id (UUID PK)', 'actor_id (FK)', 'action (VARCHAR)', 'entity_type', 'entity_id', 'ip_address (INET)', 'created_at']
    },
    {
      name: 'mv_institution_skill_summary',
      purpose: 'Materialized view for real-time institutional analytics',
      columns: ['institution_id', 'skill_id', 'avg_proficiency', 'avg_gap', 'students_assessed']
    }
  ];

  const apiEndpoints = [
    { method: 'POST', path: '/api/v1/auth/login', desc: 'JWT authentication with role-based claim' },
    { method: 'GET', path: '/api/v1/students/:id/skill-profile', desc: 'Fetches verified skill vector and gap scores' },
    { method: 'GET', path: '/api/v1/students/:id/recommendations/opportunities', desc: 'Vector cosine similarity matching (threshold >= 60%)' },
    { method: 'POST', path: '/api/v1/applications', desc: 'Student applies to opportunity; computes match_score' },
    { method: 'PATCH', path: '/api/v1/applications/:id/status', desc: 'ATS pipeline transition; writes to application_status_history' },
    { method: 'GET', path: '/api/v1/institutions/:id/dashboard/skill-development', desc: 'Materialized view aggregate analytics for NAAC/NIRF' },
    { method: 'POST', path: '/api/v1/portfolio/credentials/:id/verify', desc: 'Institutional cryptographic verification of credentials' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '840px',
          padding: '30px',
          background: isLight ? '#ffffff' : undefined,
          border: isLight ? '1px solid #e2e8f0' : undefined
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: isLight ? '#0f172a' : '#ffffff' }}>Technical Architecture & Database Schema</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                Based on TRD_Academia_Industry_Portal.md & backend_schema.sql (PostgreSQL 15+)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: isLight ? '#64748b' : '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="tabs-container" style={{ marginBottom: '20px' }}>
          <button
            className={`tab-btn ${activeTab === 'schema' ? 'active' : ''}`}
            onClick={() => setActiveTab('schema')}
          >
            <Database size={16} />
            PostgreSQL 15+ Schema ({tables.length} Tables)
          </button>
          <button
            className={`tab-btn ${activeTab === 'algorithm' ? 'active' : ''}`}
            onClick={() => setActiveTab('algorithm')}
          >
            <Cpu size={16} />
            Vector Matching Algorithm (TRD §5)
          </button>
          <button
            className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            <Code2 size={16} />
            REST API Contract (TRD §6)
          </button>
        </div>

        {/* TAB 1: PostgreSQL Schema Inspector */}
        {activeTab === 'schema' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '55vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                Relational tables with UUID primary keys, ENUM constraints & materialized views:
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                PostgreSQL 15+ DDL
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '12px' }}>
              {tables.map(t => (
                <div
                  key={t.name}
                  style={{
                    background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'monospace', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>
                      {t.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: isLight ? '#64748b' : '#94a3b8' }}>TABLE</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginBottom: '8px' }}>
                    {t.purpose}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {t.columns.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          background: isLight ? '#e2e8f0' : 'rgba(0, 0, 0, 0.3)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          fontFamily: 'monospace',
                          color: isLight ? '#0f172a' : '#cbd5e1',
                          fontWeight: isLight ? 600 : 400
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Vector Matching Algorithm */}
        {activeTab === 'algorithm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.12)',
              border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '18px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                Mathematical Formulation: Weighted Skill-Vector Cosine Similarity
              </h4>
              <p style={{ fontSize: '0.85rem', color: isLight ? '#334155' : '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                As specified in <strong>TRD Section 5</strong>, each student profile is projected as an n-dimensional vector <code style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>u</code> and each vacancy requirements as vector <code style={{ color: isLight ? '#2563eb' : '#93c5fd' }}>v</code> over the skill ontology:
              </p>

              <div style={{
                margin: '14px 0',
                padding: '14px',
                background: isLight ? '#f1f5f9' : '#05070e',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                color: isLight ? '#1e40af' : '#38bdf8',
                textAlign: 'center',
                border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(59, 130, 246, 0.25)'
              }}>
                Cosine Similarity = (u · v) / (||u|| × ||v||)
                <br />
                Match Score (%) = round(Cosine Similarity × 100)
              </div>

              <div style={{ fontSize: '0.82rem', color: isLight ? '#475569' : '#94a3b8', lineHeight: 1.5 }}>
                • <strong>Cosine Similarity:</strong> Measures alignment between candidate proficiency and employer expectation regardless of magnitude.<br />
                • <strong>Explainable Gap Identification:</strong> Identifies specific sub-skills where <code style={{ color: isLight ? '#dc2626' : '#f87171' }}>u_i &lt; v_i</code>.<br />
                • <strong>Curated Remedial Mapping:</strong> Automatically queries the <code style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>skill_courses</code> table to deliver targeted NPTEL/Swayam certifications to bridge the deficit.
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REST API Contract */}
        {activeTab === 'api' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '55vh', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginBottom: '4px' }}>
              Standard REST API Contract (versioned under <code style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>/api/v1/</code>) with JWT Bearer Authentication:
            </div>

            {apiEndpoints.map((ep, i) => (
              <div
                key={i}
                style={{
                  background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    background: ep.method === 'GET'
                      ? (isLight ? '#dbeafe' : 'rgba(59, 130, 246, 0.2)')
                      : ep.method === 'POST'
                      ? (isLight ? '#e0f2fe' : 'rgba(14, 165, 233, 0.2)')
                      : (isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.1)'),
                    color: ep.method === 'GET'
                      ? (isLight ? '#1d4ed8' : '#60a5fa')
                      : ep.method === 'POST'
                      ? (isLight ? '#0369a1' : '#38bdf8')
                      : (isLight ? '#334155' : '#ffffff')
                  }}>
                    {ep.method}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: isLight ? '#0f172a' : '#f8fafc', fontWeight: 600 }}>
                    {ep.path}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close Architecture Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
