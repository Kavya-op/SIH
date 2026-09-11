import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function RadarChart({ studentSkills = {}, benchmarks = [] }) {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const benchmarkList = Array.isArray(benchmarks) ? benchmarks : [];
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState(() => benchmarkList[0]?.roleId || '');
  const activeBenchmark = benchmarkList.find(b => b.roleId === selectedBenchmarkId) || benchmarkList[0] || { roleName: 'Industry Standard', requiredSkills: {} };

  const skills = studentSkills || {};
  const skillKeys = Object.keys(skills);
  const totalAxes = skillKeys.length > 0 ? skillKeys.length : 1;

  const size = 420;
  const center = size / 2;
  const radius = 130;

  // Generate polygon points for a given dataset { skillName: value } (0-100)
  const getCoordinates = (index, value) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const studentPoints = skillKeys.map((key, i) => {
    const val = skills[key] || 0;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(' ');

  const benchmarkPoints = skillKeys.map((key, i) => {
    const val = activeBenchmark?.requiredSkills?.[key] || 40;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(' ');

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [20, 40, 60, 80, 100];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Benchmark Selector Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.05rem', color: isLight ? '#0f172a' : '#f8fafc' }}>
            Competency Radar vs. Benchmark
          </h4>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: isLight ? '#475569' : 'var(--text-secondary)' }}>
            Comparing current verified proficiency against target role specifications
          </p>
        </div>

        <select
          value={selectedBenchmarkId}
          onChange={(e) => setSelectedBenchmarkId(e.target.value)}
          style={{
            background: isLight ? '#ffffff' : 'var(--bg-surface-elevated)',
            border: isLight ? '1.5px solid #cbd5e1' : '1px solid var(--border-medium)',
            color: isLight ? '#0f172a' : '#f8fafc',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.85rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {benchmarkList.map(b => (
            <option key={b.roleId} value={b.roleId}>
              Target: {b.roleName}
            </option>
          ))}
        </select>
      </div>

      {/* SVG Radar */}
      <div style={{ position: 'relative', width: '100%', maxWidth: `${size}px`, display: 'flex', justifyContent: 'center' }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
        >
          {/* Concentric Polygons */}
          {levels.map((lvl) => {
            const pts = skillKeys.map((_, i) => {
              const { x, y } = getCoordinates(i, lvl);
              return `${x},${y}`;
            }).join(' ');
            return (
              <polygon
                key={lvl}
                points={pts}
                fill="none"
                stroke={isLight ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.08)'}
                strokeWidth="1"
              />
            );
          })}

          {/* Radial Axes */}
          {skillKeys.map((key, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={isLight ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.12)'}
                strokeWidth="1"
              />
            );
          })}

          {/* Industry Benchmark Outline */}
          <polygon
            points={benchmarkPoints}
            fill={isLight ? 'rgba(100, 116, 139, 0.08)' : 'rgba(255, 255, 255, 0.05)'}
            stroke={isLight ? '#475569' : '#ffffff'}
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Student Proficiency Polygon (Electric Blue glow) */}
          <polygon
            points={studentPoints}
            fill={isLight ? 'rgba(37, 99, 235, 0.22)' : 'rgba(37, 99, 235, 0.38)'}
            stroke="#2563eb"
            strokeWidth="2.5"
          />

          {/* Student Data Dots */}
          {skillKeys.map((key, i) => {
            const val = studentSkills[key] || 0;
            const { x, y } = getCoordinates(i, val);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4.5"
                fill={isLight ? '#2563eb' : '#93c5fd'}
                stroke={isLight ? '#ffffff' : '#1e3a8a'}
                strokeWidth="2"
              />
            );
          })}

          {/* Vertex Labels */}
          {skillKeys.map((key, i) => {
            const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
            const labelR = radius + 28;
            const lx = center + labelR * Math.cos(angle);
            const ly = center + labelR * Math.sin(angle);

            // Abbreviate or wrap long labels for clarity
            const shortLabel = key.length > 24 ? key.slice(0, 22) + '…' : key;

            return (
              <text
                key={i}
                x={lx}
                y={ly}
                textAnchor={Math.abs(Math.cos(angle)) < 0.3 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end'}
                dominantBaseline="central"
                fill={isLight ? '#0f172a' : '#cbd5e1'}
                fontSize="11"
                fontWeight="600"
                style={{ pointerEvents: 'none' }}
              >
                {shortLabel}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend & Target Gap Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginTop: '18px',
        fontSize: '0.82rem',
        color: isLight ? '#475569' : 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#2563eb', display: 'inline-block' }}></span>
          <span style={{ color: isLight ? '#0f172a' : '#ffffff', fontWeight: 600 }}>Your Verified Skills</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '16px', height: '2px', borderBottom: isLight ? '2px dashed #475569' : '2px dashed #ffffff', display: 'inline-block' }}></span>
          <span style={{ color: isLight ? '#0f172a' : '#ffffff', fontWeight: 600 }}>Industry Benchmark Target</span>
        </div>
      </div>
    </div>
  );
}
