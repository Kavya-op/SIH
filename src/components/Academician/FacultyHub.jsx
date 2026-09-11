import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Building,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  Users,
  Send,
  Sparkles,
  ExternalLink,
  Plus,
  UserCheck,
  Briefcase,
  Star,
  GraduationCap,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Tag
} from 'lucide-react';

export default function FacultyHub() {
  const { facultyOpps, applyFacultyCollaboration, addToast, theme } = useApp();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'mentor' | 'collaborations'
  const [filterDomain, setFilterDomain] = useState('all');
  const [facultyDisciplineFilter, setFacultyDisciplineFilter] = useState('all'); // all | engineering | commerce | healthcare
  const [showProposalModal, setShowProposalModal] = useState(false);

  // 1. Research Interests State (Multidisciplinary)
  const [researchInterests, setResearchInterests] = useState([
    'Edge-AI & Autonomous Robotics Swarms',
    'Algorithmic Trading & FinTech Quantitative Risk',
    'Reverse Pharmacology & LC-MS/MS Characterization',
    'Embedded GaN Micro-Inverters & Smart Grids',
    'Clinical GCP Trials & CTRI Pharmacovigilance'
  ]);
  const [newInterestInput, setNewInterestInput] = useState('');
  const [showAddInterest, setShowAddInterest] = useState(false);

  // 2. Ongoing Academic Projects State (Multidisciplinary: Engineering, Commerce, Healthcare)
  const [ongoingProjects, setOngoingProjects] = useState([
    {
      id: 'proj-eng-01',
      title: 'Edge-AI Swarm Intelligence for Autonomous UAV Infrastructure Inspection',
      sponsor: 'DST & Google DeepMind Labs Grant',
      grantAmount: '₹48,00,000',
      sanctionYear: '2025–2027',
      progress: 65,
      phase: 'Phase II Autonomous Field Trials',
      industryPartner: 'Google India R&D & DeepMind',
      discipline: 'engineering',
      coInvestigators: ['Prof. V. Ramgopal Rao (IITD)', 'Dr. Sunita Sen'],
      studentScholars: 4
    },
    {
      id: 'proj-com-02',
      title: 'Algorithmic Market Making & Systemic Risk in High-Frequency Trading',
      sponsor: 'SEBI & National Stock Exchange (NSE) Initiative',
      grantAmount: '₹32,50,000',
      sanctionYear: '2024–2026',
      progress: 80,
      phase: 'Backtesting & Co-Integration Engine Validation',
      industryPartner: 'Goldman Sachs Global Finance',
      discipline: 'commerce',
      coInvestigators: ['Prof. R. C. Sharma (SRCC)', 'Dr. Priya Mehta'],
      studentScholars: 3
    },
    {
      id: 'proj-mech-03',
      title: 'Autonomous EV Powertrain Dynamics & 6-DOF Robotic Calibration',
      sponsor: 'Ministry of Heavy Industries & Tata Motors',
      grantAmount: '₹42,00,000',
      sanctionYear: '2025–2027',
      progress: 50,
      phase: 'Hardware-in-the-Loop Simulation',
      industryPartner: 'Tata Motors Tech Center',
      discipline: 'engineering',
      coInvestigators: ['Dr. Karan Malhotra (BITS Pilani)'],
      studentScholars: 3
    },
    {
      id: 'proj-ayush-01',
      title: 'LC-MS Fingerprinting & Active Metabolite Profiling of Classical Guduchi Formulations',
      sponsor: 'Ministry of Ayush (Extra-Mural Research Scheme)',
      grantAmount: '₹34,50,000',
      sanctionYear: '2024–2026',
      progress: 75,
      phase: 'Phase III Analytical Validation',
      industryPartner: 'Dabur Research Foundation',
      discipline: 'healthcare',
      coInvestigators: ['Dr. V. K. Joshi', 'Dr. S. K. Gupta'],
      studentScholars: 3
    },
    {
      id: 'proj-ayush-02',
      title: 'In Silico Computational Screening of Rasayana Herbs Targeting Neurodegenerative Biomarkers',
      sponsor: 'CCRAS Collaborative Grant',
      grantAmount: '₹18,20,000',
      sanctionYear: '2025–2027',
      progress: 40,
      phase: 'Molecular Dynamics & Docking Phase',
      industryPartner: 'MedGenome Labs',
      discipline: 'healthcare',
      coInvestigators: ['Prof. R. N. Acharya'],
      studentScholars: 2
    }
  ]);

  // 3. Industrial Training Mentor Listing State (Multidisciplinary Scholars)
  const [isMentorListed, setIsMentorListed] = useState(true);
  const [mentorSpecialization, setMentorSpecialization] = useState('Multidisciplinary Academic-Industry Mentorship');
  const [assignedMentees, setAssignedMentees] = useState([
    {
      id: 'mentee-cs-01',
      name: 'Aditya Varma',
      enrollment: 'IITD/2022/CS/084',
      company: 'Google India R&D',
      role: 'SDE Intern (Cloud & AI)',
      discipline: 'engineering',
      status: 'On-Track',
      period: 'Jan 2026 – Jun 2026',
      rating: 4.9
    },
    {
      id: 'mentee-com-02',
      name: 'Rhea Chawla',
      enrollment: 'SRCC/2023/BCOM/142',
      company: 'Goldman Sachs Global Finance',
      role: 'Quantitative FinTech Analyst',
      discipline: 'commerce',
      status: 'On-Track',
      period: 'Jan 2026 – Jun 2026',
      rating: 5.0
    },
    {
      id: 'mentee-mech-03',
      name: 'Karan Singhania',
      enrollment: 'BITS/2022/MECH/055',
      company: 'Tata Motors Tech Center',
      role: 'Autonomous EV Robotics Intern',
      discipline: 'engineering',
      status: 'On-Track',
      period: 'Jan 2026 – Jun 2026',
      rating: 4.9
    },
    {
      id: 'mentee-hlth-04',
      name: 'Aarav Sharma',
      enrollment: 'AIIA/2022/BAMS/042',
      company: 'Himalaya Wellness Company',
      role: 'Clinical Research Intern',
      discipline: 'healthcare',
      status: 'On-Track',
      period: 'Jan 2026 – Jun 2026',
      rating: 4.8
    }
  ]);

  const [proposalForm, setProposalForm] = useState({
    title: '',
    targetIndustry: 'Dabur Research Foundation',
    domain: 'Phytochemistry & Herbal Standardization',
    budget: '₹8,00,000',
    description: ''
  });

  const domains = ['all', 'Phytochemistry & Analytical Instrumentation', 'Computational Ayur-Informatics', 'Standardization & Pharmacodynamics'];

  const filteredOpps = facultyOpps.filter(opp => {
    if (filterDomain !== 'all' && opp.domain !== filterDomain) return false;
    return true;
  });

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (!newInterestInput.trim()) return;
    setResearchInterests(prev => [...prev, newInterestInput.trim()]);
    addToast(`Added research interest: "${newInterestInput.trim()}"`, 'success');
    setNewInterestInput('');
    setShowAddInterest(false);
  };

  const handleToggleMentorListing = () => {
    const nextState = !isMentorListed;
    setIsMentorListed(nextState);
    if (nextState) {
      addToast('Profile listed on the National Ayush Industrial Mentor Directory!', 'success');
    } else {
      addToast('Mentor status paused. Industrial partners will not assign new interns.', 'info');
    }
  };

  const handleProposalSubmit = (e) => {
    e.preventDefault();
    addToast(`Joint Research Proposal "${proposalForm.title}" submitted to ${proposalForm.targetIndustry}!`, 'success');
    setShowProposalModal(false);
    setProposalForm({
      title: '',
      targetIndustry: 'Dabur Research Foundation',
      domain: 'Phytochemistry & Herbal Standardization',
      budget: '₹8,00,000',
      description: ''
    });
  };

  return (
    <div className="container" style={{ padding: '24px 24px 60px 24px' }}>
      {/* Faculty Executive Banner */}
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
            🔬
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.45rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                Prof. Dr. Ananya Trivedi
              </h2>
              <span className="badge badge-blue">Head of Department • Dravyaguna</span>
              {isMentorListed && (
                <span className="badge badge-emerald">
                  <CheckCircle2 size={12} /> Listed Industry Mentor
                </span>
              )}
            </div>
            <p style={{ margin: '4px 0 0 0', color: isLight ? '#475569' : 'var(--text-secondary)', fontSize: '0.88rem' }}>
              All India Institute of Ayurveda (AIIA) • ORCID: 0000-0002-1825-009X • Scopus ID: 57201948200
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleToggleMentorListing}
            className={`btn ${isMentorListed ? 'btn-secondary' : 'btn-primary'} rounded-full px-5 py-2.5 font-bold`}
            style={{ gap: '8px' }}
          >
            <UserCheck size={16} />
            {isMentorListed ? 'Mentor Status: Active' : 'List as Industry Mentor'}
          </button>

          <button
            onClick={() => setShowProposalModal(true)}
            className="btn btn-primary rounded-full px-6 py-2.5 font-bold shadow-lg shadow-blue-600/30"
            style={{ gap: '8px' }}
          >
            <Send size={15} />
            Propose Joint Project
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <BookOpen size={18} />
          Research Interests & Ongoing Academic Projects ({ongoingProjects.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'mentor' ? 'active' : ''}`}
          onClick={() => setActiveTab('mentor')}
        >
          <UserCheck size={18} />
          Industrial Training Mentor Listing ({assignedMentees.length} Mentees)
        </button>

        <button
          className={`tab-btn ${activeTab === 'collaborations' ? 'active' : ''}`}
          onClick={() => setActiveTab('collaborations')}
        >
          <Briefcase size={18} />
          Industry Sabbaticals & Grant RFPs ({filteredOpps.length})
        </button>
      </div>

      {/* TAB 1: Research Interests & Ongoing Academic Projects */}
      {activeTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* SECTION 1: FACULTY RESEARCH INTERESTS */}
          <div className="glass-panel" style={{ padding: '24px 28px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={18} color={isLight ? '#2563eb' : '#38bdf8'} />
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                    Faculty Research Interests & Specializations
                  </h3>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                  Core scholarly specializations verified by AIIA Academic Council for sponsored industry matching
                </p>
              </div>

              <button
                onClick={() => setShowAddInterest(!showAddInterest)}
                className="btn btn-outline btn-sm rounded-full px-4 py-1.5 font-semibold"
                style={{ gap: '6px' }}
              >
                <Plus size={14} />
                {showAddInterest ? 'Cancel' : 'Add Research Interest'}
              </button>
            </div>

            {/* Interactive Add Tag Form */}
            {showAddInterest && (
              <form onSubmit={handleAddInterest} style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                <input
                  type="text"
                  placeholder="e.g. Metabolomics, Ayur-Genomics, Clinical Biostatistics..."
                  value={newInterestInput}
                  onChange={e => setNewInterestInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.8)',
                    border: isLight ? '1.5px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: isLight ? '#0f172a' : '#fff',
                    fontSize: '0.85rem'
                  }}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm rounded-full px-5 py-2 font-bold">
                  Add Tag
                </button>
              </form>
            )}

            {/* Research Interest Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {researchInterests.map((interest, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 16px',
                    borderRadius: '9999px',
                    background: isLight ? '#eff6ff' : 'linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(56, 189, 248, 0.12) 100%)',
                    border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.4)',
                    color: isLight ? '#1d4ed8' : '#93c5fd',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <Sparkles size={13} color={isLight ? '#2563eb' : '#38bdf8'} />
                  <span>{interest}</span>
                </div>
              ))}
            </div>

            {/* Academic Output Counters */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '20px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Citations</div>
                <div className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-1">1,420+</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>H-Index</div>
                <div className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-1">18</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Publications in Scopus</div>
                <div className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-1">42 Papers</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patents Filed / Granted</div>
                <div className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mt-1">3 Formulations</div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ONGOING ACADEMIC PROJECTS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                  Ongoing Academic Projects & Sponsored Industrial Labs
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                  Active sponsored research grants across Engineering, FinTech, and Healthcare with live milestones
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Branch Track Filter */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All Tracks' },
                    { id: 'engineering', label: '💻 B.Tech Eng & AI' },
                    { id: 'commerce', label: '📊 Commerce & FinTech' },
                    { id: 'healthcare', label: '🩺 Healthcare' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFacultyDisciplineFilter(tab.id)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: facultyDisciplineFilter === tab.id ? '1.5px solid #3b82f6' : isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.12)',
                        background: facultyDisciplineFilter === tab.id ? '#2563eb' : isLight ? '#ffffff' : 'rgba(255,255,255,0.05)',
                        color: facultyDisciplineFilter === tab.id ? '#ffffff' : isLight ? '#334155' : '#cbd5e1'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowProposalModal(true)}
                  className="btn btn-primary btn-sm rounded-full px-5 py-2 font-bold shadow-md shadow-blue-600/20"
                  style={{ gap: '6px' }}
                >
                  <Plus size={14} /> New Project Proposal
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ongoingProjects
                .filter(p => facultyDisciplineFilter === 'all' || p.discipline === facultyDisciplineFilter)
                .map(proj => (
                <div
                  key={proj.id}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    borderLeft: `4px solid ${
                      proj.discipline === 'engineering' ? '#38bdf8' :
                      proj.discipline === 'commerce' ? '#f59e0b' : '#10b981'
                    }`,
                    border: isLight ? '1px solid #cbd5e1' : undefined,
                    borderLeftWidth: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span
                          className={`badge ${
                            proj.discipline === 'engineering'
                              ? 'badge-sky'
                              : proj.discipline === 'commerce'
                              ? 'badge-amber'
                              : 'badge-emerald'
                          }`}
                          style={{ fontSize: '0.7rem', fontWeight: 700 }}
                        >
                          {proj.discipline === 'engineering'
                            ? '💻 B.Tech Engineering'
                            : proj.discipline === 'commerce'
                            ? '📊 Commerce & FinTech'
                            : '🩺 Healthcare & Ayush'}
                        </span>
                        <span className="badge badge-blue">{proj.sponsor}</span>
                        <span className="badge badge-sky">{proj.sanctionYear}</span>
                        <span className="badge badge-emerald">Active Grant</span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff', lineHeight: 1.4 }}>
                        {proj.title}
                      </h4>
                      <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginTop: '6px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span>🏢 Industrial Partner: <strong style={{ color: isLight ? '#0f172a' : 'inherit' }}>{proj.industryPartner}</strong></span>
                        <span>👥 Scholar Researchers: <strong style={{ color: isLight ? '#0f172a' : 'inherit' }}>{proj.studentScholars} assigned</strong></span>
                        <span>💰 Sanctioned Grant: <strong style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>{proj.grantAmount}</strong></span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>Project Progress</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isLight ? '#1d4ed8' : '#38bdf8' }}>{proj.progress}%</div>
                      <div style={{ fontSize: '0.74rem', color: isLight ? '#475569' : '#94a3b8' }}>{proj.phase}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-bar-bg" style={{ height: '8px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${proj.progress}%`,
                        background: 'linear-gradient(90deg, #2563eb, #38bdf8)'
                      }}
                    />
                  </div>

                  {/* Co-Investigators Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: isLight ? '#64748b' : 'var(--text-muted)', borderTop: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <div>
                      Co-Investigators: <strong style={{ color: isLight ? '#0f172a' : '#cbd5e1' }}>{proj.coInvestigators.join(', ')}</strong>
                    </div>
                    <div style={{ color: isLight ? '#2563eb' : '#38bdf8' }}>
                      Milestone Schedule: Verified in AyushSetu R&D Registry
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Industrial Training Mentor Listing */}
      {activeTab === 'mentor' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Status Card */}
          <div className="glass-panel" style={{ padding: '24px 28px', border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCheck size={20} color={isLight ? '#2563eb' : '#38bdf8'} />
                  <h3 style={{ fontSize: '1.25rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                    Industrial Training Mentor Registry
                  </h3>
                  <span className={`badge ${isMentorListed ? 'badge-emerald' : 'badge-amber'}`}>
                    {isMentorListed ? 'Active in National Registry' : 'Listing Paused'}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                  Faculty mentors oversee student scholars placed in pharmaceutical R&D, clinical trials & manufacturing internships.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={handleToggleMentorListing}
                  className={`btn ${isMentorListed ? 'btn-primary' : 'btn-outline'} btn-sm`}
                  style={{ gap: '8px' }}
                >
                  {isMentorListed ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  <span>{isMentorListed ? 'Listing is Active' : 'Enable Mentor Listing'}</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '20px' }}>
              <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>Assigned Student Interns</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginTop: '4px' }}>{assignedMentees.length}</div>
                <div style={{ fontSize: '0.72rem', color: isLight ? '#2563eb' : '#38bdf8', marginTop: '2px' }}>Himalaya, Dabur & Charak</div>
              </div>

              <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>Industry Mentor Rating</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: isLight ? '#d97706' : '#38bdf8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>4.9</span>
                  <Star size={18} fill={isLight ? '#d97706' : '#38bdf8'} color={isLight ? '#d97706' : '#38bdf8'} />
                </div>
                <div style={{ fontSize: '0.72rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginTop: '2px' }}>From 14 verified reviews</div>
              </div>

              <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>Mentorship Domain</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', marginTop: '6px' }}>
                  {mentorSpecialization}
                </div>
                <div style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8', marginTop: '2px' }}>AYUSH GCP Protocols</div>
              </div>
            </div>
          </div>

          {/* Assigned Mentees Table / Cards */}
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 14px 0', color: isLight ? '#0f172a' : '#ffffff' }}>
              Active Industrial Training Cohort (Student Scholars Under Mentorship)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {assignedMentees.map(m => (
                <div
                  key={m.id}
                  className="glass-panel"
                  style={{
                    padding: '20px 24px',
                    border: isLight ? '1px solid #cbd5e1' : undefined,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: '1.05rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>
                        {m.name}
                      </h4>
                      <span
                        className={`badge ${
                          m.discipline === 'engineering'
                            ? 'badge-sky'
                            : m.discipline === 'commerce'
                            ? 'badge-amber'
                            : 'badge-emerald'
                        }`}
                        style={{ fontSize: '0.7rem', fontWeight: 700 }}
                      >
                        {m.discipline === 'engineering'
                          ? '💻 B.Tech Engineering'
                          : m.discipline === 'commerce'
                          ? '📊 Commerce & FinTech'
                          : '🩺 Healthcare'}
                      </span>
                      <span className="badge badge-sky">{m.enrollment}</span>
                      <span className="badge badge-emerald">{m.status}</span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginTop: '4px' }}>
                      🏢 <strong>{m.company}</strong> • Role: <strong>{m.role}</strong> • Duration: {m.period}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>Progress Rating</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: isLight ? '#d97706' : '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                        <Star size={14} fill={isLight ? '#d97706' : '#38bdf8'} color={isLight ? '#d97706' : '#38bdf8'} />
                        <span>{m.rating} / 5</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToast(`Logged mentorship feedback for ${m.name}`, 'success')}
                      className="btn btn-secondary btn-sm"
                    >
                      Submit Mentor Assessment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Industry Sabbaticals & Grant RFPs */}
      {activeTab === 'collaborations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Domain Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: '6px' }}>Filter Domain:</span>
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setFilterDomain(d)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: filterDomain === d ? '#2563eb' : (isLight ? '#f1f5f9' : 'var(--bg-surface-elevated)'),
                  color: filterDomain === d ? '#ffffff' : (isLight ? '#334155' : 'var(--text-secondary)'),
                  border: isLight ? '1px solid #cbd5e1' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {d === 'all' ? 'All Specializations' : d}
              </button>
            ))}
          </div>

      {/* Collaboration Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredOpps.map(opp => (
          <div
            key={opp.id}
            className="glass-panel"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              borderLeft: '4px solid #2563eb',
              border: isLight ? '1px solid #cbd5e1' : undefined,
              borderLeftWidth: '4px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
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
                  <span className="badge badge-purple">{opp.type?.toUpperCase()}</span>
                  <span className="badge badge-teal">{opp.mode?.toUpperCase()}</span>
                  <span className="badge badge-blue">{opp.domain}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: isLight ? '#0f172a' : '#f8fafc' }}>
                  {opp.title}
                </h3>
                <div style={{ fontSize: '0.88rem', color: isLight ? '#475569' : '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span>🏢 Host: <strong style={{ color: isLight ? '#0f172a' : 'inherit' }}>{opp.hostOrg}</strong></span>
                  <span>📍 {opp.location}</span>
                  <span>📅 Starts: {opp.startDate} ({opp.duration})</span>
                </div>
              </div>

              {opp.isUserApplied ? (
                <span className="badge badge-sky" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} />
                  Expression of Interest Submitted
                </span>
              ) : (
                <button
                  onClick={() => applyFacultyCollaboration(opp.id)}
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #38bdf8)' }}
                >
                  Apply for Fellowship / Grant
                </button>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: isLight ? '#334155' : '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
              {opp.description}
            </p>

            <div style={{
              background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
              padding: '12px 16px',
              borderRadius: '8px',
              border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.82rem'
            }}>
              <div>
                <span style={{ color: isLight ? '#64748b' : 'var(--text-muted)' }}>Eligibility: </span>
                <span style={{ color: isLight ? '#0f172a' : '#cbd5e1', fontWeight: 500 }}>{opp.eligibility}</span>
              </div>
              <div style={{ display: 'flex', gap: '18px', color: isLight ? '#334155' : '#cbd5e1' }}>
                <span>💰 <strong style={{ color: isLight ? '#1d4ed8' : 'inherit' }}>{opp.stipendOrGrant}</strong></span>
                <span>👥 {opp.appliedFacultyCount} / {opp.slots} slots applied</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

      {/* Propose Joint R&D Modal */}
      {showProposalModal && (
        <div className="modal-overlay" onClick={() => setShowProposalModal(false)}>
          <div
            className="modal-content glass-panel"
            onClick={e => e.stopPropagation()}
            style={{ padding: '28px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: isLight ? '#0f172a' : '#ffffff' }}>Propose Academic-Industry R&D Project</h3>
              <button
                onClick={() => setShowProposalModal(false)}
                style={{ background: 'transparent', border: 'none', color: isLight ? '#475569' : '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProposalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: isLight ? '#334155' : '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Project / Study Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Metal Chelation Dynamics of Classical Bhasma Formulations"
                  value={proposalForm.title}
                  onChange={e => setProposalForm({ ...proposalForm, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                    border: isLight ? '1.5px solid #cbd5e1' : '1px solid var(--border-medium)',
                    color: isLight ? '#0f172a' : '#fff',
                    borderRadius: '8px',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: isLight ? '#334155' : '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Target Industry Partner
                  </label>
                  <select
                    value={proposalForm.targetIndustry}
                    onChange={e => setProposalForm({ ...proposalForm, targetIndustry: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                      border: isLight ? '1.5px solid #cbd5e1' : '1px solid var(--border-medium)',
                      color: isLight ? '#0f172a' : '#fff',
                      borderRadius: '8px',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="Dabur Research Foundation">Dabur Research Foundation</option>
                    <option value="Himalaya Wellness Company">Himalaya Wellness Company</option>
                    <option value="MedGenome / AyurTech">MedGenome / AyurTech</option>
                    <option value="Charak Pharma Pvt Ltd">Charak Pharma Pvt Ltd</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: isLight ? '#334155' : '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Estimated Grant Budget
                  </label>
                  <input
                    type="text"
                    value={proposalForm.budget}
                    onChange={e => setProposalForm({ ...proposalForm, budget: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                      border: isLight ? '1.5px solid #cbd5e1' : '1px solid var(--border-medium)',
                      color: isLight ? '#0f172a' : '#fff',
                      borderRadius: '8px',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: isLight ? '#334155' : '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Abstract & Expected Commercial/Clinical Impact
                </label>
                <textarea
                  rows={4}
                  placeholder="Summarize methodology, required analytical instruments, and translational value..."
                  value={proposalForm.description}
                  onChange={e => setProposalForm({ ...proposalForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
                    border: isLight ? '1.5px solid #cbd5e1' : '1px solid var(--border-medium)',
                    color: isLight ? '#0f172a' : '#fff',
                    borderRadius: '8px',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Transmit to Industry Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
