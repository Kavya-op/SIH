import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Plus,
  Users,
  CheckCircle2,
  Sparkles,
  Star,
  Building,
  Trophy,
  LayoutDashboard,
  TrendingUp
} from 'lucide-react';

import IndustryOverview from './IndustryOverview';
import VacancyManager from './VacancyManager';
import CandidatePipeline from './CandidatePipeline';
import TalentScout from './TalentScout';
import InnovationHub from './InnovationHub';
import MentorCredentials from './MentorCredentials';
import CompanyProfile from './CompanyProfile';
import {
  PostOpportunityModal,
  StatusTransitionModal,
  CandidateDossierModal,
  IssueCredentialModal,
  NewChallengeModal
} from './IndustryModals';

export default function IndustryDashboard() {
  const {
    internships,
    applications,
    candidates = [],
    innovationChallenges = [],
    facultyOpps = [],
    skillCategories = [],
    industries = [],
    addOpportunity,
    toggleOpportunityStatus,
    deleteOpportunity,
    updateApplicationStatus,
    submitMentorFeedback,
    issueDigitalCredential,
    addInnovationChallenge,
    gradeChallengeSubmission,
    sendDirectCandidateInvitation,
    studentProfile,
    calculateCosineMatch,
    addToast,
    theme
  } = useApp();

  const isLight = theme === 'light';

  // Active Main Navigation Tab
  // 'overview' | 'vacancies' | 'pipeline' | 'talent' | 'innovations' | 'feedback' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // Corporate Partner / Sector Switcher: 'ind-google-01' | 'ind-goldman-02' | 'ind-tata-03' | 'ind-deloitte-04' | 'ind-himalaya-05' | 'all'
  const [selectedIndustryId, setSelectedIndustryId] = useState('ind-google-01');

  // Discipline Filter: 'all' | 'engineering' | 'commerce' | 'healthcare'
  const [industryDisciplineFilter, setIndustryDisciplineFilter] = useState('all');

  // Selected Opportunity Filter for ATS & Talent Scout
  const [selectedOppFilter, setSelectedOppFilter] = useState('all');

  // Modals state
  const [showPostModal, setShowPostModal] = useState(false);
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [dossierModalApp, setDossierModalApp] = useState(null);
  const [credentialModalApp, setCredentialModalApp] = useState(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  // Active Corporate Partner Metadata
  const activeIndustry = selectedIndustryId === 'all'
    ? {
        id: 'all',
        name: 'Apex Multidisciplinary Industry Consortium',
        industry_sector: 'B.Tech Engineering, FinTech, Autonomous Robotics & Life Sciences',
        verification_status: 'verified',
        discipline: 'all',
        cin: 'CORPORATE-CONSORTIUM-INDIA-2026',
        gstin: '07AAACG9999Z1Z5',
        logo: '🏢',
        badge: 'Apex Industry Partner Network',
        connected: 'Connected with IIT Delhi, SRCC, BITS Pilani, AIIA & Central Universities'
      }
    : industries.find(i => i.id === selectedIndustryId) || industries[0] || {
        id: 'ind-google-01',
        name: 'Google India R&D & DeepMind Labs',
        industry_sector: 'Software Engineering, Cloud & Artificial Intelligence',
        verification_status: 'verified',
        discipline: 'engineering',
        cin: 'U72900KA2004PTC033228',
        gstin: '29AAACG9876R1ZT',
        logo: '🌐',
        badge: 'Verified Cloud & AI Partner',
        connected: 'Connected with IIT Delhi, BITS Pilani, and Premier Technical Universities'
      };

  // Filtered Vacancies & Applications based on discipline or enterprise
  const displayedInternships = internships.filter(o => {
    if (industryDisciplineFilter !== 'all' && o.discipline && o.discipline !== industryDisciplineFilter) return false;
    return true;
  });

  const displayedApplications = applications.filter(a => {
    if (industryDisciplineFilter !== 'all') {
      const opp = internships.find(o => o.id === a.opportunity_id);
      if (opp && opp.discipline && opp.discipline !== industryDisciplineFilter) return false;
    }
    return true;
  });

  // Quick stats calculations
  const activeVacanciesCount = displayedInternships.filter(o => (o.status || 'open') === 'open').length;
  const inPipelineCount = displayedApplications.filter(a => a.status === 'shortlisted' || a.status === 'interview').length;
  const offersCount = displayedApplications.filter(a => a.status === 'offered' || a.status === 'completed').length;
  const avgMatchScore = displayedApplications.length > 0
    ? Math.round(displayedApplications.reduce((sum, a) => sum + (a.match_score || 70), 0) / displayedApplications.length)
    : 88;

  const handlePostSubmit = (oppData) => {
    addOpportunity({
      ...oppData,
      discipline: oppData.discipline || activeIndustry.discipline || 'engineering',
      industry_id: activeIndustry.id !== 'all' ? activeIndustry.id : 'ind-google-01'
    });
  };

  const handleStatusTransition = (appId, newStatus, remarks, interviewDate) => {
    updateApplicationStatus(appId, newStatus, remarks, interviewDate);
  };

  const handleViewApplicantsForOpp = (oppId) => {
    setSelectedOppFilter(oppId);
    setActiveTab('pipeline');
  };

  const handleScoutForOpp = (oppId) => {
    setSelectedOppFilter(oppId);
    setActiveTab('talent');
  };

  const handleOpenCandidatePortfolio = (candidate) => {
    const candidateApp = applications.find(a => a.student_id === candidate.id) || {
      id: `app-${candidate.id}`,
      studentName: candidate.name,
      student_id: candidate.id,
      opportunityTitle: 'All-Round Multidisciplinary Profile',
      match_score: candidate.matchScore || 88,
      status: 'shortlisted',
      cover_note: `Candidate from ${candidate.institution} (${candidate.degree}), CGPA: ${candidate.cgpa}. Top competencies verified.`,
      history: [
        { new_status: 'verified', remarks: 'Apex Directorate Verified Profile', changed_at: '2026-08-20' }
      ]
    };
    setDossierModalApp(candidateApp);
  };

  return (
    <div className="container" style={{ padding: '24px 24px 60px 24px' }}>
      {/* Evaluator Multidisciplinary Sector Switcher Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '12px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.65)',
          border: isLight ? '1.5px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: isLight ? '#1e40af' : '#60a5fa' }}>
            🏢 Select Recruiter Persona / Corporate Partner:
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'ind-google-01', label: 'Google India (AI & Tech)', icon: '🌐' },
              { id: 'ind-goldman-02', label: 'Goldman Sachs (FinTech)', icon: '📈' },
              { id: 'ind-tata-03', label: 'Tata Motors (Robotics)', icon: '⚙️' },
              { id: 'ind-deloitte-04', label: 'Deloitte (Corporate Tax)', icon: '📊' },
              { id: 'ind-himalaya-05', label: 'Himalaya (Ayush & Pharma)', icon: '🌿' },
              { id: 'all', label: 'All Consortium', icon: '🏢' }
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => setSelectedIndustryId(sec.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: selectedIndustryId === sec.id
                    ? '1.5px solid #3b82f6'
                    : isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.12)',
                  background: selectedIndustryId === sec.id
                    ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                    : isLight ? '#ffffff' : 'rgba(255,255,255,0.05)',
                  color: selectedIndustryId === sec.id ? '#ffffff' : isLight ? '#334155' : '#cbd5e1',
                  boxShadow: selectedIndustryId === sec.id ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {sec.icon} {sec.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Discipline Pill Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : '#94a3b8', fontWeight: 600 }}>
            Track Filter:
          </span>
          <select
            value={industryDisciplineFilter}
            onChange={e => setIndustryDisciplineFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
              border: isLight ? '1.5px solid #93c5fd' : '1px solid var(--border-medium)',
              color: isLight ? '#0f172a' : '#ffffff'
            }}
          >
            <option value="all">🌐 All Disciplines</option>
            <option value="engineering">💻 B.Tech Engineering</option>
            <option value="commerce">📊 Commerce & FinTech</option>
            <option value="healthcare">🩺 Healthcare & Sciences</option>
          </select>
        </div>
      </div>

      {/* Dynamic Corporate Branding Top Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          border: isLight ? '1px solid #cbd5e1' : undefined
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.9rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
            }}
          >
            {activeIndustry.logo || '🏢'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.45rem', margin: 0, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                {activeIndustry.name}
              </h2>
              <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> {activeIndustry.badge || 'Verified Industry Partner'}
              </span>
              <span className="badge badge-sky" style={{ fontSize: '0.7rem' }}>
                CIN: {activeIndustry.cin}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: isLight ? '#475569' : 'var(--text-secondary)', fontSize: '0.86rem' }}>
              {activeIndustry.industry_sector} • {activeIndustry.connected || 'Connected with Premier Institutions Across India'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowChallengeModal(true)}
            className="btn btn-secondary rounded-full px-5 py-2.5 font-bold"
            style={{ gap: '6px' }}
          >
            <Trophy size={16} />
            <span>Launch Hackathon</span>
          </button>

          <button
            onClick={() => setShowPostModal(true)}
            className="btn btn-primary rounded-full px-6 py-2.5 font-bold shadow-lg shadow-blue-600/30"
            style={{ gap: '8px' }}
          >
            <Plus size={18} />
            <span>Post New Vacancy (TRD §4)</span>
          </button>
        </div>
      </div>

      {/* High-Impact Recruitment KPI Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="glass-panel" style={{ padding: '20px 22px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: isLight ? '#64748b' : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Active Vacancies</span>
            <Briefcase size={18} color="#38bdf8" />
          </div>
          <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-1">
            {activeVacanciesCount}
          </div>
          <div style={{ fontSize: '0.76rem', color: isLight ? '#2563eb' : '#38bdf8', marginTop: '4px' }}>
            Across R&D, QC & Trials
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: isLight ? '#64748b' : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Candidates in ATS</span>
            <Users size={18} color="#3b82f6" />
          </div>
          <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-1">
            {applications.length}
          </div>
          <div style={{ fontSize: '0.76rem', color: isLight ? '#475569' : '#94a3b8', marginTop: '4px' }}>
            Apex Institute Scholars
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: isLight ? '#64748b' : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>In Pipeline</span>
            <Sparkles size={18} color="#a855f7" />
          </div>
          <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 leading-tight mt-1">
            {inPipelineCount}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#a855f7', marginTop: '4px' }}>
            Shortlisted & Interviewing
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: isLight ? '#64748b' : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Offers Extended</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 leading-tight mt-1">
            {offersCount}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#10b981', marginTop: '4px' }}>
            94.2% Acceptance Rate
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: isLight ? '#64748b' : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Avg Vector Match</span>
            <TrendingUp size={18} color="#06b6d4" />
          </div>
          <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 leading-tight mt-1">
            {avgMatchScore}%
          </div>
          <div style={{ fontSize: '0.76rem', color: '#06b6d4', marginTop: '4px' }}>
            Cosine Competency Fit
          </div>
        </div>
      </div>

      {/* 7-Tab Navigation Bar */}
      <div className="tabs-container" style={{ marginBottom: '24px', overflowX: 'auto' }}>
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={17} />
          Overview & Analytics
        </button>

        <button
          className={`tab-btn ${activeTab === 'vacancies' ? 'active' : ''}`}
          onClick={() => setActiveTab('vacancies')}
        >
          <Briefcase size={17} />
          Vacancies ({internships.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('pipeline')}
        >
          <Users size={17} />
          ATS Pipeline ({applications.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'talent' ? 'active' : ''}`}
          onClick={() => setActiveTab('talent')}
        >
          <Sparkles size={17} />
          AI Talent Scout ({candidates.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'innovations' ? 'active' : ''}`}
          onClick={() => setActiveTab('innovations')}
        >
          <Trophy size={17} />
          Hackathons & R&D ({innovationChallenges.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          <Star size={17} />
          Mentor & Credentials
        </button>

        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <Building size={17} />
          Corporate Profile & MoUs
        </button>
      </div>

      {/* TAB CONTENT ROUTING */}
      {activeTab === 'overview' && (
        <IndustryOverview
          internships={internships}
          applications={applications}
          candidates={candidates}
          onNavigateTab={tab => setActiveTab(tab)}
          onOpenPostModal={() => setShowPostModal(true)}
          isLight={isLight}
        />
      )}

      {activeTab === 'vacancies' && (
        <VacancyManager
          internships={internships}
          applications={applications}
          onOpenPostModal={() => setShowPostModal(true)}
          onToggleStatus={toggleOpportunityStatus}
          onDeleteOpportunity={deleteOpportunity}
          onViewApplicants={handleViewApplicantsForOpp}
          onScoutForOpp={handleScoutForOpp}
          isLight={isLight}
        />
      )}

      {activeTab === 'pipeline' && (
        <CandidatePipeline
          applications={applications}
          internships={internships}
          selectedOppFilter={selectedOppFilter}
          setSelectedOppFilter={setSelectedOppFilter}
          onOpenStatusModal={app => setStatusModalApp(app)}
          onOpenDossierModal={app => setDossierModalApp(app)}
          onOpenCredentialModal={app => setCredentialModalApp(app)}
          isLight={isLight}
        />
      )}

      {activeTab === 'talent' && (
        <TalentScout
          candidates={candidates}
          internships={internships}
          calculateCosineMatch={calculateCosineMatch}
          onSendDirectInvite={sendDirectCandidateInvitation}
          onOpenCandidatePortfolio={handleOpenCandidatePortfolio}
          isLight={isLight}
        />
      )}

      {activeTab === 'innovations' && (
        <InnovationHub
          innovationChallenges={innovationChallenges}
          facultyOpps={facultyOpps}
          onOpenNewChallengeModal={() => setShowChallengeModal(true)}
          onGradeSubmission={gradeChallengeSubmission}
          isLight={isLight}
        />
      )}

      {activeTab === 'feedback' && (
        <MentorCredentials
          applications={applications}
          onSubmitFeedback={submitMentorFeedback}
          onOpenCredentialModal={app => setCredentialModalApp(app)}
          isLight={isLight}
        />
      )}

      {activeTab === 'profile' && (
        <CompanyProfile key={activeIndustry.id} activeIndustry={activeIndustry} isLight={isLight} addToast={addToast} />
      )}

      {/* MODALS */}
      <PostOpportunityModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSubmit={handlePostSubmit}
        skillCategories={skillCategories}
        activeCompany={activeIndustry}
        isLight={isLight}
      />

      <StatusTransitionModal
        isOpen={!!statusModalApp}
        onClose={() => setStatusModalApp(null)}
        app={statusModalApp}
        onConfirmStatus={handleStatusTransition}
        isLight={isLight}
      />

      <CandidateDossierModal
        isOpen={!!dossierModalApp}
        onClose={() => setDossierModalApp(null)}
        app={dossierModalApp}
        studentProfile={studentProfile}
        onTransitionStatus={app => {
          setDossierModalApp(null);
          setStatusModalApp(app);
        }}
        isLight={isLight}
      />

      <IssueCredentialModal
        isOpen={!!credentialModalApp}
        onClose={() => setCredentialModalApp(null)}
        app={credentialModalApp}
        onIssueCredential={issueDigitalCredential}
        isLight={isLight}
      />

      <NewChallengeModal
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        onSubmit={addInnovationChallenge}
        isLight={isLight}
      />
    </div>
  );
}
