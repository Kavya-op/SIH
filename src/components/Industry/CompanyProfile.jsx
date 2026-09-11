import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit
} from 'lucide-react';

export default function CompanyProfile({ activeIndustry, isLight, addToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(() => ({
    companyName: activeIndustry?.name || 'Google India R&D & DeepMind Labs',
    division: activeIndustry?.industry_sector || 'Software Engineering, Cloud & Artificial Intelligence',
    cin: activeIndustry?.cin || 'U72900KA2004PTC033228',
    gstin: activeIndustry?.gstin || '29AAACG9876R1ZT',
    headquarters: activeIndustry?.address || 'Google Signature Towers, Sector 15, Gurugram / Bengaluru',
    website: activeIndustry?.website || 'https://careers.google.com',
    contactPerson: 'Corporate Relations & University Lead',
    designation: 'Head of Talent Acquisition & Campus Partnerships',
    email: 'university-talent@industrypartner.com',
    phone: '+91 80 6754 1234',
    accreditationStatus: 'Active & Verified (Valid till 2029)',
    description: `${activeIndustry?.name || 'Our organization'} is partnered with premier Indian institutions (IITs, SRCC, BITS Pilani, AIIA, and Central Universities) to recruit outstanding engineering, commerce, and scientific research scholars.`
  }));

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    addToast(`Corporate profile for ${profileData.companyName} updated successfully!`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Corporate Profile Card */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
              }}
            >
              {activeIndustry?.logo || '🏢'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.45rem', margin: 0, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                  {profileData.companyName}
                </h3>
                <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> {activeIndustry?.badge || 'Verified Partner'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
                {profileData.division}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-sky" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
              Verification Status: {profileData.accreditationStatus}
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary btn-sm"
              style={{ gap: '4px' }}
            >
              <Edit size={14} />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Edit Form or Bio View */}
        {isEditing ? (
          <form onSubmit={handleSave} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1' }}>Lead Recruiter</label>
                <input
                  type="text"
                  value={profileData.contactPerson}
                  onChange={e => setProfileData({ ...profileData, contactPerson: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', color: isLight ? '#0f172a' : '#fff', background: isLight ? '#fff' : '#1e293b' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1' }}>Official Recruiter Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', color: isLight ? '#0f172a' : '#fff', background: isLight ? '#fff' : '#1e293b' }}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: isLight ? '#334155' : '#cbd5e1' }}>Company Bio / R&D Mission</label>
              <textarea
                rows={3}
                value={profileData.description}
                onChange={e => setProfileData({ ...profileData, description: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', color: isLight ? '#0f172a' : '#fff', background: isLight ? '#fff' : '#1e293b' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </form>
        ) : (
          <p style={{ marginTop: '16px', fontSize: '0.88rem', color: isLight ? '#334155' : '#cbd5e1', lineHeight: 1.6 }}>
            {profileData.description}
          </p>
        )}

        {/* Corporate Identifiers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '22px' }}>
          <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Corporate CIN</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', marginTop: '3px', fontFamily: 'monospace' }}>
              {profileData.cin}
            </div>
            <div style={{ fontSize: '0.72rem', color: isLight ? '#2563eb' : '#38bdf8', marginTop: '2px' }}>MCA Registered Entity</div>
          </div>

          <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>GSTIN / Tax ID</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', marginTop: '3px', fontFamily: 'monospace' }}>
              {profileData.gstin}
            </div>
            <div style={{ fontSize: '0.72rem', color: isLight ? '#10b981' : '#34d399', marginTop: '2px' }}>Active Tax Payer</div>
          </div>

          <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Global Headquarters</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', marginTop: '3px' }}>
              {profileData.headquarters}
            </div>
          </div>

          <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Corporate Sector</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isLight ? '#2563eb' : '#60a5fa', marginTop: '3px' }}>
              {profileData.division}
            </div>
          </div>
        </div>
      </div>

      {/* Authorized Point of Contact & Active Institutional MoUs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Contact Directory */}
        <div className="glass-panel" style={{ padding: '24px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <h4 style={{ fontSize: '1.1rem', color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 16px 0', fontWeight: 700 }}>
            Authorized Talent Partner & Recruiter Point of Contact
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: isLight ? '#64748b' : 'var(--text-muted)' }}>Lead Recruiter:</span>
              <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{profileData.contactPerson}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: isLight ? '#64748b' : 'var(--text-muted)' }}>Designation:</span>
              <span style={{ color: isLight ? '#334155' : '#cbd5e1' }}>{profileData.designation}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: isLight ? '#64748b' : 'var(--text-muted)' }}>Official Email:</span>
              <span style={{ color: isLight ? '#2563eb' : '#38bdf8', fontFamily: 'monospace' }}>{profileData.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: isLight ? '#64748b' : 'var(--text-muted)' }}>Phone:</span>
              <span style={{ color: isLight ? '#334155' : '#cbd5e1' }}>{profileData.phone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: isLight ? '#64748b' : 'var(--text-muted)' }}>Security Role:</span>
              <span className="badge badge-sky">Corporate Administrator (RBAC)</span>
            </div>
          </div>
        </div>

        {/* Active Institutional MoUs */}
        <div className="glass-panel" style={{ padding: '24px', border: isLight ? '1px solid #cbd5e1' : undefined }}>
          <h4 style={{ fontSize: '1.1rem', color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 16px 0', fontWeight: 700 }}>
            Active Institutional MoUs & Collaborative Research Hubs
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { inst: 'Indian Institute of Technology (IIT) Delhi', focus: 'Cloud Architecture, Edge-AI & Autonomous Systems', period: '2024–2029' },
              { inst: 'Shri Ram College of Commerce (SRCC), Delhi', focus: 'Quantitative FinTech & Equity Research Sandbox', period: '2024–2028' },
              { inst: 'Birla Institute of Technology and Science (BITS) Pilani', focus: 'Autonomous Robotics & Mechatronics CoE', period: '2025–2029' },
              { inst: 'All India Institute of Ayurveda (AIIA), New Delhi', focus: 'Clinical GCP Trials & Pharmacovigilance Protocols', period: '2024–2029' }
            ].map((mou, i) => (
              <div
                key={i}
                style={{
                  background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isLight ? '#0f172a' : '#ffffff' }}>
                  {mou.inst}
                </div>
                <div style={{ fontSize: '0.78rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginTop: '2px' }}>
                  Scope: {mou.focus} • Valid: <strong style={{ color: isLight ? '#2563eb' : '#38bdf8' }}>{mou.period}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
