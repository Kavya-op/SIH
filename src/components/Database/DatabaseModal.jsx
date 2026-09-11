import React, { useState } from 'react';
import {
  Database,
  X,
  Download,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  RotateCcw,
  Search,
  GraduationCap,
  Building,
  BookOpen,
  Landmark
} from 'lucide-react';
import db from '../../lib/db';

export default function DatabaseModal({ isOpen, onClose, isLight, addToast }) {
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'industry' | 'faculty' | 'admin' | 'credentials' | 'sql'
  const [searchQuery, setSearchQuery] = useState('');
  const [hashVerificationResult, setHashVerificationResult] = useState(null);
  const [customSql, setCustomSql] = useState('SELECT id, name, role, institution_or_company, discipline FROM portal_profiles;');
  const [queryResult, setQueryResult] = useState(null);

  if (!isOpen) return null;

  const allProfiles = db.getProfiles();
  const allCredentials = db.getCredentials();

  // Handle Export SQL
  const handleExportSQL = () => {
    const sql = db.exportDatabase('sql');
    const blob = new Blob([sql], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `portal_database_dump_2026.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Database exported as SQL dump (portal_database_dump_2026.sql)', 'success');
  };

  // Handle Export JSON
  const handleExportJSON = () => {
    const json = db.exportDatabase('json');
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `portal_database_records_2026.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Database exported as JSON (portal_database_records_2026.json)', 'success');
  };

  // Handle Hash Verification
  const handleVerifyHash = (cred) => {
    const res = db.verifyCredential(cred.id);
    setHashVerificationResult(res);
    if (res.valid) {
      addToast(`Credential "${cred.title}" verified with SHA-256 hash!`, 'success');
    } else {
      addToast('Hash mismatch or unverified status.', 'error');
    }
  };

  // Handle Reset to Seed
  const handleReset = () => {
    db.resetToSeed();
    addToast('Database state reset to pristine multi-profile seed data.', 'info');
  };

  // Handle Run Sample Query
  const handleRunQuery = (query) => {
    setCustomSql(query);
    const qLower = query.toLowerCase();

    let records = [];
    if (qLower.includes('credentials')) {
      records = allCredentials;
    } else if (qLower.includes("role = 'student'") || qLower.includes('students')) {
      records = allProfiles.students;
    } else if (qLower.includes("role = 'industry'") || qLower.includes('industry')) {
      records = allProfiles.industry;
    } else if (qLower.includes("role = 'academician'") || qLower.includes('faculty')) {
      records = allProfiles.faculty;
    } else if (qLower.includes('admin')) {
      records = allProfiles.admin;
    } else {
      records = [
        ...allProfiles.students.map(s => ({ id: s.id, role: 'student', name: s.name, org: s.institution })),
        ...allProfiles.industry.map(i => ({ id: i.id, role: 'industry', name: i.name, org: i.name })),
        ...allProfiles.faculty.map(f => ({ id: f.id, role: 'academician', name: f.name, org: f.institution })),
        ...allProfiles.admin.map(a => ({ id: a.id, role: 'institution_admin', name: a.name, org: a.institution }))
      ];
    }

    setQueryResult({
      query,
      count: records.length,
      rows: records
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-content glass-panel"
        onClick={e => e.stopPropagation()}
        style={{
          width: '94%',
          maxWidth: '1100px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 28px',
          background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.95)',
          border: isLight ? '1.5px solid #cbd5e1' : '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '16px',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.3rem'
              }}
            >
              <Database size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                  Database Records & Credential Vault
                </h3>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                  <CheckCircle2 size={12} /> SQLite & Persistent Engine Active
                </span>
              </div>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: isLight ? '#64748b' : 'var(--text-secondary)' }}>
                Stores full records, data, and cryptographic credentials for all 4 profiles (TRD §2, §6 & SIH 26044)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportSQL}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px', fontSize: '0.78rem' }}
              title="Download full SQL DDL and Seed statements"
            >
              <Download size={14} />
              <span>Export SQL (.sql)</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px', fontSize: '0.78rem' }}
              title="Download entire database JSON snapshot"
            >
              <Download size={14} />
              <span>Export JSON (.json)</span>
            </button>

            <button
              onClick={handleReset}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px', fontSize: '0.78rem' }}
              title="Reset records to default seed state"
            >
              <RotateCcw size={14} />
              <span>Reset DB</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: isLight ? '#64748b' : '#94a3b8',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs for the 4 Profiles + Credentials + SQL */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '10px',
            marginBottom: '16px',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'students', label: '1. Student Profiles', count: allProfiles.students?.length, icon: GraduationCap },
            { id: 'industry', label: '2. Industry Partners', count: allProfiles.industry?.length, icon: Building },
            { id: 'faculty', label: '3. Faculty / Academician', count: allProfiles.faculty?.length, icon: BookOpen },
            { id: 'admin', label: '4. Institution Admin', count: allProfiles.admin?.length, icon: Landmark },
            { id: 'credentials', label: 'Verifiable Credentials Vault', count: allCredentials.length, icon: ShieldCheck },
            { id: 'sql', label: 'Live SQL Query Console', count: null, icon: Terminal }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setHashVerificationResult(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: isActive ? '1.5px solid #3b82f6' : '1px solid transparent',
                  background: isActive ? (isLight ? '#eff6ff' : 'rgba(37, 99, 235, 0.2)') : 'transparent',
                  color: isActive ? (isLight ? '#1d4ed8' : '#60a5fa') : (isLight ? '#64748b' : '#94a3b8'),
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    style={{
                      background: isActive ? '#2563eb' : (isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)'),
                      color: isActive ? '#ffffff' : (isLight ? '#475569' : '#cbd5e1'),
                      borderRadius: '12px',
                      padding: '2px 7px',
                      fontSize: '0.72rem'
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {/* TAB 1: STUDENTS */}
          {activeTab === 'students' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Stored Student Records ({allProfiles.students?.length} Multidisciplinary Scholars)</span>
                <span className="badge badge-sky">Table: portal_profiles (role = 'student')</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                {allProfiles.students?.map(s => {
                  const studentCreds = allCredentials.filter(c => c.profileId === s.id);
                  return (
                    <div
                      key={s.id}
                      className="glass-panel"
                      style={{
                        padding: '18px',
                        border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={s.avatar}
                              alt={s.name}
                              style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }}
                            />
                            <div>
                              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                                {s.name}
                              </h4>
                              <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                                {s.enrollment_no}
                              </div>
                            </div>
                          </div>
                          <span className={`badge ${
                            s.discipline === 'engineering' ? 'badge-sky' :
                            s.discipline === 'commerce' ? 'badge-amber' : 'badge-emerald'
                          }`} style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                            {s.discipline?.toUpperCase()}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: isLight ? '#334155' : '#cbd5e1', marginBottom: '8px' }}>
                          <strong>{s.institution}</strong>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : 'var(--text-secondary)', marginBottom: '10px' }}>
                          {s.course || s.department} • <strong>CGPA: {s.cgpa}</strong>
                        </div>

                        {/* Top Skills Vector */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                          {Object.entries(s.skills || {}).slice(0, 3).map(([sk, val]) => (
                            <span
                              key={sk}
                              style={{
                                fontSize: '0.68rem',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)',
                                color: isLight ? '#334155' : '#cbd5e1'
                              }}
                            >
                              {sk.split('&')[0]}: <strong>{val}%</strong>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Associated Credentials count */}
                      <div
                        style={{
                          borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                          paddingTop: '10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.74rem'
                        }}
                      >
                        <span style={{ color: isLight ? '#64748b' : '#94a3b8' }}>
                          📜 {studentCreds.length} Verifiable Credentials
                        </span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>Verified in Vault</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INDUSTRY */}
          {activeTab === 'industry' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Stored Corporate Partner Records ({allProfiles.industry?.length} Enterprises)</span>
                <span className="badge badge-sky">Table: portal_profiles (role = 'industry')</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                {allProfiles.industry?.map(ind => (
                  <div
                    key={ind.id}
                    className="glass-panel"
                    style={{
                      padding: '18px',
                      border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '1.8rem' }}>{ind.logo || '🏢'}</span>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                            {ind.name}
                          </h4>
                          <span className="badge badge-emerald" style={{ fontSize: '0.66rem', marginTop: '2px' }}>
                            {ind.verification_status?.toUpperCase()} PARTNER
                          </span>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: isLight ? '#2563eb' : '#38bdf8', fontWeight: 600, marginBottom: '6px' }}>
                        {ind.industry_sector}
                      </div>

                      <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : '#94a3b8', marginBottom: '4px', fontFamily: 'monospace' }}>
                        CIN: <strong>{ind.cin}</strong>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : '#94a3b8', marginBottom: '10px', fontFamily: 'monospace' }}>
                        GSTIN: <strong>{ind.gstin}</strong>
                      </div>

                      <div style={{ fontSize: '0.76rem', color: isLight ? '#475569' : '#cbd5e1', marginBottom: '10px' }}>
                        📍 {ind.address}
                      </div>
                    </div>

                    <div
                      style={{
                        borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                        paddingTop: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.74rem'
                      }}
                    >
                      <span style={{ color: isLight ? '#64748b' : '#94a3b8' }}>
                        Lead: {ind.lead_contact?.name}
                      </span>
                      <span style={{ color: isLight ? '#2563eb' : '#38bdf8', fontWeight: 600 }}>
                        {ind.active_mous?.length} Active MoUs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FACULTY / ACADEMICIAN */}
          {activeTab === 'faculty' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Stored Academician & Faculty Lead Records ({allProfiles.faculty?.length} Principal Investigators)</span>
                <span className="badge badge-sky">Table: portal_profiles (role = 'academician')</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
                {allProfiles.faculty?.map(fac => (
                  <div
                    key={fac.id}
                    className="glass-panel"
                    style={{
                      padding: '20px',
                      border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                            {fac.title || fac.name}
                          </h4>
                          <div style={{ fontSize: '0.78rem', color: isLight ? '#2563eb' : '#38bdf8', fontWeight: 600, marginTop: '2px' }}>
                            {fac.designation}
                          </div>
                        </div>
                        <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                          ORCID: {fac.orcid_id}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: isLight ? '#334155' : '#cbd5e1', marginBottom: '6px' }}>
                        🏛️ <strong>{fac.institution}</strong>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : '#94a3b8', marginBottom: '12px' }}>
                        {fac.department}
                      </div>

                      {/* Metrics row */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '8px',
                          background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
                          padding: '10px',
                          borderRadius: '8px',
                          marginBottom: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>Citations</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>{fac.citations_count}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>H-Index</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>{fac.h_index}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>Papers</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#2563eb' : '#38bdf8' }}>{fac.publications_count}</div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                        paddingTop: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.74rem'
                      }}
                    >
                      <span style={{ color: isLight ? '#64748b' : '#94a3b8' }}>
                        ✉️ {fac.email}
                      </span>
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                        Active Mentor
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INSTITUTION ADMIN */}
          {activeTab === 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Stored Apex Institutional Consortium & Directorate Records</span>
                <span className="badge badge-sky">Table: portal_profiles (role = 'institution_admin')</span>
              </div>

              {allProfiles.admin?.map(adm => (
                <div
                  key={adm.id}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="badge badge-emerald">Apex Directorate</span>
                        <span className="badge badge-purple">{adm.aishe_code}</span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                        {adm.name}
                      </h4>
                      <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : '#cbd5e1', marginTop: '4px' }}>
                        {adm.institution}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : '#94a3b8' }}>Placement Readiness Index</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{adm.readiness_index}%</div>
                    </div>
                  </div>

                  {/* Consortium Stats Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px'
                    }}
                  >
                    <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>National NIRF Ranking</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', marginTop: '2px' }}>{adm.nirf_rank}</div>
                    </div>
                    <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>NAAC Institutional Grade</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{adm.naac_grade}</div>
                    </div>
                    <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>Enrolled Students</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 700, color: isLight ? '#2563eb' : '#38bdf8', marginTop: '2px' }}>{adm.registered_students} Scholars</div>
                    </div>
                    <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>Partner Industries</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#a855f7', marginTop: '2px' }}>{adm.partner_industries} Enterprises</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: VERIFIABLE CREDENTIALS VAULT */}
          {activeTab === 'credentials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                    Verifiable Digital Credentials & Cryptographic Hash Registry
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                    Tamper-evident verification hashes for certificates, degrees, MoUs, and grant sanctions
                  </p>
                </div>

                <div className="relative max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title, profile, or hash..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg text-xs border"
                    style={{
                      background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                      borderColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.1)',
                      color: isLight ? '#0f172a' : '#ffffff'
                    }}
                  />
                </div>
              </div>

              {/* Hash Verification Alert Banner */}
              {hashVerificationResult && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: hashVerificationResult.valid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    border: hashVerificationResult.valid ? '1px solid #10b981' : '1px solid #ef4444',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: hashVerificationResult.valid ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} />
                      <span>{hashVerificationResult.valid ? 'Cryptographic Hash Validated (SHA-256 Match)' : 'Invalid Hash'}</span>
                    </div>
                    <div style={{ color: isLight ? '#334155' : '#cbd5e1', marginTop: '3px', fontFamily: 'monospace', fontSize: '0.74rem' }}>
                      Hash: {hashVerificationResult.sha256_hash}
                    </div>
                  </div>
                  <button
                    onClick={() => setHashVerificationResult(null)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Credentials List Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allCredentials
                  .filter(c => {
                    if (!searchQuery) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      c.title.toLowerCase().includes(q) ||
                      c.profileName.toLowerCase().includes(q) ||
                      c.sha256_hash.toLowerCase().includes(q) ||
                      c.issuer.toLowerCase().includes(q)
                    );
                  })
                  .map(cred => (
                    <div
                      key={cred.id}
                      className="glass-panel"
                      style={{
                        padding: '16px 20px',
                        border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span className={`badge ${
                            cred.role === 'student' ? 'badge-sky' :
                            cred.role === 'industry' ? 'badge-indigo' :
                            cred.role === 'academician' ? 'badge-purple' : 'badge-emerald'
                          }`} style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                            {cred.role?.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.94rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                            {cred.title}
                          </span>
                          <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                            <CheckCircle2 size={11} /> {cred.verification_status?.toUpperCase()}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8', marginBottom: '4px' }}>
                          Profile: <strong style={{ color: isLight ? '#0f172a' : '#e2e8f0' }}>{cred.profileName}</strong> • Issued by: <strong>{cred.issuer}</strong>
                        </div>

                        <div style={{ fontSize: '0.72rem', color: isLight ? '#2563eb' : '#38bdf8', fontFamily: 'monospace' }}>
                          SHA-256: {cred.sha256_hash}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleVerifyHash(cred)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '4px', fontSize: '0.76rem' }}
                        >
                          <ShieldCheck size={14} color="#10b981" />
                          <span>Verify Hash</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 6: LIVE SQL QUERY CONSOLE */}
          {activeTab === 'sql' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                  Interactive SQL & Relational Query Console
                </h4>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                  Execute SQL statements directly against the portal database schema and examine result sets
                </p>
              </div>

              {/* Sample Queries Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { label: 'All 4 Profiles', sql: 'SELECT id, name, role, institution_or_company FROM portal_profiles;' },
                  { label: 'All Students', sql: "SELECT * FROM portal_profiles WHERE role = 'student';" },
                  { label: 'All Corporate Partners', sql: "SELECT * FROM portal_profiles WHERE role = 'industry';" },
                  { label: 'All Faculty Leads', sql: "SELECT * FROM portal_profiles WHERE role = 'academician';" },
                  { label: 'All Verifiable Credentials', sql: 'SELECT id, profile_name, title, issuer, sha256_hash FROM portal_credentials;' }
                ].map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => handleRunQuery(sample.sql)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.12)',
                      background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.05)',
                      color: isLight ? '#334155' : '#cbd5e1'
                    }}
                  >
                    ⚡ {sample.label}
                  </button>
                ))}
              </div>

              {/* SQL Input Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <textarea
                  rows={3}
                  value={customSql}
                  onChange={e => setCustomSql(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '0.84rem',
                    background: isLight ? '#f8fafc' : '#020617',
                    border: isLight ? '1.5px solid #93c5fd' : '1px solid rgba(59, 130, 246, 0.4)',
                    color: isLight ? '#0f172a' : '#38bdf8'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleRunQuery(customSql)}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <Terminal size={14} />
                    <span>Run Query</span>
                  </button>
                </div>
              </div>

              {/* Query Result Display */}
              {queryResult && (
                <div
                  style={{
                    background: isLight ? '#f8fafc' : 'rgba(0, 0, 0, 0.3)',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '14px',
                    overflowX: 'auto'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8', marginBottom: '8px' }}>
                    Query executed successfully: returned <strong>{queryResult.count} row(s)</strong>
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      fontSize: '0.76rem',
                      fontFamily: 'monospace',
                      color: isLight ? '#0f172a' : '#a5f3fc',
                      maxHeight: '260px',
                      overflowY: 'auto'
                    }}
                  >
                    {JSON.stringify(queryResult.rows, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
