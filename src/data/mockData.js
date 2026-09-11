// Database Seed aligned with TRD_Academia_Industry_Portal.md and backend_schema.sql
// SIH Problem Statement ID: 26044
// Multidisciplinary Academia-Industry Portal: Engineering (B.Tech), Commerce & Management, and Healthcare

export const DISCIPLINES = [
  { id: 'all', label: 'All Disciplines', icon: '🌐' },
  { id: 'engineering', label: 'B.Tech Engineering & AI', icon: '💻' },
  { id: 'commerce', label: 'Commerce & Management', icon: '📊' },
  { id: 'healthcare', label: 'Healthcare & Life Sciences', icon: '🩺' }
];

export const INSTITUTIONS = [
  {
    id: 'inst-iitd-01',
    name: 'Indian Institute of Technology (IIT) Delhi',
    type: 'Institute of National Importance (INI)',
    address: 'Hauz Khas, New Delhi, Delhi 110016',
    domain: 'iitd.ac.in',
    verification_status: 'verified',
    discipline: 'engineering'
  },
  {
    id: 'inst-srcc-02',
    name: 'Shri Ram College of Commerce (SRCC), Delhi University',
    type: 'Premier Central College (University of Delhi)',
    address: 'Maurice Nagar, University Enclave, Delhi 110007',
    domain: 'srcc.du.ac.in',
    verification_status: 'verified',
    discipline: 'commerce'
  },
  {
    id: 'inst-bits-03',
    name: 'Birla Institute of Technology and Science (BITS) Pilani',
    type: 'Deemed University & Institute of Eminence',
    address: 'Vidya Vihar, Pilani, Rajasthan 333031',
    domain: 'pilani.bits-pilani.ac.in',
    verification_status: 'verified',
    discipline: 'engineering'
  },
  {
    id: 'inst-aiia-04',
    name: 'All India Institute of Ayurveda (AIIA), New Delhi',
    type: 'Autonomous Apex Institute (Ministry of Ayush)',
    address: 'Gautampuri, Sarita Vihar, Mathura Road, New Delhi, Delhi 110076',
    domain: 'aiia.gov.in',
    verification_status: 'verified',
    discipline: 'healthcare'
  },
  {
    id: 'inst-nia-05',
    name: 'National Institute of Ayurveda (Deemed to be University)',
    type: 'Deemed to be University',
    address: 'Jorawar Singh Gate, Amer Road, Jaipur, Rajasthan',
    domain: 'nia.nic.in',
    verification_status: 'verified',
    discipline: 'healthcare'
  }
];

export const INDUSTRIES = [
  {
    id: 'ind-google-01',
    name: 'Google India R&D & DeepMind Labs',
    industry_sector: 'Software Engineering, Cloud & Artificial Intelligence',
    website: 'https://careers.google.com',
    address: 'Google Signature Towers, Sector 15, Gurugram / Bengaluru',
    verification_status: 'verified',
    discipline: 'engineering',
    cin: 'U72900KA2004PTC033228',
    gstin: '29AAACG9876R1ZT',
    logo: '🌐'
  },
  {
    id: 'ind-goldman-02',
    name: 'Goldman Sachs Global Quantitative & FinTech Solutions',
    industry_sector: 'Quantitative Finance, FinTech & Investment Banking',
    website: 'https://goldmansachs.com',
    address: 'Helios Business Park, Kadubeesanahalli, Bengaluru 560103',
    verification_status: 'verified',
    discipline: 'commerce',
    cin: 'U74140KA2006FTC039981',
    gstin: '29AAACG1234F1Z8',
    logo: '📈'
  },
  {
    id: 'ind-tata-03',
    name: 'Tata Motors & Autonomous Robotics Tech Center',
    industry_sector: 'Mechatronics, Autonomous Vehicles & Heavy Engineering',
    website: 'https://tatamotors.com',
    address: 'Pimpri Research & Engineering Center, Pune, Maharashtra 411018',
    verification_status: 'verified',
    discipline: 'engineering',
    cin: 'L28920MH1945PLC004520',
    gstin: '27AAACT2727Q1ZW',
    logo: '⚙️'
  },
  {
    id: 'ind-deloitte-04',
    name: 'Deloitte Advisory, Risk Analytics & Tax Services',
    industry_sector: 'Audit, Valuation, Corporate Tax & Business Intelligence',
    website: 'https://deloitte.com/in',
    address: 'Deloitte Drive, Hitec City, Hyderabad, Telangana 500081',
    verification_status: 'verified',
    discipline: 'commerce',
    cin: 'U74140TG2000PTC035411',
    gstin: '36AAACD5544K1ZF',
    logo: '📊'
  },
  {
    id: 'ind-himalaya-05',
    name: 'Himalaya Wellness Company',
    industry_sector: 'Pharmaceuticals, Phytotherapy & Clinical Pharmacology',
    website: 'https://himalayawellness.in',
    address: 'Makali, Bengaluru, Karnataka 562162',
    verification_status: 'verified',
    discipline: 'healthcare',
    cin: 'U24233MH1930PLC001234',
    gstin: '29AAACH1234F1Z5',
    logo: '🌿'
  },
  {
    id: 'ind-dabur-06',
    name: 'Dabur Research Foundation (DRF)',
    industry_sector: 'Ayurvedic Formulations & Analytical QC',
    website: 'https://dabur.com',
    address: 'Site IV, Sahibabad Industrial Area, Ghaziabad, UP 201010',
    verification_status: 'verified',
    discipline: 'healthcare',
    cin: 'L24230DL1975PLC007908',
    gstin: '07AAACD0123E1Z1',
    logo: '🍃'
  }
];

export const SKILL_CATEGORIES = [
  // B.Tech Engineering & Technology
  'Data Structures & System Design',
  'Artificial Intelligence & Machine Learning',
  'Full-Stack & Cloud Architecture (React/Node/AWS)',
  'Embedded Systems & IoT Robotics',
  'CAD/CAM & Mechanical Mechatronics',

  // Commerce & Management
  'Financial Modeling & Valuation (DCF/LBO)',
  'Corporate Accounting & GST/Taxation',
  'Business Analytics & PowerBI/SQL',
  'Investment Banking & Equity Research',
  'Supply Chain Management & Logistics',

  // Healthcare & Life Sciences
  'Clinical Trials & GCP Protocols',
  'Pharmacovigilance & Drug Safety',
  'Ayurvedic Pharmacology & Phytochemistry',
  'Formulation & Analytical Chemistry (HPLC/HPTLC)',
  'Research Methodology & Scientific Writing'
];

// Multiple Demonstrative Personas across B.Tech, Commerce, and Healthcare
export const STUDENT_PERSONAS = {
  aditya_cs: {
    id: 'stu-cs-101',
    user_id: 'stu-cs-101',
    enrollment_no: 'IITD/2022/CS/084',
    name: 'Aditya Varma',
    full_name: 'Aditya Varma',
    email: 'aditya.varma@iitd.ac.in',
    phone: '+91 98101 23456',
    role: 'student',
    discipline: 'engineering',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    institution_id: 'inst-iitd-01',
    institution: 'Indian Institute of Technology (IIT) Delhi',
    department: 'Department of Computer Science & Engineering',
    course: 'B.Tech in Computer Science & Engineering (Minor in AI)',
    year_of_study: 4,
    graduation_year: 2026,
    cgpa: 9.42,
    bio: 'Senior year B.Tech CSE researcher specializing in Distributed Systems, LLM Agent architectures, and Cloud Microservices.',
    linkedin_url: 'https://linkedin.com/in/aditya-varma-iitd',
    github_url: 'https://github.com/aditya-varma-cs',
    resume_url: 's3://portal-vault/resumes/aditya_varma_cv.pdf',
    readinessIndex: 92,
    skills: {
      'Data Structures & System Design': 95,
      'Artificial Intelligence & Machine Learning': 90,
      'Full-Stack & Cloud Architecture (React/Node/AWS)': 88,
      'Embedded Systems & IoT Robotics': 70,
      'CAD/CAM & Mechanical Mechatronics': 45,
      'Financial Modeling & Valuation (DCF/LBO)': 50,
      'Business Analytics & PowerBI/SQL': 80,
      'Research Methodology & Scientific Writing': 85
    },
    credentials: [
      {
        id: 'cred-cs-01',
        type: 'certificate',
        title: 'AWS Certified Solutions Architect – Professional',
        issuer: 'Amazon Web Services (AWS)',
        issued_date: '2026-02-14',
        verified: true,
        verified_by: 'IIT Delhi Cloud Center of Excellence',
        file_url: 's3://portal-vault/credentials/cred-cs-01.pdf'
      },
      {
        id: 'cred-cs-02',
        type: 'internship_completion',
        title: 'High-Concurrency Distributed Backend Systems Fellow',
        issuer: 'Google Summer of Code & Open-Source Cloud Foundation',
        issued_date: '2025-08-30',
        verified: true,
        verified_by: 'Open Source Mentorship Board',
        file_url: 's3://portal-vault/credentials/cred-cs-02.pdf'
      }
    ],
    projects: [
      {
        id: 'proj-cs-01',
        type: 'project',
        title: 'HyperScale Raft-Consensus Key-Value Distributed Store',
        description: 'Engineered a low-latency Paxos/Raft distributed consensus cluster in Go and Rust handling 120k requests/second.',
        skills: ['Data Structures & System Design', 'Full-Stack & Cloud Architecture (React/Node/AWS)'],
        link: 'https://github.com/aditya-varma-cs/hyperscale-raft',
        verified: true
      },
      {
        id: 'proj-cs-02',
        type: 'project',
        title: 'Autonomous Multi-Agent Workflow Orchestrator for Code Synthesis',
        description: 'Multi-agent orchestration framework utilizing AST parsing and vector embeddings for real-time repository refactoring.',
        skills: ['Artificial Intelligence & Machine Learning', 'Data Structures & System Design'],
        link: 'https://github.com/aditya-varma-cs/agentic-coder',
        verified: true
      }
    ]
  },

  rhea_commerce: {
    id: 'stu-com-201',
    user_id: 'stu-com-201',
    enrollment_no: 'SRCC/2023/BCOM/142',
    name: 'Rhea Chawla',
    full_name: 'Rhea Chawla',
    email: 'rhea.chawla@srcc.du.ac.in',
    phone: '+91 98711 55667',
    role: 'student',
    discipline: 'commerce',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    institution_id: 'inst-srcc-02',
    institution: 'Shri Ram College of Commerce (SRCC), Delhi University',
    department: 'Department of Commerce & Financial Studies',
    course: 'B.Com (Honours) with Specialization in FinTech & Corporate Valuation',
    year_of_study: 3,
    graduation_year: 2026,
    cgpa: 9.28,
    bio: 'Finance and equity valuation scholar passionate about algorithmic risk modeling, corporate M&A advisory, and FinTech data analytics.',
    linkedin_url: 'https://linkedin.com/in/rhea-chawla-srcc',
    github_url: 'https://github.com/rhea-chawla-finance',
    resume_url: 's3://portal-vault/resumes/rhea_chawla_cv.pdf',
    readinessIndex: 90,
    skills: {
      'Financial Modeling & Valuation (DCF/LBO)': 94,
      'Corporate Accounting & GST/Taxation': 90,
      'Business Analytics & PowerBI/SQL': 88,
      'Investment Banking & Equity Research': 92,
      'Supply Chain Management & Logistics': 75,
      'Data Structures & System Design': 45,
      'Artificial Intelligence & Machine Learning': 60,
      'Research Methodology & Scientific Writing': 85
    },
    credentials: [
      {
        id: 'cred-com-01',
        type: 'certificate',
        title: 'CFA Institute Investment Foundations Certification',
        issuer: 'CFA Institute (USA)',
        issued_date: '2026-01-20',
        verified: true,
        verified_by: 'SRCC Academic Finance Society',
        file_url: 's3://portal-vault/credentials/cred-com-01.pdf'
      },
      {
        id: 'cred-com-02',
        type: 'certificate',
        title: 'Financial Modeling & Valuation Analyst (FMVA®)',
        issuer: 'Corporate Finance Institute (CFI)',
        issued_date: '2025-11-15',
        verified: true,
        verified_by: 'CFI Global Registry',
        file_url: 's3://portal-vault/credentials/cred-com-02.pdf'
      }
    ],
    projects: [
      {
        id: 'proj-com-01',
        type: 'project',
        title: 'M&A Valuation & LBO Modeling of Indian FinTech Unicorns',
        description: 'Comprehensive Discounted Cash Flow (DCF), trading multiples, and 3-statement financial model analyzing payment aggregators.',
        skills: ['Financial Modeling & Valuation (DCF/LBO)', 'Investment Banking & Equity Research'],
        link: 'https://github.com/rhea-chawla-finance/fintech-lbo-model',
        verified: true
      },
      {
        id: 'proj-com-02',
        type: 'project',
        title: 'Automated PowerBI Portfolio Risk & Value-at-Risk (VaR) Dashboard',
        description: 'Monte Carlo simulation dashboard built with Python, SQL, and PowerBI evaluating Nifty 50 historical drawdowns.',
        skills: ['Business Analytics & PowerBI/SQL', 'Corporate Accounting & GST/Taxation'],
        link: 'https://github.com/rhea-chawla-finance/var-risk-dashboard',
        verified: true
      }
    ]
  },

  aarav_health: {
    id: 'stu-usr-001',
    user_id: 'stu-usr-001',
    enrollment_no: 'AIIA/2022/BAMS/042',
    name: 'Aarav Sharma',
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@aiia.gov.in',
    phone: '+91 98765 43210',
    role: 'student',
    discipline: 'healthcare',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    institution_id: 'inst-aiia-04',
    institution: 'All India Institute of Ayurveda (AIIA), New Delhi',
    department: 'Dravyaguna (Materia Medica & Clinical Pharmacology)',
    course: 'BAMS (Ayurvedic Medicine) + Minor in Computational Biology',
    year_of_study: 4,
    graduation_year: 2026,
    cgpa: 8.78,
    bio: 'Clinical pharmacology researcher bridging classical botanical medicine with modern GCP trials and computational network pharmacology.',
    linkedin_url: 'https://linkedin.com/in/aarav-sharma-aiia',
    github_url: 'https://github.com/aarav-sharma-aiia',
    resume_url: 's3://portal-vault/resumes/aarav_sharma_cv.pdf',
    readinessIndex: 82,
    skills: {
      'Ayurvedic Pharmacology & Phytochemistry': 85,
      'Clinical Trials & GCP Protocols': 80,
      'Pharmacovigilance & Drug Safety': 85,
      'Formulation & Analytical Chemistry (HPLC/HPTLC)': 75,
      'Artificial Intelligence & Machine Learning': 60,
      'Research Methodology & Scientific Writing': 85
    },
    credentials: [
      {
        id: 'cred-01',
        type: 'certificate',
        title: 'Good Clinical Practice (GCP) for Clinical Trials Certification',
        issuer: 'CDSCO & NIDA Clinical Trials Network',
        issued_date: '2026-04-15',
        verified: true,
        verified_by: 'Institutional Ethics Committee (IEC)',
        file_url: 's3://portal-vault/credentials/cred-02.pdf'
      }
    ],
    projects: [
      {
        id: 'proj-01',
        type: 'project',
        title: 'HPTLC Fingerprinting of Ashwagandha Chemotypes',
        description: 'Comparative phytochemical standardization of roots across agro-climatic zones using CAMAG HPTLC.',
        skills: ['Formulation & Analytical Chemistry (HPLC/HPTLC)', 'Ayurvedic Pharmacology & Phytochemistry'],
        link: 'https://github.com/aarav-sharma-aiia/ashwagandha-fingerprinting',
        verified: true
      }
    ]
  },

  karan_mech: {
    id: 'stu-mech-301',
    user_id: 'stu-mech-301',
    enrollment_no: 'BITS/2022/MECH/055',
    name: 'Karan Singhania',
    full_name: 'Karan Singhania',
    email: 'karan.singhania@pilani.bits-pilani.ac.in',
    phone: '+91 97110 44332',
    role: 'student',
    discipline: 'engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    institution_id: 'inst-bits-03',
    institution: 'Birla Institute of Technology and Science (BITS) Pilani',
    department: 'Department of Mechanical Engineering & Mechatronics',
    course: 'B.Tech in Mechanical Engineering (Minor in Robotics & Automation)',
    year_of_study: 4,
    graduation_year: 2026,
    cgpa: 8.95,
    bio: 'Mechatronics and autonomous robotics designer specializing in ROS2, kinematics, finite element analysis (FEA), and industrial manipulators.',
    linkedin_url: 'https://linkedin.com/in/karan-singhania-bits',
    github_url: 'https://github.com/karan-singhania-mech',
    resume_url: 's3://portal-vault/resumes/karan_singhania_cv.pdf',
    readinessIndex: 88,
    skills: {
      'CAD/CAM & Mechanical Mechatronics': 95,
      'Embedded Systems & IoT Robotics': 90,
      'Data Structures & System Design': 75,
      'Artificial Intelligence & Machine Learning': 70,
      'Supply Chain Management & Logistics': 65,
      'Research Methodology & Scientific Writing': 80
    },
    credentials: [
      {
        id: 'cred-mech-01',
        type: 'certificate',
        title: 'Certified SOLIDWORKS Professional (CSWP)',
        issuer: 'Dassault Systèmes',
        issued_date: '2025-10-12',
        verified: true,
        verified_by: 'BITS Pilani Robotics Society',
        file_url: 's3://portal-vault/credentials/cred-mech-01.pdf'
      }
    ],
    projects: [
      {
        id: 'proj-mech-01',
        type: 'project',
        title: '6-DOF Robotic Manipulator with Computer Vision Grasping',
        description: 'Inverse kinematics trajectory planner integrated with ROS2 and Intel RealSense depth camera for factory pick-and-place.',
        skills: ['CAD/CAM & Mechanical Mechatronics', 'Embedded Systems & IoT Robotics'],
        link: 'https://github.com/karan-singhania-mech/6dof-ros2-arm',
        verified: true
      }
    ]
  }
};

// Default Active Profile (B.Tech Computer Science Scholar)
export const INITIAL_STUDENT_PROFILE = STUDENT_PERSONAS.aditya_cs;

export const INDUSTRY_BENCHMARKS = [
  // Engineering Benchmarks
  {
    roleId: 'role-sde',
    roleName: 'Full-Stack AI & Cloud Software Engineer',
    industry: 'Software Engineering & Cloud Computing',
    discipline: 'engineering',
    demandScore: 98,
    requiredSkills: {
      'Data Structures & System Design': 90,
      'Full-Stack & Cloud Architecture (React/Node/AWS)': 85,
      'Artificial Intelligence & Machine Learning': 80,
      'Research Methodology & Scientific Writing': 70
    },
    description: 'Designs resilient cloud-native architectures, high-throughput microservices, and integrates LLM/AI workflows at production scale.'
  },
  {
    roleId: 'role-robotics',
    roleName: 'Autonomous Robotics & Mechatronics Systems Engineer',
    industry: 'Automotive, Aerospace & Advanced Robotics',
    discipline: 'engineering',
    demandScore: 92,
    requiredSkills: {
      'CAD/CAM & Mechanical Mechatronics': 90,
      'Embedded Systems & IoT Robotics': 85,
      'Data Structures & System Design': 75,
      'Artificial Intelligence & Machine Learning': 70
    },
    description: 'Develops embedded sensor fusion, motor control algorithms, and ROS2 autonomous navigation for industrial robots and EVs.'
  },

  // Commerce Benchmarks
  {
    roleId: 'role-fintech',
    roleName: 'FinTech & Quantitative Risk Analyst',
    industry: 'Investment Banking, FinTech & Capital Markets',
    discipline: 'commerce',
    demandScore: 95,
    requiredSkills: {
      'Financial Modeling & Valuation (DCF/LBO)': 90,
      'Investment Banking & Equity Research': 85,
      'Business Analytics & PowerBI/SQL': 85,
      'Corporate Accounting & GST/Taxation': 80
    },
    description: 'Builds complex financial models, assesses portfolio risk, conducts DCF/LBO valuations, and automates institutional market analytics.'
  },
  {
    roleId: 'role-valuation',
    roleName: 'Corporate Valuation & Risk Advisory Specialist',
    industry: 'Audit, Valuation, Advisory & Corporate Finance',
    discipline: 'commerce',
    demandScore: 91,
    requiredSkills: {
      'Corporate Accounting & GST/Taxation': 90,
      'Financial Modeling & Valuation (DCF/LBO)': 85,
      'Business Analytics & PowerBI/SQL': 80,
      'Supply Chain Management & Logistics': 75
    },
    description: 'Conducts statutory compliance audits, M&A due diligence, transfer pricing studies, and corporate financial health forecasting.'
  },

  // Healthcare Benchmarks
  {
    roleId: 'role-cra',
    roleName: 'Clinical Research Associate & Pharmacovigilance Specialist',
    industry: 'Clinical Contract Research & Pharmaceuticals',
    discipline: 'healthcare',
    demandScore: 93,
    requiredSkills: {
      'Clinical Trials & GCP Protocols': 85,
      'Pharmacovigilance & Drug Safety': 80,
      'Ayurvedic Pharmacology & Phytochemistry': 75,
      'Research Methodology & Scientific Writing': 70
    },
    description: 'Monitors multi-centric clinical trials, signal detection, and GCP compliance for pharmaceutical and botanical therapeutics.'
  }
];

export const SKILL_COURSES = [
  // Engineering Courses
  {
    id: 'crs-eng-01',
    skill: 'Full-Stack & Cloud Architecture (React/Node/AWS)',
    title: 'Cloud-Native Distributed Systems on AWS & Docker/K8s',
    provider: 'Coursera / AWS Training',
    discipline: 'engineering',
    url: 'https://coursera.org/learn/cloud-architecture',
    level: 'Advanced',
    duration: '6 Weeks',
    enrolled: 420
  },
  {
    id: 'crs-eng-02',
    skill: 'Artificial Intelligence & Machine Learning',
    title: 'Deep Learning Specialization: Transformers & Large Language Models',
    provider: 'DeepLearning.AI / NPTEL IIT Madras',
    discipline: 'engineering',
    url: 'https://coursera.org/specializations/deep-learning',
    level: 'Advanced',
    duration: '8 Weeks',
    enrolled: 580
  },
  {
    id: 'crs-eng-03',
    skill: 'CAD/CAM & Mechanical Mechatronics',
    title: 'Kinematics & Robot Operating System (ROS2) for Autonomous Systems',
    provider: 'NPTEL / BITS Pilani Mechatronics Lab',
    discipline: 'engineering',
    url: 'https://nptel.ac.in/courses/mechatronics',
    level: 'Intermediate',
    duration: '6 Weeks',
    enrolled: 310
  },

  // Commerce Courses
  {
    id: 'crs-com-01',
    skill: 'Financial Modeling & Valuation (DCF/LBO)',
    title: 'Advanced Corporate Financial Modeling & M&A LBOs',
    provider: 'Wall Street Prep / SRCC Finance Node',
    discipline: 'commerce',
    url: 'https://wallstreetprep.com/financial-modeling',
    level: 'Advanced',
    duration: '5 Weeks',
    enrolled: 340
  },
  {
    id: 'crs-com-02',
    skill: 'Business Analytics & PowerBI/SQL',
    title: 'Data-Driven Decision Making with SQL, Python & PowerBI',
    provider: 'Coursera / Google Data Analytics',
    discipline: 'commerce',
    url: 'https://coursera.org/professional-certificates/google-data-analytics',
    level: 'Intermediate',
    duration: '6 Weeks',
    enrolled: 512
  },

  // Healthcare Courses
  {
    id: 'crs-hlth-01',
    skill: 'Clinical Trials & GCP Protocols',
    title: 'Good Clinical Practice (GCP) & Ethical Governance in Clinical Research',
    provider: 'CDSCO / WHO Collaborating Centre',
    discipline: 'healthcare',
    url: 'https://cdsco.gov.in/gcp-training',
    level: 'Advanced',
    duration: '4 Weeks',
    enrolled: 230
  }
];

export const INITIAL_OPPORTUNITIES = [
  // B.Tech Engineering Roles
  {
    id: 'opp-eng-01',
    industry_id: 'ind-google-01',
    company: 'Google India R&D',
    companyLogo: '🌐',
    posted_by: 'usr-google-hr',
    title: 'Software Development Engineer (SDE) Intern – Cloud & AI',
    type: 'internship',
    discipline: 'engineering',
    mode: 'hybrid',
    location: 'Bengaluru / Hyderabad',
    duration_weeks: 16,
    stipend_min: 90000,
    stipend_max: 115000,
    stipend_formatted: '₹1,15,000 / month',
    openings: 8,
    application_deadline: '2026-10-31',
    status: 'open',
    category: 'Software Engineering',
    description: 'Develop next-generation cloud infra and scalable LLM orchestration tools with Google Cloud and DeepMind engineering teams.',
    requiredSkills: {
      'Data Structures & System Design': 90,
      'Full-Stack & Cloud Architecture (React/Node/AWS)': 85,
      'Artificial Intelligence & Machine Learning': 80
    },
    benefits: ['Full PPO Consideration (₹32–45 LPA CTC)', 'Relocation Flights & Housing Allowance', 'Mentorship with Staff Engineers'],
    postedDate: '2026-09-01',
    verified: true
  },
  {
    id: 'opp-eng-02',
    industry_id: 'ind-tata-03',
    company: 'Tata Motors Tech Center',
    companyLogo: '⚙️',
    posted_by: 'usr-tata-hr',
    title: 'Autonomous Systems & EV Robotics Engineering Intern',
    type: 'internship',
    discipline: 'engineering',
    mode: 'onsite',
    location: 'Pune Tech Center',
    duration_weeks: 24,
    stipend_min: 35000,
    stipend_max: 45000,
    stipend_formatted: '₹45,000 / month',
    openings: 5,
    application_deadline: '2026-11-15',
    status: 'open',
    category: 'Robotics & Mechanical',
    description: 'Work on sensor fusion, ROS2 autonomous perception, and battery thermal management simulations for next-gen electric vehicle platforms.',
    requiredSkills: {
      'CAD/CAM & Mechanical Mechatronics': 85,
      'Embedded Systems & IoT Robotics': 80,
      'Data Structures & System Design': 70
    },
    benefits: ['Direct track to Graduate Engineer Trainee (GET)', 'Prototyping Labs Access', 'Subsidized Campus Accommodation'],
    postedDate: '2026-08-28',
    verified: true
  },

  // Commerce & Management Roles
  {
    id: 'opp-com-01',
    industry_id: 'ind-goldman-02',
    company: 'Goldman Sachs Global Finance',
    companyLogo: '📈',
    posted_by: 'usr-gs-talent',
    title: 'Quantitative FinTech & Equity Research Summer Analyst',
    type: 'internship',
    discipline: 'commerce',
    mode: 'hybrid',
    location: 'Bengaluru / Mumbai',
    duration_weeks: 12,
    stipend_min: 80000,
    stipend_max: 100000,
    stipend_formatted: '₹1,00,000 / month',
    openings: 6,
    application_deadline: '2026-10-20',
    status: 'open',
    category: 'Quantitative Finance & FinTech',
    description: 'Perform discounted cash flow (DCF) valuations, econometric modeling, and algorithmic risk simulation for global equity markets.',
    requiredSkills: {
      'Financial Modeling & Valuation (DCF/LBO)': 85,
      'Investment Banking & Equity Research': 85,
      'Business Analytics & PowerBI/SQL': 80
    },
    benefits: ['Pre-Placement Offer (₹24–32 LPA CTC)', 'Goldman Sachs Global Mentorship Program', 'Executive Health Insurance'],
    postedDate: '2026-08-30',
    verified: true
  },
  {
    id: 'opp-com-02',
    industry_id: 'ind-deloitte-04',
    company: 'Deloitte Advisory & Risk',
    companyLogo: '📊',
    posted_by: 'usr-deloitte-ta',
    title: 'Corporate Valuation & Financial Risk Advisory Associate',
    type: 'job',
    discipline: 'commerce',
    mode: 'hybrid',
    location: 'Gurugram / Hyderabad / Mumbai',
    duration_weeks: 52,
    stipend_min: 75000,
    stipend_max: 95000,
    stipend_formatted: '₹11.5 - 14.0 LPA',
    openings: 4,
    application_deadline: '2026-11-30',
    status: 'open',
    category: 'Audit & Corporate Advisory',
    description: 'Lead M&A due diligence, financial model audits, and regulatory valuation advisory for Fortune 500 cross-border transactions.',
    requiredSkills: {
      'Corporate Accounting & GST/Taxation': 85,
      'Financial Modeling & Valuation (DCF/LBO)': 80,
      'Business Analytics & PowerBI/SQL': 80
    },
    benefits: ['Annual Performance Bonus', 'Global Secondment Opportunities', 'Comprehensive Health Cover'],
    postedDate: '2026-08-25',
    verified: true
  },

  // Healthcare Roles
  {
    id: 'opp-hlth-01',
    industry_id: 'ind-himalaya-05',
    company: 'Himalaya Wellness Company',
    companyLogo: '🌿',
    posted_by: 'usr-him-hr',
    title: 'Clinical Trial Specialist Intern (Phytopharmacology)',
    type: 'internship',
    discipline: 'healthcare',
    mode: 'hybrid',
    location: 'Bengaluru / New Delhi',
    duration_weeks: 24,
    stipend_min: 22000,
    stipend_max: 25000,
    stipend_formatted: '₹25,000 / month',
    openings: 3,
    application_deadline: '2026-10-31',
    status: 'open',
    category: 'Clinical Trials',
    description: 'Work with clinical pharmacologists on multi-centric Phase-2 trial documentation and safety profiling of herbal therapeutics.',
    requiredSkills: {
      'Clinical Trials & GCP Protocols': 75,
      'Pharmacovigilance & Drug Safety': 70,
      'Ayurvedic Pharmacology & Phytochemistry': 65
    },
    benefits: ['Industrial GCP Certification', 'Pre-Placement Offer (PPO) Track', 'Lodging Subsidy'],
    postedDate: '2026-08-25',
    verified: true
  },
  {
    id: 'opp-hlth-02',
    industry_id: 'ind-dabur-06',
    company: 'Dabur Research Foundation',
    companyLogo: '🍃',
    posted_by: 'usr-dabur-qc',
    title: 'Phytochemical Fingerprinting & HPLC/HPTLC Intern',
    type: 'internship',
    discipline: 'healthcare',
    mode: 'onsite',
    location: 'Ghaziabad, NCR',
    duration_weeks: 12,
    stipend_min: 18000,
    stipend_max: 20000,
    stipend_formatted: '₹20,000 / month',
    openings: 4,
    application_deadline: '2026-10-15',
    status: 'open',
    category: 'R&D & Quality Control',
    description: 'Hands-on training in Agilent HPLC and CAMAG HPTLC systems for marker quantification in botanical preparations.',
    requiredSkills: {
      'Formulation & Analytical Chemistry (HPLC/HPTLC)': 75,
      'Ayurvedic Pharmacology & Phytochemistry': 70
    },
    benefits: ['Direct hands-on instrumentation access', 'Industry Mentorship'],
    postedDate: '2026-08-20',
    verified: true
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-cs-01',
    student_id: 'stu-cs-101',
    studentName: 'Aditya Varma',
    opportunity_id: 'opp-eng-01',
    opportunityTitle: 'Software Development Engineer (SDE) Intern – Cloud & AI',
    company: 'Google India R&D',
    match_score: 93,
    status: 'interview',
    cover_note: 'Passionate about large-scale distributed systems, raft consensus, and high-performance cloud backends.',
    interview_date: '2026-09-18 02:00 PM IST',
    applied_at: '2026-09-02T10:00:00Z',
    history: [
      { id: 'h-01', new_status: 'applied', remarks: 'Applied via IIT Delhi campus link', changed_at: '2026-09-02 10:00 AM' },
      { id: 'h-02', new_status: 'shortlisted', remarks: 'Top 5% coding test rank (93% cosine match)', changed_at: '2026-09-04 03:30 PM' },
      { id: 'h-03', new_status: 'interview', remarks: 'Technical rounds 1 & 2 scheduled with Staff SWE', changed_at: '2026-09-06 11:15 AM' }
    ]
  },
  {
    id: 'app-com-01',
    student_id: 'stu-com-201',
    studentName: 'Rhea Chawla',
    opportunity_id: 'opp-com-01',
    opportunityTitle: 'Quantitative FinTech & Equity Research Summer Analyst',
    company: 'Goldman Sachs Global Finance',
    match_score: 91,
    status: 'interview',
    cover_note: 'Experienced with DCF valuations, 3-statement financial modeling, and automated PowerBI risk tools.',
    interview_date: '2026-09-19 11:30 AM IST',
    applied_at: '2026-09-01T09:30:00Z',
    history: [
      { id: 'h-11', new_status: 'applied', remarks: 'Applied via SRCC Placement Cell', changed_at: '2026-09-01 09:30 AM' },
      { id: 'h-12', new_status: 'shortlisted', remarks: 'Exceptional Financial Modeling score (91% match)', changed_at: '2026-09-03 02:00 PM' },
      { id: 'h-13', new_status: 'interview', remarks: 'Superday Interview panel scheduled', changed_at: '2026-09-05 04:00 PM' }
    ]
  },
  {
    id: 'app-hlth-01',
    student_id: 'stu-usr-001',
    studentName: 'Aarav Sharma',
    opportunity_id: 'opp-hlth-01',
    opportunityTitle: 'Clinical Trial Specialist Intern (Phytopharmacology)',
    company: 'Himalaya Wellness Company',
    match_score: 84,
    status: 'shortlisted',
    cover_note: 'CDSCO GCP certified clinical researcher eager to assist in Phase-2 botanical drug evaluation.',
    applied_at: '2026-08-29T10:30:00Z',
    history: [
      { id: 'h-21', new_status: 'applied', remarks: 'Applied via AIIA portal', changed_at: '2026-08-29 10:30 AM' },
      { id: 'h-22', new_status: 'shortlisted', remarks: 'Approved by clinical trial coordinator', changed_at: '2026-08-31 03:15 PM' }
    ],
    feedback: {
      rating: 5,
      text: 'Exemplary grasp of GCP protocols and classical botanical marker validation.'
    }
  },
  {
    id: 'app-mech-01',
    student_id: 'stu-mech-301',
    studentName: 'Karan Singhania',
    opportunity_id: 'opp-eng-02',
    opportunityTitle: 'Autonomous Systems & EV Robotics Engineering Intern',
    company: 'Tata Motors Tech Center',
    match_score: 89,
    status: 'offered',
    cover_note: 'Built 6-DOF robotic manipulator using ROS2 and Computer Vision. CSWP certified in SolidWorks.',
    applied_at: '2026-08-26T14:00:00Z',
    history: [
      { id: 'h-31', new_status: 'applied', remarks: 'Applied via BITS Pilani portal', changed_at: '2026-08-26 02:00 PM' },
      { id: 'h-32', new_status: 'shortlisted', remarks: 'Passed robotics simulation challenge', changed_at: '2026-08-29 01:00 PM' },
      { id: 'h-33', new_status: 'offered', remarks: 'Formal offer issued with ₹45,000 stipend', changed_at: '2026-09-02 05:00 PM' }
    ],
    feedback: {
      rating: 5,
      text: 'Outstanding mechanical design rigor and ROS2 kinematics implementation.'
    }
  }
];

export const REGISTERED_CANDIDATES = [
  STUDENT_PERSONAS.aditya_cs,
  STUDENT_PERSONAS.rhea_commerce,
  STUDENT_PERSONAS.karan_mech,
  STUDENT_PERSONAS.aarav_health,
  {
    id: 'stu-com-202',
    name: 'Neha Deshmukh',
    enrollment_no: 'DU/2023/BBA/077',
    institution: 'Delhi University - Faculty of Management Studies (FMS)',
    department: 'Department of Business Analytics & Marketing',
    degree: 'BBA in Business Analytics & FinTech',
    discipline: 'commerce',
    year_of_study: 'Final Year',
    cgpa: 9.10,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    email: 'neha.deshmukh@fms.edu',
    phone: '+91 99223 34455',
    readinessIndex: 89,
    skills: {
      'Business Analytics & PowerBI/SQL': 95,
      'Financial Modeling & Valuation (DCF/LBO)': 80,
      'Corporate Accounting & GST/Taxation': 82,
      'Investment Banking & Equity Research': 85,
      'Supply Chain Management & Logistics': 88
    },
    topBadges: ['PowerBI Certified', 'SQL Master', 'Marketing Hackathon Winner'],
    projectsCount: 4,
    status: 'Open for Fast-Track Offer'
  },
  {
    id: 'stu-cs-102',
    name: 'Tanmay Kulkarni',
    enrollment_no: 'IITD/2022/EE/031',
    institution: 'Indian Institute of Technology (IIT) Delhi',
    department: 'Department of Electrical Engineering',
    degree: 'B.Tech in Electrical & Electronics Engineering',
    discipline: 'engineering',
    year_of_study: 'Final Year',
    cgpa: 9.05,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'tanmay.kulkarni@ee.iitd.ac.in',
    phone: '+91 98334 11223',
    readinessIndex: 90,
    skills: {
      'Embedded Systems & IoT Robotics': 94,
      'Data Structures & System Design': 88,
      'Artificial Intelligence & Machine Learning': 85,
      'Full-Stack & Cloud Architecture (React/Node/AWS)': 75
    },
    topBadges: ['ARM Cortex Master', 'VLSI Fellow', 'Kaggle Grandmaster'],
    projectsCount: 3,
    status: 'Interviewing'
  }
];

export const INITIAL_COLLABORATIONS = [
  {
    id: 'collab-eng-01',
    type: 'research',
    title: 'Joint R&D Lab: Generative AI & Autonomous Drone Edge Swarming',
    posted_by_industry_id: 'ind-google-01',
    hostOrg: 'Google DeepMind & IIT Delhi AI School',
    location: 'IIT Delhi Innovation Park',
    discipline: 'engineering',
    mode: 'hybrid',
    start_date: '2026-10-15',
    end_date: '2027-04-15',
    capacity: 10,
    appliedFacultyCount: 8,
    status: 'open',
    stipendOrGrant: '₹25,00,000 Industry Research Grant',
    domain: 'Artificial Intelligence & Autonomous Swarms',
    description: 'Faculty-industry collaborative initiative researching lightweight transformer models on edge compute units for drone coordination.',
    eligibility: 'Faculty with PhD in Computer Science, AI, or Electrical Engineering.'
  },
  {
    id: 'collab-com-02',
    type: 'consultancy',
    title: 'Corporate FinTech & ESG Risk Benchmarking Lab',
    posted_by_industry_id: 'ind-deloitte-04',
    hostOrg: 'Deloitte Global Advisory & SRCC',
    location: 'New Delhi / Hybrid',
    discipline: 'commerce',
    mode: 'hybrid',
    start_date: '2026-11-01',
    end_date: '2027-05-30',
    capacity: 6,
    appliedFacultyCount: 12,
    status: 'open',
    stipendOrGrant: '₹15,00,000 Faculty Fellowship',
    domain: 'Sustainable Finance & Corporate Governance',
    description: 'Joint research assessing BRSR core disclosure quality and green bond pricing across Indian listed enterprises.',
    eligibility: 'Academicians in Commerce, Finance, and Corporate Law.'
  },
  {
    id: 'collab-hlth-03',
    type: 'fdp',
    title: 'Advanced Industrial FDP: LC-MS/MS in Herbal Drug Metabolomics',
    posted_by_industry_id: 'ind-dabur-06',
    hostOrg: 'Dabur Research Foundation & AIIA',
    location: 'DRF R&D Center, Ghaziabad',
    discipline: 'healthcare',
    mode: 'onsite',
    start_date: '2026-10-12',
    end_date: '2026-10-17',
    capacity: 20,
    appliedFacultyCount: 16,
    status: 'open',
    stipendOrGrant: 'Full Industry Fellowship + Accommodation',
    domain: 'Analytical Chemistry & Drug Profiling',
    description: 'Empowering academic faculty with hands-on training on Q-TOF mass spectrometry for metabolite profiling of medicinal extracts.',
    eligibility: 'Faculty in Dravyaguna, Pharmaceutical Chemistry, or Analytical Sciences.'
  }
];

export const INITIAL_INNOVATION_CHALLENGES = [
  {
    id: 'chn-eng-01',
    title: 'Google Cloud & AI Edge Vision Hackathon for Smart Cities',
    company: 'Google India R&D',
    companyLogo: '🌐',
    discipline: 'engineering',
    category: 'Computer Vision & Cloud Architecture',
    domain: 'Edge AI & Distributed Systems',
    prize_pool: '₹5,00,000 + Google Cloud Credits ($10,000)',
    deadline: '2026-11-15',
    status: 'active',
    problem_statement: 'Develop sub-30ms latency edge inference models for real-time urban traffic routing using TensorFlow Lite and WebRTC streaming.',
    submissions_count: 14,
    submissions: [
      {
        id: 'sub-eng-01',
        teamName: 'IITD NeuralSwarm',
        leadStudent: 'Aditya Varma',
        institution: 'IIT Delhi',
        submittedAt: '2026-09-04',
        abstract: 'YOLOv10-Nano customized with INT8 quantization yielding 22ms latency on Raspberry Pi 5 with 94.2% mAP.',
        repoUrl: 'https://github.com/iitd-ai/edge-traffic-vision',
        score: 95,
        status: 'evaluated'
      }
    ]
  },
  {
    id: 'chn-com-02',
    title: 'National FinTech Algorithmic Trading & Risk Sandbox',
    company: 'Goldman Sachs Global Finance',
    companyLogo: '📈',
    discipline: 'commerce',
    category: 'Quantitative Finance & Data Analytics',
    domain: 'High-Frequency Market Microstructure',
    prize_pool: '₹4,00,000 + Direct Superday Interviews',
    deadline: '2026-11-20',
    status: 'active',
    problem_statement: 'Design quantitative statistical arbitrage algorithms capable of neutralizing market beta while delivering Sharpe > 2.5 on Nifty derivatives data.',
    submissions_count: 9,
    submissions: [
      {
        id: 'sub-com-01',
        teamName: 'SRCC AlphaQuant',
        leadStudent: 'Rhea Chawla',
        institution: 'SRCC Delhi',
        submittedAt: '2026-09-05',
        abstract: 'Co-integration based mean reversion model with dynamic volatility bands achieving 2.82 Sharpe ratio during 2024-2026 backtests.',
        repoUrl: 'https://github.com/srcc-quant/alpha-pairs-trading',
        score: 93,
        status: 'evaluated'
      }
    ]
  },
  {
    id: 'chn-hlth-03',
    title: 'AI-Assisted Microscopic Authentication of Botanical Raw Drugs',
    company: 'Himalaya Wellness Company',
    companyLogo: '🌿',
    discipline: 'healthcare',
    category: 'Biomedical Imaging & QC',
    domain: 'Pharmacognosy & Quality Assurance',
    prize_pool: '₹3,50,000 + R&D Incubation',
    deadline: '2026-10-25',
    status: 'active',
    problem_statement: 'Distinguish authentic medicinal plant species from adulterants using high-resolution cross-sectional micro-photographs.',
    submissions_count: 11,
    submissions: [
      {
        id: 'sub-hlth-01',
        teamName: 'AIIA PhytoVision',
        leadStudent: 'Aarav Sharma',
        institution: 'AIIA New Delhi',
        submittedAt: '2026-09-03',
        abstract: 'ResNet50 based cellular feature extractor achieving 96.4% cross-validation accuracy on 1,200 micro-photographs.',
        repoUrl: 'https://github.com/aiia-research/phytovision-guduchi',
        score: 92,
        status: 'evaluated'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-01',
    user_id: 'stu-cs-101',
    channel: 'in_app',
    title: 'Google Interview Scheduled',
    body: 'Your technical interview for SDE Intern – Cloud & AI is confirmed for Sept 18 at 02:00 PM IST.',
    metadata: { application_id: 'app-cs-01', opportunity_id: 'opp-eng-01' },
    is_read: false,
    sent_at: '2026-09-06 11:15 AM'
  },
  {
    id: 'notif-02',
    user_id: 'stu-com-201',
    channel: 'in_app',
    title: 'Goldman Sachs Superday Invitation',
    body: 'Your application for Quantitative FinTech Summer Analyst has advanced to the final Superday round on Sept 19.',
    metadata: { application_id: 'app-com-01', opportunity_id: 'opp-com-01' },
    is_read: false,
    sent_at: '2026-09-05 04:00 PM'
  },
  {
    id: 'notif-03',
    user_id: 'stu-mech-301',
    channel: 'in_app',
    title: 'Official Offer Letter Released by Tata Motors',
    body: 'Congratulations! Tata Motors Tech Center has extended an official internship offer with ₹45,000 stipend.',
    metadata: { application_id: 'app-mech-01', opportunity_id: 'opp-eng-02' },
    is_read: false,
    sent_at: '2026-09-02 05:00 PM'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud-001',
    actor_id: 'usr-google-hr',
    actor_name: 'Google University Talent Partner',
    action: 'application.status_update',
    entity_type: 'applications',
    entity_id: 'app-cs-01',
    metadata: { status: 'interview', candidate: 'Aditya Varma' },
    ip_address: '142.250.190.46',
    created_at: '2026-09-06 11:15:00'
  },
  {
    id: 'aud-002',
    actor_id: 'usr-tata-hr',
    actor_name: 'Tata Motors Robotics Directorate',
    action: 'credential.issue',
    entity_type: 'credentials',
    entity_id: 'cred-mech-01',
    metadata: { title: 'Offer Letter', candidate: 'Karan Singhania' },
    ip_address: '115.112.24.18',
    created_at: '2026-09-02 17:00:00'
  }
];

// Multidisciplinary Skill Assessment Questions (Branch & Track Specific)
export const ASSESSMENT_QUESTIONS = [
  // TRACK: Engineering (B.Tech CSE, AI, Robotics)
  {
    id: 'Q-ENG-1',
    track: 'engineering',
    category: 'Data Structures & System Design',
    question: 'In a distributed microservices system, which architectural pattern ensures data consistency across services without locking databases in a traditional two-phase commit (2PC)?',
    options: [
      'Saga Pattern with compensating transactions and event choreography',
      'Single shared database instance with table locks',
      'Client-side Polling without retry queues',
      'Random sleep back-off in API gateways'
    ],
    correctIndex: 0,
    skillMap: 'Data Structures & System Design'
  },
  {
    id: 'Q-ENG-2',
    track: 'engineering',
    category: 'Artificial Intelligence & Machine Learning',
    question: 'In modern Transformer models, why does the Scaled Dot-Product Attention mechanism divide the dot product (Q · K^T) by the square root of the key dimension (√d_k)?',
    options: [
      'To prevent the dot product from growing large in high dimensions, which would push the softmax into vanishing gradient regions',
      'To invert the attention matrix for backpropagation',
      'To compress float32 weights into 8-bit integers',
      'To calculate token embeddings without positional encodings'
    ],
    correctIndex: 0,
    skillMap: 'Artificial Intelligence & Machine Learning'
  },
  {
    id: 'Q-ENG-3',
    track: 'engineering',
    category: 'Full-Stack & Cloud Architecture (React/Node/AWS)',
    question: 'When optimizing frontend rendering performance in high-frequency trading dashboards with 60 updates/sec, which technique prevents main-thread layout thrashing?',
    options: [
      'Offloading updates to Web Workers and utilizing CSS transforms with requestAnimationFrame',
      'Calling document.body.appendChild in a synchronous for-loop',
      'Increasing the browser zoom scale',
      'Disabling HTTPS encryption in staging'
    ],
    correctIndex: 0,
    skillMap: 'Full-Stack & Cloud Architecture (React/Node/AWS)'
  },
  {
    id: 'Q-ENG-4',
    track: 'engineering',
    category: 'CAD/CAM & Mechanical Mechatronics',
    question: 'In a 6-DOF industrial robotic arm, what mathematical framework is universally employed to compute the coordinate transformation between successive joint links?',
    options: [
      'Denavit–Hartenberg (D-H) Parameters and homogeneous transformation matrices',
      'Euler Bernoulli beam deflection equations',
      'Carnot thermal cycle diagrams',
      'Simple Ohm’s law resistor dividers'
    ],
    correctIndex: 0,
    skillMap: 'CAD/CAM & Mechanical Mechatronics'
  },

  // TRACK: Commerce & Management (B.Com, Finance, BBA)
  {
    id: 'Q-COM-1',
    track: 'commerce',
    category: 'Financial Modeling & Valuation (DCF/LBO)',
    question: 'In Discounted Cash Flow (DCF) valuation, what is the appropriate discount rate utilized to discount Unlevered Free Cash Flows (FCFF) to arrive at Enterprise Value?',
    options: [
      'Weighted Average Cost of Capital (WACC)',
      'Cost of Equity derived from CAPM alone',
      'Nominal Risk-Free Treasury Yield without beta adjustment',
      'Gross Profit Margin percentage'
    ],
    correctIndex: 0,
    skillMap: 'Financial Modeling & Valuation (DCF/LBO)'
  },
  {
    id: 'Q-COM-2',
    track: 'commerce',
    category: 'Corporate Accounting & GST/Taxation',
    question: 'Under Indian GST laws, when can a registered enterprise claim Input Tax Credit (ITC) on inward supplies of capital goods and raw materials?',
    options: [
      'When the supplier has uploaded the invoice in GSTR-1, tax is remitted to the government, and the buyer possesses a valid tax invoice',
      'Whenever the purchase order is emailed to the vendor',
      'Only after 12 months from the end of the financial year',
      'Immediately upon receiving an informal verbal quotation'
    ],
    correctIndex: 0,
    skillMap: 'Corporate Accounting & GST/Taxation'
  },
  {
    id: 'Q-COM-3',
    track: 'commerce',
    category: 'Business Analytics & PowerBI/SQL',
    question: 'In SQL database queries for business analytics, which window function ranks customer transactions consecutively without leaving gaps in ranking when values are identical?',
    options: [
      'DENSE_RANK() OVER (ORDER BY revenue DESC)',
      'ROW_NUMBER() OVER (ORDER BY revenue DESC)',
      'COUNT(*) GROUP BY customer_id',
      'TRUNCATE TABLE'
    ],
    correctIndex: 0,
    skillMap: 'Business Analytics & PowerBI/SQL'
  },
  {
    id: 'Q-COM-4',
    track: 'commerce',
    category: 'Investment Banking & Equity Research',
    question: 'In a Leveraged Buyout (LBO) transaction, what is the primary source of value creation that enhances the equity IRR for the financial sponsor?',
    options: [
      'Deleveraging the business using portfolio company cash flows combined with multiple expansion and EBITDA growth',
      'Paying off debt using personal credit cards',
      'Issuing new preferred shares with negative dividends',
      'Liquidating all factory inventory at 50% discount'
    ],
    correctIndex: 0,
    skillMap: 'Investment Banking & Equity Research'
  },

  // TRACK: Healthcare & Biomedical Sciences
  {
    id: 'Q-HLTH-1',
    track: 'healthcare',
    category: 'Clinical Trials & GCP Protocols',
    question: 'According to ICH-GCP and Ministry of Ayush clinical trial regulations, what approval is mandatory prior to enrolling human subjects in multi-centric Phase-2 trials?',
    options: [
      'Institutional Ethics Committee (IEC) clearance and Clinical Trials Registry - India (CTRI) registration',
      'Only consent from the manufacturing plant supervisor',
      'Publication in an unindexed blog',
      'Direct trademark registration'
    ],
    correctIndex: 0,
    skillMap: 'Clinical Trials & GCP Protocols'
  },
  {
    id: 'Q-HLTH-2',
    track: 'healthcare',
    category: 'Formulation & Analytical Chemistry (HPLC/HPTLC)',
    question: 'In High-Performance Thin Layer Chromatography (HPTLC) analysis of botanical extract markers, which parameter confirms chemical identity against reference standards?',
    options: [
      'Retention Factor (Rf) value and UV-Vis spectral overlay match',
      'Ambient barometric pressure',
      'Boiling point of the water bath',
      'Weight of the glass beaker'
    ],
    correctIndex: 0,
    skillMap: 'Formulation & Analytical Chemistry (HPLC/HPTLC)'
  }
];

export const INSTITUTION_ANALYTICS = {
  institutionName: 'Apex Consortium: IIT Delhi, SRCC & Central Universities',
  totalStudentsEnrolled: 3450,
  studentsAssessedCount: 3120,
  assessmentCompletionRate: 90.4,
  placementReadinessRate: 88.2,
  activeIndustryPartners: 86,
  internshipsFilledCount: 680,
  placementsConcludedCount: 420,
  averagePackage: '₹14.8 LPA',
  highestPackage: '₹52.0 LPA',
  departmentReadiness: [
    { department: 'Computer Science & Engineering (B.Tech CSE)', readiness: 94, students: 280, topGap: 'Distributed Systems & Cloud Scale' },
    { department: 'Artificial Intelligence & Data Science (B.Tech AI)', readiness: 92, students: 210, topGap: 'LLM Fine-Tuning & MLOps' },
    { department: 'Mechanical Engineering & Robotics (B.Tech Mech)', readiness: 88, students: 240, topGap: 'ROS2 & Embedded Sensor Fusion' },
    { department: 'Electronics & Communication (B.Tech ECE)', readiness: 89, students: 230, topGap: 'VLSI Verification & Embedded C' },
    { department: 'Commerce & Financial Markets (B.Com Hons)', readiness: 91, students: 350, topGap: 'Advanced M&A LBO Modeling' },
    { department: 'Business Analytics & FinTech (BBA/MBA)', readiness: 87, students: 290, topGap: 'Statistical Arbitrage & PowerBI' },
    { department: 'Integrative Healthcare & Clinical Trials', readiness: 85, students: 180, topGap: 'GCP Protocols & HPLC Fingerprinting' }
  ],
  skillGapHeatmap: [
    { skill: 'Data Structures & System Design', currentAvg: 78, industryTarget: 90, gap: 12 },
    { skill: 'Financial Modeling & Valuation (DCF/LBO)', currentAvg: 75, industryTarget: 88, gap: 13 },
    { skill: 'Artificial Intelligence & Machine Learning', currentAvg: 72, industryTarget: 85, gap: 13 },
    { skill: 'CAD/CAM & Mechanical Mechatronics', currentAvg: 76, industryTarget: 86, gap: 10 },
    { skill: 'Corporate Accounting & GST/Taxation', currentAvg: 80, industryTarget: 88, gap: 8 },
    { skill: 'Clinical Trials & GCP Protocols', currentAvg: 70, industryTarget: 85, gap: 15 }
  ]
};
