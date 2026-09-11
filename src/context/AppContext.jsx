import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_STUDENT_PROFILE,
  STUDENT_PERSONAS,
  DISCIPLINES,
  INDUSTRY_BENCHMARKS,
  INITIAL_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
  INITIAL_COLLABORATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INSTITUTION_ANALYTICS,
  SKILL_CATEGORIES,
  SKILL_COURSES,
  INDUSTRIES,
  INSTITUTIONS,
  REGISTERED_CANDIDATES,
  INITIAL_INNOVATION_CHALLENGES
} from '../data/mockData';
import db from '../lib/db';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Active Navigation View: 'landing' | 'dashboard'
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('ayush_current_view') || 'landing';
  });

  // Global Auth Modal State
  const [authModalState, setAuthModalState] = useState({ open: false, mode: 'register' });
  const openAuthModal = (mode = 'register') => setAuthModalState({ open: true, mode });
  const closeAuthModal = () => setAuthModalState({ open: false, mode: 'register' });

  // Global Database & Credential Vault Modal State
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const openDatabaseModal = () => setShowDatabaseModal(true);
  const closeDatabaseModal = () => setShowDatabaseModal(false);

  // Current authenticated user session (from Supabase or local persistent auth)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_active_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Global Accessibility: Theme ('dark' | 'light') - Default to light theme
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('ayush_theme_v3');
    if (!saved) {
      localStorage.setItem('ayush_theme_v3', 'light');
      localStorage.setItem('ayush_theme', 'light');
      return 'light';
    }
    return localStorage.getItem('ayush_theme') || 'light';
  });

  // Global Accessibility: Font Size ('small' | 'normal' | 'large')
  const [fontSize, setFontSizeState] = useState(() => {
    return localStorage.getItem('ayush_font_size') || 'normal';
  });

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const setFontSize = (newSize) => {
    setFontSizeState(newSize);
  };

  // Active User Role: 'student' | 'academia' | 'institution' | 'industry'
  const [role, setRoleState] = useState(() => {
    const raw = localStorage.getItem('ayush_role') || 'student';
    if (raw === 'faculty') return 'academia';
    if (raw === 'admin') return 'institution';
    return raw;
  });

  const setRole = (newRole) => {
    let normalized = (newRole || 'student').toLowerCase();
    if (normalized === 'faculty') normalized = 'academia';
    if (normalized === 'admin') normalized = 'institution';
    setRoleState(normalized);
  };

  // Synchronize active role whenever authenticated user changes
  useEffect(() => {
    if (currentUser?.role) {
      setRole(currentUser.role);
    }
    if (currentUser?.role === 'student' && currentUser?.fullName) {
      setStudentProfile(prev => ({
        ...INITIAL_STUDENT_PROFILE,
        ...prev,
        name: currentUser.fullName,
        full_name: currentUser.fullName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone
      }));
    }
  }, [currentUser]);

  // Multidisciplinary Discipline Filter: 'all' | 'engineering' | 'commerce' | 'healthcare'
  const [activeDiscipline, setActiveDiscipline] = useState(() => {
    return localStorage.getItem('ayush_discipline') || 'all';
  });

  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('ayush_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STUDENT_PROFILE,
          ...parsed,
          skills: parsed.skills || INITIAL_STUDENT_PROFILE.skills,
          projects: parsed.projects || INITIAL_STUDENT_PROFILE.projects || [],
          credentials: parsed.credentials || INITIAL_STUDENT_PROFILE.credentials || []
        };
      }
    } catch (_) {}
    return INITIAL_STUDENT_PROFILE;
  });

  const switchStudentPersona = (personaKey) => {
    if (STUDENT_PERSONAS[personaKey]) {
      const p = STUDENT_PERSONAS[personaKey];
      setStudentProfile(p);
      localStorage.setItem('ayush_student', JSON.stringify(p));
      addToast(`Switched active profile: ${p.name} (${p.course})`, 'success');
    }
  };

  const [internships, setInternships] = useState(() => {
    const saved = localStorage.getItem('ayush_internships');
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('ayush_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [facultyOpps, setFacultyOpps] = useState(() => {
    const saved = localStorage.getItem('ayush_faculty_opps');
    return saved ? JSON.parse(saved) : INITIAL_COLLABORATIONS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('ayush_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('ayush_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [analytics, setAnalytics] = useState(() => {
    const saved = localStorage.getItem('ayush_analytics');
    return saved ? JSON.parse(saved) : INSTITUTION_ANALYTICS;
  });

  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem('ayush_candidates');
    return saved ? JSON.parse(saved) : REGISTERED_CANDIDATES;
  });

  const [innovationChallenges, setInnovationChallenges] = useState(() => {
    const saved = localStorage.getItem('ayush_challenges');
    return saved ? JSON.parse(saved) : INITIAL_INNOVATION_CHALLENGES;
  });

  // Configurable Match Score Threshold (TRD Section 5: defaults to 60%)
  const [matchThreshold, setMatchThreshold] = useState(60);

  const [toasts, setToasts] = useState([]);

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('ayush_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('ayush_current_view', currentView);
  }, [currentView]);

  // Synchronize theme to document root and body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ayush_theme', theme);
    localStorage.setItem('ayush_theme_v3', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  }, [theme]);

  // Synchronize font size to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('ayush_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('ayush_student', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('ayush_internships', JSON.stringify(internships));
  }, [internships]);

  useEffect(() => {
    localStorage.setItem('ayush_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('ayush_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ayush_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Toast Notification System
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper: Append to Audit Log (backend_schema.sql Section 10)
  const logAuditEvent = (action, entityType, entityId, metadata = {}) => {
    const newLog = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actor_id: role === 'student' ? studentProfile.id : role === 'industry' ? 'usr-him-hr' : 'usr-admin-01',
      actor_name: role === 'student' ? studentProfile.name : role === 'industry' ? 'Himalaya Talent Partner' : 'AIIA Directorate',
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      ip_address: '14.139.60.22',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper: Dispatch in-app notification (backend_schema.sql Section 8)
  const dispatchNotification = (title, body, metadata = {}) => {
    const newNotif = {
      id: `notif-${Date.now().toString().slice(-4)}`,
      user_id: studentProfile.id,
      channel: 'in_app',
      title,
      body,
      metadata,
      is_read: false,
      sent_at: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  /**
   * TRD Section 5: Matching Engine
   * Mathematical Vector Cosine Similarity:
   * sim(u, v) = (u . v) / (||u|| * ||v||)
   */
  const calculateCosineMatch = (candidateSkills = {}, requiredSkills = {}) => {
    const cSkills = candidateSkills || {};
    const rSkills = requiredSkills || {};
    if (Object.keys(rSkills).length === 0) {
      return { score: 100, matchedSkills: [], gapSkills: [], cosineSim: 1.0 };
    }

    const skillKeys = Object.keys(rSkills);
    let dotProduct = 0;
    let candidateNormSq = 0;
    let requiredNormSq = 0;

    const matchedSkills = [];
    const gapSkills = [];

    skillKeys.forEach(skill => {
      const u = cSkills[skill] || 0;
      const v = rSkills[skill] || 50;

      dotProduct += (u * v);
      candidateNormSq += (u * u);
      requiredNormSq += (v * v);

      if (u >= v) {
        matchedSkills.push({
          skill,
          userScore: u,
          targetScore: v,
          surplus: u - v
        });
      } else {
        gapSkills.push({
          skill,
          userScore: u,
          targetScore: v,
          gap: v - u
        });
      }
    });

    const candidateNorm = Math.sqrt(candidateNormSq);
    const requiredNorm = Math.sqrt(requiredNormSq);

    let cosineSim = 0;
    if (candidateNorm > 0 && requiredNorm > 0) {
      cosineSim = dotProduct / (candidateNorm * requiredNorm);
    }

    // Convert cosine similarity [-1, 1] -> [0, 100]%
    const score = Math.min(100, Math.max(0, Math.round(cosineSim * 100)));

    return {
      score,
      cosineSim: Number(cosineSim.toFixed(3)),
      matchedSkills,
      gapSkills
    };
  };

  // Student applies to an opportunity
  const applyToOpportunity = (oppId, coverNote = '') => {
    const opp = internships.find(o => o.id === oppId);
    if (!opp) return;

    const existing = applications.find(a => a.opportunity_id === oppId && a.student_id === studentProfile.id);
    if (existing) {
      addToast(`Already applied to ${opp.title}`, 'warning');
      return;
    }

    const { score } = calculateCosineMatch(studentProfile.skills, opp.requiredSkills);

    const newAppId = `app-${Date.now().toString().slice(-4)}`;
    const newApp = {
      id: newAppId,
      opportunity_id: opp.id,
      student_id: studentProfile.id,
      studentName: studentProfile.name,
      opportunityTitle: opp.title,
      company: opp.company,
      applied_at: new Date().toISOString(),
      status: 'applied', // schema enum: applied, shortlisted, interview, offered, rejected, completed, withdrawn
      match_score: score,
      cover_note: coverNote || 'Direct application via AyushSetu platform.',
      mentor_id: null,
      interview_date: null,
      history: [
        {
          id: `h-${Date.now()}`,
          old_status: null,
          new_status: 'applied',
          remarks: 'Application submitted by candidate via portal',
          changed_at: 'Just now'
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    logAuditEvent('application.create', 'applications', newAppId, { opportunity_id: opp.id, score });
    dispatchNotification('Application Submitted', `Your application for "${opp.title}" at ${opp.company} has been received.`);
    addToast(`Successfully applied to ${opp.title} (${opp.company})!`, 'success');
  };

  // Recruiter updates application status in ATS pipeline with remarks (schema application_status_history)
  const updateApplicationStatus = (appId, newStatus, remarks = '', interviewDate = null) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const historyEntry = {
          id: `h-${Date.now().toString().slice(-4)}`,
          old_status: app.status,
          new_status: newStatus,
          remarks: remarks || `Status transitioned to ${newStatus}`,
          changed_at: 'Just now'
        };

        return {
          ...app,
          status: newStatus,
          interview_date: interviewDate !== null ? interviewDate : app.interview_date,
          history: [...(app.history || []), historyEntry]
        };
      }
      return app;
    }));

    logAuditEvent('application.status_update', 'applications', appId, { newStatus, remarks });
    dispatchNotification(
      `Application Status: ${newStatus.toUpperCase()}`,
      `Your application (${appId}) was updated to: ${newStatus}. Remarks: "${remarks || 'Reviewed by recruiter'}"`
    );
    addToast(`Application status updated to: ${newStatus.toUpperCase()}`, 'info');
  };

  // Submit Mentor Feedback (schema mentor_feedback)
  const submitMentorFeedback = (appId, rating, feedbackText) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          feedback: {
            rating,
            text: feedbackText
          }
        };
      }
      return app;
    }));
    logAuditEvent('mentor_feedback.create', 'mentor_feedback', appId, { rating });
    addToast('Mentor feedback and rating recorded!', 'success');
  };

  // Recruiter posts new opportunity
  const addOpportunity = (newOpp) => {
    const oppId = `opp-${Date.now().toString().slice(-4)}`;
    const created = {
      ...newOpp,
      id: oppId,
      status: 'open',
      postedDate: new Date().toISOString().split('T')[0],
      verified: true
    };
    setInternships(prev => [created, ...prev]);
    logAuditEvent('opportunity.publish', 'opportunities', oppId, { title: created.title });
    addToast(`New opportunity "${created.title}" published!`, 'success');
  };

  // Toggle vacancy status between 'open' and 'closed'
  const toggleOpportunityStatus = (oppId) => {
    setInternships(prev => prev.map(o => {
      if (o.id === oppId) {
        const nextStatus = o.status === 'open' ? 'closed' : 'open';
        logAuditEvent('opportunity.status_toggle', 'opportunities', oppId, { status: nextStatus });
        addToast(`Opportunity status updated to ${nextStatus.toUpperCase()}`, 'info');
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  // Delete vacancy
  const deleteOpportunity = (oppId) => {
    setInternships(prev => prev.filter(o => o.id !== oppId));
    logAuditEvent('opportunity.delete', 'opportunities', oppId, {});
    addToast('Opportunity removed from listings', 'warning');
  };

  // Industry Recruiter issues verified digital credential / offer letter directly to student
  const issueDigitalCredential = (studentId, credentialData) => {
    const credId = `cred-ayush-${Date.now().toString().slice(-4)}`;
    const newCred = {
      id: credId,
      type: credentialData.type || 'internship_completion', // 'internship_completion' | 'certificate' | 'achievement'
      title: credentialData.title,
      issuer: credentialData.issuer || 'Himalaya Wellness R&D Directorate',
      issued_date: new Date().toISOString().split('T')[0],
      verified: true,
      verified_by: credentialData.issuer || 'Industry Talent Partner',
      file_url: `s3://ayush-credentials/verified_${credId}.pdf`,
      verificationHash: `SHA256:${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      badge: credentialData.badge || 'Verified Industry Credential'
    };

    // If matches currently logged-in studentProfile, push directly
    if (studentProfile.id === studentId) {
      setStudentProfile(prev => ({
        ...prev,
        credentials: [newCred, ...(prev.credentials || [])]
      }));
    }

    // Persist to unified 4-profile Database
    try {
      db.saveCredential({
        ...newCred,
        profile_id: studentId,
        recipient_name: studentProfile?.id === studentId ? studentProfile.name : 'Registered Student',
        profile_type: 'student'
      });
    } catch (_) {}

    logAuditEvent('credential.issue', 'credentials', credId, { studentId, title: newCred.title });
    dispatchNotification('Official Credential Issued', `You received "${newCred.title}" from ${newCred.issuer}!`);
    addToast(`Verifiable digital credential issued to candidate (ID: ${credId})!`, 'success');
    return newCred;
  };

  // Industry publishes new Innovation Challenge / Hackathon
  const addInnovationChallenge = (challengeData) => {
    const challengeId = `chn-${Date.now().toString().slice(-4)}`;
    const newChn = {
      ...challengeData,
      id: challengeId,
      status: 'active',
      submissions_count: 0,
      submissions: []
    };
    setInnovationChallenges(prev => [newChn, ...prev]);
    logAuditEvent('innovation_challenge.create', 'collaboration_listings', challengeId, { title: newChn.title });
    addToast(`Innovation Challenge "${newChn.title}" launched successfully!`, 'success');
  };

  // Grade student team submission for an Innovation Challenge
  const gradeChallengeSubmission = (challengeId, submissionId, score, feedback) => {
    setInnovationChallenges(prev => prev.map(chn => {
      if (chn.id === challengeId) {
        return {
          ...chn,
          submissions: (chn.submissions || []).map(sub => {
            if (sub.id === submissionId) {
              return {
                ...sub,
                score,
                feedback,
                status: 'evaluated'
              };
            }
            return sub;
          })
        };
      }
      return chn;
    }));
    logAuditEvent('challenge_submission.grade', 'innovation_challenges', submissionId, { score });
    addToast(`Submission evaluated with score: ${score}/100!`, 'success');
  };

  // Direct outreach: Recruiter sends direct interview invite to candidate
  const sendDirectCandidateInvitation = (candidate, opportunityTitle) => {
    dispatchNotification('Direct Interview Invitation', `${candidate.name}, you have received an exclusive interview invitation for ${opportunityTitle}!`);
    logAuditEvent('talent.outreach', 'users', candidate.id, { opportunityTitle });
    addToast(`Direct interview invitation dispatched to ${candidate.name}!`, 'success');
  };

  // Student completes diagnostic assessment
  const updateStudentAssessment = (updatedSkills, newReadiness) => {
    setStudentProfile(prev => ({
      ...prev,
      skills: updatedSkills,
      readinessIndex: newReadiness
    }));
    logAuditEvent('assessment.submit', 'skill_assessments', studentProfile.id, { newReadiness });
    addToast('Skill profile dynamically updated! Opportunities re-matched.', 'success');
  };

  // Add project to student portfolio
  const addProject = (project) => {
    setStudentProfile(prev => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: `proj-${Date.now().toString().slice(-3)}`, verified: true }]
    }));
    logAuditEvent('portfolio.credential_add', 'credentials', studentProfile.id, { title: project.title });
    addToast('New project artifact added to your verified portfolio!', 'success');
  };

  // Faculty applies to collaboration
  const applyFacultyCollaboration = (collabId) => {
    setFacultyOpps(prev => prev.map(f => {
      if (f.id === collabId) {
        return {
          ...f,
          appliedFacultyCount: f.appliedFacultyCount + 1,
          isUserApplied: true
        };
      }
      return f;
    }));
    logAuditEvent('collaboration.register', 'collaboration_registrations', collabId, { faculty_id: 'usr-fac-01' });
    addToast('Registration confirmed for Faculty Industry collaboration!', 'success');
  };

  // Register User (schema: users + role-specific profile tables)
  const registerUser = (userRole, data) => {
    const newUserId = `usr-${Date.now().toString().slice(-4)}`;

    if (userRole === 'student') {
      const inst = institutions.find(i => i.id === data.institutionId) || institutions[0];
      const newStudent = {
        id: newUserId,
        user_id: newUserId,
        enrollment_no: data.enrollmentNo || 'AIIA/2026/' + Math.floor(100 + Math.random() * 900),
        name: data.fullName,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || '+91 98765 00000',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        institution_id: inst.id,
        institution: inst.name,
        department: data.department || 'Ayurvedic Medicine & Clinical Research',
        course: data.course || 'Bachelor of Ayurvedic Medicine & Surgery (BAMS)',
        year_of_study: Number(data.yearOfStudy) || 4,
        graduation_year: Number(data.graduationYear) || 2026,
        cgpa: 8.5,
        bio: `Registered student scholar at ${inst.name}.`,
        linkedin_url: '',
        github_url: '',
        resume_url: 's3://aiia-vault/resumes/student_cv.pdf',
        readinessIndex: 58,
        skills: {
          'Ayurvedic Pharmacology & Phytochemistry': 65,
          'Clinical Trials & GCP Protocols': 50,
          'Ayur-Informatics & Computational Biology': 40,
          'Pharmacovigilance & Drug Safety': 60,
          'Regulatory Affairs & Compliance (AYUSH/CDSCO)': 50,
          'Formulation & Analytical Chemistry (HPLC/HPTLC)': 55,
          'Biostatistics & Data Analytics': 45,
          'Research Methodology & Scientific Writing': 70
        },
        credentials: [],
        projects: []
      };
      setStudentProfile(newStudent);
      setRole('student');
      addToast(`Student account for ${data.fullName} registered successfully!`, 'success');
    } else if (userRole === 'industry') {
      setRole('industry');
      addToast(`Industry recruiter account for ${data.companyName} registered!`, 'success');
    } else if (userRole === 'faculty') {
      setRole('faculty');
      addToast(`Faculty profile for ${data.fullName} registered!`, 'success');
    } else if (userRole === 'admin') {
      setRole('admin');
      addToast(`Institutional administration portal activated for ${data.fullName}!`, 'success');
    }

    logAuditEvent('user.register', 'users', newUserId, { role: userRole, email: data.email });
    dispatchNotification('Registration Successful', `Welcome to AyushSetu, ${data.fullName}! Your ${userRole} account is active.`);
  };

  // Login / Persona Switcher
  const loginUser = (roleId) => {
    let normalizedRole = (roleId || 'student').toLowerCase();
    if (normalizedRole === 'faculty') normalizedRole = 'academia';
    if (normalizedRole === 'admin') normalizedRole = 'institution';

    setRole(normalizedRole);
    setCurrentView('dashboard');
    logAuditEvent('user.login', 'users', roleId, { role: normalizedRole });
    addToast(`Signed in as ${normalizedRole.toUpperCase()} persona.`, 'info');
  };

  // Sign out
  const logout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    try {
      localStorage.removeItem('portal_active_session');
      localStorage.removeItem('ayushsetu_active_session');
    } catch (e) {}
    addToast('Signed out of portal.', 'info');
  };

  // Reset demo state
  const resetDemoState = () => {
    localStorage.clear();
    setStudentProfile(INITIAL_STUDENT_PROFILE);
    setInternships(INITIAL_OPPORTUNITIES);
    setApplications(INITIAL_APPLICATIONS);
    setFacultyOpps(INITIAL_COLLABORATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAnalytics(INSTITUTION_ANALYTICS);
    setMatchThreshold(60);
    addToast('Demo state reset to clean seed data', 'info');
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      currentUser,
      setCurrentUser,
      role,
      setRole,
      logout,
      theme,
      setTheme,
      toggleTheme,
      fontSize,
      setFontSize,
      authModalState,
      openAuthModal,
      closeAuthModal,
      studentProfile,
      internships,
      applications,
      facultyOpps,
      notifications,
      auditLogs,
      analytics,
      candidates,
      setCandidates,
      innovationChallenges,
      setInnovationChallenges,
      benchmarks: INDUSTRY_BENCHMARKS || [],
      skillCategories: SKILL_CATEGORIES,
      skillCourses: SKILL_COURSES,
      industries: INDUSTRIES,
      institutions: INSTITUTIONS,
      matchThreshold,
      setMatchThreshold,
      toasts,
      addToast,
      removeToast,
      calculateCosineMatch,
      applyToOpportunity,
      addOpportunity,
      toggleOpportunityStatus,
      deleteOpportunity,
      issueDigitalCredential,
      addInnovationChallenge,
      gradeChallengeSubmission,
      sendDirectCandidateInvitation,
      updateApplicationStatus,
      submitMentorFeedback,
      updateStudentAssessment,
      addProject,
      applyFacultyCollaboration,
      registerUser,
      loginUser,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      resetDemoState,
      disciplines: DISCIPLINES,
      studentPersonas: STUDENT_PERSONAS,
      activeDiscipline,
      setActiveDiscipline,
      switchStudentPersona,
      db,
      showDatabaseModal,
      setShowDatabaseModal,
      openDatabaseModal,
      closeDatabaseModal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
