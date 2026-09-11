import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Building,
  Briefcase,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Filter,
  History,
  Database
} from 'lucide-react';

export default function AdminDashboard() {
  const { analytics, auditLogs, applications, addToast, theme } = useApp();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'audit_logs' | 'verification'

  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 'ind-baidyanath-05',
      name: 'Baidyanath Research & Formulations',
      cin: 'U24233MH1917PLC000450',
      industry_sector: 'Phytopharmaceuticals',
      contactPerson: 'Dr. Vivek Joshi (Head of Clinical Strategy)',
      submissionDate: '2026-09-02',
      verification_status: 'pending'
    },
    {
      id: 'ind-zandu-06',
      name: 'Zandu Healthcare Innovation Labs',
      cin: 'L24230MH1910PLC000312',
      industry_sector: 'Ayurvedic Formulations & QC',
      contactPerson: 'Meera Deshmukh (Talent Acquisition)',
      submissionDate: '2026-09-05',
      verification_status: 'pending'
    }
  ]);

  const handleApprovePartner = (id, name) => {
    setPendingVerifications(prev => prev.filter(v => v.id !== id));
    addToast(`Organization "${name}" successfully verified as official AyushSetu Partner!`, 'success');
  };

  const handleRejectPartner = (id, name) => {
    setPendingVerifications(prev => prev.filter(v => v.id !== id));
    addToast(`Verification request for "${name}" rejected.`, 'warning');
  };

  const handleExportReport = () => {
    const headers = 'Department,Enrolled Students,Readiness Score (%),Top Identified Skill Gap\n';
    const rows = analytics.departmentReadiness.map(d =>
      `"${d.department}",${d.students},${d.readiness}%,"${d.topGap}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AIIA_Ministry_Ayush_Accreditation_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Institutional Accreditation Audit Report (CSV) exported!', 'success');
  };

  // Placement Funnel computation based on schema MV: mv_institution_placement_funnel
  const funnel = {
    applied: applications.length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offered: applications.filter(a => a.status === 'offered' || a.status === 'completed').length
  };

  return (
    <div className="container" style={{ padding: '24px 24px 60px 24px' }}>
      {/* Admin Executive Header */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.16) 0%, rgba(14, 165, 233, 0.08) 50%, rgba(10, 15, 29, 0.8) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)'
          }}>
            🏛️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.45rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                Institutional Directorate & Ministry Analytics Hub
              </h2>
              <span className="badge badge-sky">NIRF & NAAC Ready</span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: isLight ? '#475569' : 'var(--text-secondary)', fontSize: '0.88rem' }}>
              {analytics.institutionName} • Smart Automation Placement Oversight
            </p>
          </div>
        </div>

        <button
          onClick={handleExportReport}
          className="btn btn-primary rounded-full px-6 py-3 font-bold shadow-lg shadow-blue-600/30"
          style={{ gap: '8px' }}
        >
          <Download size={16} />
          Export NAAC/NIRF Audit Report
        </button>
      </div>

      {/* KPI Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Enrolled Students</div>
          <div className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-2">
            {analytics.totalStudentsEnrolled}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '6px' }}>
            {analytics.studentsAssessedCount} Assessed ({analytics.assessmentCompletionRate}%)
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Placement Readiness Index</div>
          <div className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-2">
            {analytics.placementReadinessRate}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '6px' }}>
            +12.4% vs previous semester
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Industry Partners</div>
          <div className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-2">
            {analytics.activeIndustryPartners}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '6px' }}>
            Table: <code>industries</code> (verified)
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Package / Placement</div>
          <div className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-2">
            {analytics.averagePackage}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#bfdbfe', marginTop: '6px' }}>
            Highest Package: {analytics.highestPackage}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <TrendingUp size={18} />
          University Placement Records & Aggregate Skill Metrics
        </button>

        <button
          className={`tab-btn ${activeTab === 'accreditation' ? 'active' : ''}`}
          onClick={() => setActiveTab('accreditation')}
        >
          <Award size={18} />
          Accreditation Details (NAAC A++ & NIRF 2026)
        </button>

        <button
          className={`tab-btn ${activeTab === 'audit_logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit_logs')}
        >
          <History size={18} />
          Security Audit Logs ({auditLogs.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          <Building size={18} />
          Industry Verification Queue ({pendingVerifications.length})
        </button>
      </div>

      {/* TAB 1: Materialized Views */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Placement Funnel (schema: mv_institution_placement_funnel) */}
          <div className="glass-panel" style={{ padding: '22px 26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
                Materialized View: Institutional Placement Funnel (<code>mv_institution_placement_funnel</code>)
              </h3>
              <span className="badge badge-teal">Real-Time Aggregate</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', textTransform: 'uppercase' }}>Applied</div>
                <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-1">{funnel.applied}</div>
              </div>
              <div style={{ background: 'rgba(14, 165, 233, 0.12)', border: '1px solid rgba(14, 165, 233, 0.3)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase' }}>Shortlisted</div>
                <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-1">{funnel.shortlisted}</div>
              </div>
              <div style={{ background: 'rgba(29, 78, 216, 0.15)', border: '1px solid rgba(37, 99, 235, 0.35)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase' }}>Interview Scheduled</div>
                <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-1">{funnel.interview}</div>
              </div>
              <div style={{ background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)', border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.2)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: isLight ? '#0f172a' : '#ffffff', textTransform: 'uppercase' }}>Offered / Concluded</div>
                <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-1">{funnel.offered}</div>
              </div>
            </div>
          </div>

          {/* Department Breakdown & Gap Heatmap */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
            {/* Department Readiness List */}
            <div className="glass-panel" style={{ padding: '24px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: isLight ? '#0f172a' : 'inherit' }}>Department-Wise Skill Readiness</h3>
                  <p style={{ fontSize: '0.8rem', color: isLight ? '#475569' : 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    View: <code>mv_institution_skill_summary</code>
                  </p>
                </div>
                <span className="badge badge-emerald">6 Departments</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {analytics.departmentReadiness.map((dept, i) => (
                  <div
                    key={i}
                    style={{
                      background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                      border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 18px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div>
                        <span style={{ fontSize: '0.92rem', fontWeight: 600, color: isLight ? '#0f172a' : '#ffffff' }}>
                          {dept.department}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : 'var(--text-muted)', marginLeft: '8px' }}>
                          ({dept.students} students)
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: isLight ? '#1d4ed8' : (dept.readiness >= 80 ? '#38bdf8' : '#60a5fa')
                      }}>
                        {dept.readiness}%
                      </span>
                    </div>

                    <div className="progress-bar-bg" style={{ height: '6px', marginBottom: '8px' }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${dept.readiness}%`,
                          background: dept.readiness >= 80 ? 'linear-gradient(90deg, #2563eb, #38bdf8)' : 'linear-gradient(90deg, #1e3a8a, #60a5fa)'
                        }}
                      ></div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: isLight ? '#b45309' : '#93c5fd', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={12} color={isLight ? '#b45309' : '#60a5fa'} />
                      Curriculum Deficit: <strong style={{ color: isLight ? '#9a3412' : '#ffffff' }}>{dept.topGap}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Gap Heatmap */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Institutional Skill Gap Heatmap</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    Student average vs. industry threshold
                  </p>
                </div>
                <span className="badge badge-sky">Gap Analysis</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {analytics.skillGapHeatmap.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 18px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>
                        {item.skill}
                      </span>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: item.gap > 20 ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                        color: item.gap > 20 ? '#38bdf8' : '#94a3b8'
                      }}>
                        Gap: -{item.gap}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>Current Student Avg: <strong style={{ color: '#cbd5e1' }}>{item.currentAvg}%</strong></span>
                      <span>Industry Target: <strong style={{ color: '#38bdf8' }}>{item.industryTarget}%</strong></span>
                    </div>

                    <div className="progress-bar-bg" style={{ height: '6px' }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${item.currentAvg}%`,
                          background: 'linear-gradient(90deg, #2563eb, #38bdf8)'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Accreditation Details (NAAC & NIRF 2026) */}
      {activeTab === 'accreditation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Accreditation Header Card */}
          <div className="glass-panel" style={{ padding: '24px 28px', border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.3)', background: isLight ? '#ffffff' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={22} color="#0284c7" />
                  <h3 style={{ fontSize: '1.25rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                    Institutional Accreditation & Statutory Compliance Records
                  </h3>
                  <span className="badge badge-emerald">NAAC A++ Certified</span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                  Accreditation metrics benchmarked for University Grants Commission (UGC), NAAC 4th Cycle & NIRF 2026 reporting
                </p>
              </div>

              <button
                onClick={handleExportReport}
                className="btn btn-primary btn-sm"
                style={{ gap: '8px' }}
              >
                <Download size={15} />
                Download NAAC Self-Study Dossier (SSR)
              </button>
            </div>

            {/* Statutory Scores Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '22px' }}>
              <div style={{ background: isLight ? '#eff6ff' : 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(56, 189, 248, 0.1))', padding: '18px', borderRadius: '12px', border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.35)' }}>
                <div style={{ fontSize: '0.76rem', color: isLight ? '#1d4ed8' : '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>NAAC Accreditation</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: isLight ? '#1e3a8a' : '#ffffff', marginTop: '4px' }}>Grade A++</div>
                <div style={{ fontSize: '0.78rem', color: isLight ? '#2563eb' : '#38bdf8', marginTop: '2px' }}>CGPA: 3.78 / 4.00 (Cycle 3)</div>
              </div>

              <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '12px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>NIRF India Rankings 2026</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8', marginTop: '4px' }}>Rank #1</div>
                <div style={{ fontSize: '0.78rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginTop: '2px' }}>Ayush & Traditional Medicine Category</div>
              </div>

              <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '12px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>AISHE Code (Ministry of Edu)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginTop: '6px', fontFamily: 'monospace' }}>U-0128</div>
                <div style={{ fontSize: '0.78rem', color: isLight ? '#0284c7' : '#38bdf8', marginTop: '2px' }}>Active Institutional Registration</div>
              </div>

              <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '12px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Ayush Center of Excellence</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isLight ? '#1d4ed8' : '#60a5fa', marginTop: '6px' }}>Approved (CoE)</div>
                <div style={{ fontSize: '0.78rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginTop: '2px' }}>National Institute of Ayurveda</div>
              </div>
            </div>
          </div>

          {/* NAAC 7-Criteria Compliance Assessment */}
          <div className="glass-panel" style={{ padding: '24px 28px', background: isLight ? '#ffffff' : undefined, border: isLight ? '1px solid #e2e8f0' : undefined }}>
            <h4 style={{ fontSize: '1.15rem', color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 16px 0' }}>
              NAAC 7-Criteria Institutional Compliance Breakdown
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {[
                { criterion: 'Criterion I', name: 'Curricular Design & Industry Alignment', score: 96, desc: 'Ayush curriculum integrated with pharmacovigilance & HPLC protocols' },
                { criterion: 'Criterion II', name: 'Teaching-Learning & Student Assessment', score: 98, desc: 'Vector cosine diagnostic skill tests & continuous readiness scoring' },
                { criterion: 'Criterion III', name: 'Research, Sabbaticals & Innovations', score: 94, desc: '₹1.85 Cr sponsored industry R&D grants & active faculty mentor network' },
                { criterion: 'Criterion IV', name: 'Infrastructure & Clinical Instrumentation', score: 92, desc: 'NABL accredited analytical testing labs & LC-MS standardization' },
                { criterion: 'Criterion V', name: 'Student Placement Progression & Support', score: 95, desc: '87.5% verified placement rate across top pharmaceutical partners' },
                { criterion: 'Criterion VI', name: 'Institutional Governance & Leadership', score: 93, desc: 'Ministry of Ayush centralized monitoring & automated audit trails' },
                { criterion: 'Criterion VII', name: 'Institutional Values & Best Practices', score: 99, desc: 'Authentic botanical preservation & classical formulation validation' }
              ].map((c, i) => (
                <div key={i} style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 700 }}>{c.criterion}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>{c.score}%</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '6px' }}>{c.name}</div>
                  <div style={{ fontSize: '0.78rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.4 }}>{c.desc}</div>
                  <div className="progress-bar-bg" style={{ height: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${c.score}%`, background: 'linear-gradient(90deg, #2563eb, #38bdf8)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Audit Logs (schema: audit_logs) */}
      {activeTab === 'audit_logs' && (
        <div className="glass-panel" style={{ padding: '24px', background: isLight ? '#ffffff' : undefined, border: isLight ? '1px solid #e2e8f0' : undefined }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>System Audit Logs (<code>audit_logs</code>)</h3>
            <p style={{ fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Immutable security trail for verifications, applications, and sensitive status mutations
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {auditLogs.map(log => (
              <div
                key={log.id}
                style={{
                  background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.72rem',
                    background: isLight ? '#dbeafe' : 'rgba(37, 99, 235, 0.18)',
                    color: isLight ? '#1d4ed8' : '#38bdf8',
                    fontWeight: 700
                  }}>
                    {log.action}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: isLight ? '#0f172a' : '#ffffff', fontWeight: 600 }}>
                      Actor: {log.actor_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                      Entity: {log.entity_type} ({log.entity_id}) • IP: {log.ip_address}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                  {log.created_at}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Industry Partner Verification Queue */}
      {activeTab === 'verification' && (
        <div className="glass-panel" style={{ padding: '24px', background: isLight ? '#ffffff' : undefined, border: isLight ? '1px solid #e2e8f0' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: isLight ? '#0f172a' : '#f8fafc' }}>
                Pending Industry Verification Requests
              </h3>
              <p style={{ fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Gatekeeper workflow before organizations can post opportunities (schema table: <code>industries</code>)
              </p>
            </div>
            <span className="badge badge-gold">
              {pendingVerifications.length} Awaiting Verification
            </span>
          </div>

          {pendingVerifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
              All industry registration requests have been audited and verified.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingVerifications.map(org => (
                <div
                  key={org.id}
                  style={{
                    background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', color: isLight ? '#0f172a' : '#ffffff' }}>
                        {org.name}
                      </h4>
                      <span className="badge badge-teal">{org.industry_sector}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginTop: '4px' }}>
                      CIN: <span style={{ fontFamily: 'monospace', color: isLight ? '#0f172a' : '#cbd5e1', fontWeight: 600 }}>{org.cin}</span> • Contact: {org.contactPerson}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : 'var(--text-muted)', marginTop: '2px' }}>
                      Submitted: {org.submissionDate} • Reference: {org.id}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => handleRejectPartner(org.id, org.name)}
                      className="btn btn-secondary btn-sm"
                      style={{ borderColor: '#ef4444', color: '#dc2626' }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprovePartner(org.id, org.name)}
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle2 size={15} />
                      Approve & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
