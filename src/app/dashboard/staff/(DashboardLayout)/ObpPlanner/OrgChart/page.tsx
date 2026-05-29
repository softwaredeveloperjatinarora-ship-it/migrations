'use client';

import { useState, useEffect } from 'react';
import { getWingStructure } from '@/app/actions/StaffActions/OrgChartAction/getWingStructureAction';
import { getSchoolDivStructure } from '@/app/actions/StaffActions/OrgChartAction/getSchoolDivStructureAction';
import { getTreeViewStructure } from '@/app/actions/StaffActions/OrgChartAction/getTreeViewStructureAction';
import { getMetricStagesCheckList } from '@/app/actions/StaffActions/OrgChartAction/getMetricStagesCheckListAction';
import { getHeadAuthorityList } from '@/app/actions/StaffActions/OrgChartAction/getHeadAuthorityListAction';

// ─── Animated Counter ─────────────────────────────────────────────────────────

function Counter({ to, duration = 1400 }: { to: number; duration?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let f = 0;
    const frames = Math.ceil(duration / 16);
    const id = setInterval(() => {
      f++;
      setV(Math.round((1 - Math.pow(1 - f / frames, 3)) * to));
      if (f >= frames) { setV(to); clearInterval(id); }
    }, 16);
    return () => clearInterval(id);
  }, [to, duration]);
  return <>{v}</>;
}

// ─── Collapse ─────────────────────────────────────────────────────────────────

function Collapse({ open, children, maxH = 6000, duration = '0.45s' }: { open: boolean; children: React.ReactNode; maxH?: number; duration?: string }) {
  return (
    <div style={{ overflow: 'hidden', maxHeight: open ? maxH : 0, opacity: open ? 1 : 0, transition: `max-height ${duration} cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease` }}>
      {children}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface StaffCat { name: string; count: number; color: string }
interface SubDept { name: string; color: string; count: number; head: string; headId: string; staff: StaffCat[] }
interface TipData { x: number; y: number; dept: SubDept }

interface WingOption { wingId: string; wingName: string; code: string }
interface SchoolOption { id: string; schoolDivisionName: string; code: string; wingId: string }
interface ApiNode {
  id: string; name: string; parentId: string | null; authority: string;
  lvlNo: string; divSchoolId: string; srNo: string; pictureID: string;
  isActive: string; updatedOn: string;
}
interface DynamicTreeData {
  facultyName: string;
  school: { name: string; count: number; head: string; headId: string };
  cos1: { name: string; count: number; head: string; headId: string };
  cos2: { name: string; count: number; head: string; headId: string } | null;
  subDepts1: SubDept[];
  subDepts2: SubDept[];
}

// ─── Color Maps ───────────────────────────────────────────────────────────────

const DEPT_COLOR_PALETTE = [
  '#7C3AED','#0891B2','#DC2626','#EA580C','#7E22CE','#BE185D',
  '#0F766E','#B45309','#1D4ED8','#6D28D9','#0369A1','#065F46',
  '#9333EA','#0284C7','#B91C1C','#0F6B6B','#92400E',
];

const ROLE_COLOR_MAP: Record<string, string> = {
  'Professor': '#EC4899',
  'Associate Professor': '#7C3AED',
  'Associate professor': '#7C3AED',
  'Assistant Professor': '#0EA5E9',
  'External Expert': '#F97316',
  'Teaching Assistant': '#10B981',
  'Trainer': '#10B981',
  'Librarian': '#F97316',
  'Sr. Library Assistant': '#F97316',
  'Library Assistant': '#F97316',
  'Prof. & Dean': '#EC4899',
  'Professor & Assistant Dean': '#EC4899',
  'Professor & Senior Dean': '#EC4899',
  'Professor & Additional Dean': '#EC4899',
  'Professor & Associate Dean': '#EC4899',
  'Associate Professor  & Asst. Dean': '#7C3AED',
  'Assoc. Prof.': '#7C3AED',
  'Asst. Prof.': '#0EA5E9',
  'Ext. Expert': '#F97316',
  'Teaching Asst.': '#10B981',
  'Assistant Director': '#64748B',
  'Officer': '#64748B',
  'Deputy Officer': '#94A3B8',
  'Senior Assistant': '#94A3B8',
  'Assistant': '#94A3B8',
  'Assistant Officer': '#94A3B8',
  'Housekeeping Staff': '#CBD5E1',
  'Peon': '#CBD5E1',
  'Assistant Superintendent': '#64748B',
};

// ─── API Tree Parser ───────────────────────────────────────────────────────────

function parseApiTree(nodes: ApiNode[]): DynamicTreeData {
  const topLevel = nodes.find(n => n.lvlNo === 'top-level');
  const newLevel = nodes.find(n => n.lvlNo === 'new-level');
  const schoolId = newLevel?.id ?? '';

  const allMiddle = nodes.filter(n => n.lvlNo === 'middle-level' && n.parentId === schoolId);
  // Only show middle-level nodes that have sub-departments with staff
  const cosNodes = allMiddle.filter(cos =>
    nodes.some(dept => dept.parentId === cos.id && dept.lvlNo === 'frontend1' &&
      nodes.some(s => s.parentId === dept.id && s.lvlNo === 'pipeline1' && parseInt(s.authority) > 0))
  );

  const parseDepts = (cosId: string, colorOffset: number): SubDept[] =>
    nodes
      .filter(n => n.lvlNo === 'frontend1' && n.parentId === cosId)
      .map((dept, idx) => {
        const staffNodes = nodes.filter(n => n.lvlNo === 'pipeline1' && n.parentId === dept.id);
        const staff: StaffCat[] = staffNodes
          .map(s => ({ name: s.name, count: parseInt(s.authority) || 0, color: ROLE_COLOR_MAP[s.name] ?? '#94A3B8' }))
          .filter(s => s.count > 0);
        const total = staff.reduce((sum, s) => sum + s.count, 0);
        return {
          name: dept.name,
          color: DEPT_COLOR_PALETTE[(idx + colorOffset) % DEPT_COLOR_PALETTE.length],
          count: total,
          head: `ID: ${dept.authority}`,
          headId: `${dept.authority} · HOD/COD`,
          staff,
        };
      })
      .filter(d => d.staff.length > 0);

  const cos1Node = cosNodes[0] ?? null;
  const cos2Node = cosNodes[1] ?? null;
  const subDepts1 = cos1Node ? parseDepts(cos1Node.id, 0) : [];
  const subDepts2 = cos2Node ? parseDepts(cos2Node.id, subDepts1.length) : [];
  const totalStaff = [...subDepts1, ...subDepts2].reduce((s, d) => s + d.count, 0);

  const cleanName = (name: string) => name.replace(/\s*\([^)]*\)\s*/g, '').trim();

  return {
    facultyName: cleanName(topLevel?.name ?? 'Faculty'),
    school: { name: cleanName(newLevel?.name ?? 'School'), count: totalStaff, head: `ID: ${newLevel?.authority ?? ''}`, headId: newLevel?.authority ?? '' },
    cos1: cos1Node ? { name: cos1Node.name, count: subDepts1.reduce((s, d) => s + d.count, 0), head: `ID: ${cos1Node.authority}`, headId: cos1Node.authority } : { name: 'COS-1', count: 0, head: '', headId: '' },
    cos2: cos2Node ? { name: cos2Node.name, count: subDepts2.reduce((s, d) => s + d.count, 0), head: `ID: ${cos2Node.authority}`, headId: cos2Node.authority } : null,
    subDepts1,
    subDepts2,
  };
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({ data }: { data: TipData }) {
  return (
    <div style={{ position: 'fixed', left: data.x + 16, top: data.y - 16, zIndex: 9999, background: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(12px)', color: '#fff', borderRadius: 12, padding: '12px 16px', fontSize: 12, pointerEvents: 'none', minWidth: 200, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: `1px solid ${data.dept.color}66` }}>
      <div style={{ fontWeight: 800, color: data.dept.color, fontSize: 13, marginBottom: 4 }}>{data.dept.name}</div>
      <div style={{ fontSize: 10, color: '#64748B', marginBottom: 10 }}>{data.dept.head}</div>
      {data.dept.staff.map((s, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, padding: '3px 0', borderTop: i === 0 ? '1px solid #1E293B' : 'none', paddingTop: i === 0 ? 8 : 3 }}>
          <span style={{ color: '#94A3B8' }}>{s.name}</span>
          <span style={{ fontWeight: 800, color: s.color }}>{s.count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Fallback Static Data ─────────────────────────────────────────────────────

const FALLBACK_FACULTY = 'Lovely Faculty of Business and Arts';
const FALLBACK_SCHOOL = { name: 'Mittal School of Business', count: 234, head: 'Dr. Rajesh Verma', headId: '11834' };
const FALLBACK_COS1 = { name: 'COS-1', count: 168, head: 'Dr. Suresh Kumar', headId: '11085' };
const FALLBACK_COS2 = { name: 'COS-2', count: 89, head: 'Dr. Priya Mehta', headId: '14532' };
const FALLBACK_DEPTS1: SubDept[] = [
  { name: 'HR Management-II', color: '#7C3AED', count: 14, head: 'Dr. Shikha Goyal', headId: '22744 · HOD/COD', staff: [{ name: 'Professor', count: 1, color: '#EC4899' }, { name: 'Assoc. Prof.', count: 3, color: '#7C3AED' }, { name: 'Asst. Prof.', count: 10, color: '#0EA5E9' }] },
  { name: 'Economics', color: '#0891B2', count: 23, head: 'Dr. Pooja Kanara', headId: '12526 · HOD/COD', staff: [{ name: 'Professor', count: 3, color: '#EC4899' }, { name: 'Assoc. Prof.', count: 1, color: '#7C3AED' }, { name: 'Asst. Prof.', count: 15, color: '#0EA5E9' }, { name: 'Ext. Expert', count: 3, color: '#F97316' }, { name: 'Teaching Asst.', count: 1, color: '#10B981' }] },
  { name: 'Operations', color: '#DC2626', count: 32, head: 'Dr. Anup Sharma', headId: '21070 · HOD/COD', staff: [{ name: 'Prof. & Dean', count: 1, color: '#EC4899' }, { name: 'Assoc. Prof.', count: 4, color: '#7C3AED' }, { name: 'Asst. Prof.', count: 6, color: '#0EA5E9' }, { name: 'Ext. Expert', count: 15, color: '#F97316' }, { name: 'Teaching Asst.', count: 1, color: '#10B981' }] },
  { name: 'Information Tech.', color: '#EA580C', count: 2, head: 'Dr. Anup Sharma', headId: '21070 · HOD/COD', staff: [{ name: 'Asst. Prof.', count: 2, color: '#0EA5E9' }] },
  { name: 'Communication Skills', color: '#7E22CE', count: 19, head: 'Gagandeep Kaur', headId: '23346 · HOD/COD', staff: [{ name: 'Assoc. Prof.', count: 1, color: '#7C3AED' }, { name: 'Asst. Prof.', count: 18, color: '#0EA5E9' }] },
  { name: 'Analytical Skills', color: '#BE185D', count: 7, head: 'Vishal Ahuja', headId: '18763 · HOD/COD', staff: [{ name: 'Trainer', count: 2, color: '#10B981' }, { name: 'Asst. Prof.', count: 5, color: '#0EA5E9' }, { name: 'Librarian', count: 1, color: '#F97316' }] },
];
const FALLBACK_DEPTS2: SubDept[] = [
  { name: 'Finance', color: '#0F766E', count: 18, head: 'Dr. Amit Patel', headId: '31245 · HOD/COD', staff: [{ name: 'Professor', count: 2, color: '#EC4899' }, { name: 'Assoc. Prof.', count: 4, color: '#7C3AED' }, { name: 'Asst. Prof.', count: 12, color: '#0EA5E9' }] },
  { name: 'Marketing', color: '#B45309', count: 22, head: 'Dr. Neha Singh', headId: '28891 · HOD/COD', staff: [{ name: 'Professor', count: 2, color: '#EC4899' }, { name: 'Assoc. Prof.', count: 5, color: '#7C3AED' }, { name: 'Asst. Prof.', count: 12, color: '#0EA5E9' }, { name: 'Ext. Expert', count: 3, color: '#F97316' }] },
  { name: 'International Business', color: '#1D4ED8', count: 15, head: 'Dr. Kavita Sharma', headId: '19876 · HOD/COD', staff: [{ name: 'Assoc. Prof.', count: 3, color: '#7C3AED' }, { name: 'Asst. Prof.', count: 10, color: '#0EA5E9' }, { name: 'Ext. Expert', count: 2, color: '#F97316' }] },
  { name: 'Entrepreneurship', color: '#6D28D9', count: 12, head: 'Mr. Rohit Gupta', headId: '25432 · HOD/COD', staff: [{ name: 'Assoc. Prof.', count: 2, color: '#7C3AED' }, { name: 'Asst. Prof.', count: 8, color: '#0EA5E9' }, { name: 'Trainer', count: 2, color: '#10B981' }] },
  { name: 'Accounting', color: '#0369A1', count: 22, head: 'Dr. Sunita Rao', headId: '22156 · HOD/COD', staff: [{ name: 'Professor', count: 1, color: '#EC4899' }, { name: 'Assoc. Prof.', count: 4, color: '#7C3AED' }, { name: 'Asst. Prof.', count: 14, color: '#0EA5E9' }, { name: 'Teaching Asst.', count: 3, color: '#10B981' }] },
];

// ─── Allocation Tab ───────────────────────────────────────────────────────────

function AllocationTab() {
  const [metricId, setMetricId] = useState('');
  const [stageType, setStageType] = useState('');
  const [authId, setAuthId] = useState('');
  const [authType, setAuthType] = useState('');
  const [roleType, setRoleType] = useState('');

  const [stages, setStages] = useState<any[]>([]);
  const [checkList, setCheckList] = useState<any[]>([]);
  const [authority, setAuthority] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputStyle: React.CSSProperties = { padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, color: '#0F172A', background: '#F8FAFC', outline: 'none', width: '100%', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2, display: 'block', marginBottom: 5 };
  const sectionTitle: React.CSSProperties = { fontSize: 14, fontWeight: 800, color: '#0F172A', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 };
  const card: React.CSSProperties = { background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' };

  const handleLoad = async () => {
    if (!metricId) { setError('Metric ID is required.'); return; }
    setError('');
    setLoading(true);
    try {
      const [stageRes, authRes] = await Promise.all([
        getMetricStagesCheckList({ MetricID: parseInt(metricId), StageType: stageType, IsRequired: null }),
        authId ? getHeadAuthorityList({ Id: parseInt(authId), type: authType, RoleType: roleType }) : Promise.resolve({ status: 'success', ApiData: null }),
      ]);

      if (stageRes.status === 'success' && stageRes.ApiData) {
        const data = stageRes.ApiData?.item1?.[0] ?? stageRes.ApiData?.[0] ?? {};
        setStages(data.stageList ?? []);
        setCheckList(data.checkList ?? []);
      } else {
        setStages([]); setCheckList([]);
      }

      if (authRes.status === 'success' && authRes.ApiData) {
        setAuthority(authRes.ApiData?.item1 ?? authRes.ApiData ?? []);
      } else {
        setAuthority([]);
      }
    } catch {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const thStyle: React.CSSProperties = { padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8, background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap', textAlign: 'left' };
  const tdStyle: React.CSSProperties = { padding: '10px 12px', fontSize: 12, color: '#334155', borderBottom: '1px solid #F1F5F9' };

  const authorityColumns = [
    { label: 'Sno', key: 'Sn' },
    { label: 'Assign To', key: 'NAME' },
    { label: 'Department', key: 'departmentName' },
    { label: 'Department Type', key: 'assignToType' },
    { label: 'Total Target Value', key: 'totalTargetValue' },
    { label: 'Base Value', key: 'baseValue' },
    { label: 'Quarter 1 Value', key: 'quarter1Target' },
    { label: 'Quarter 2 Value', key: 'quarter2Target' },
    { label: 'Quarter 3 Value', key: 'quarter3Target' },
    { label: 'Quarter 4 Value', key: 'quarter4Target' },
    { label: 'Target Date', key: 'targetDate' },
  ];

  return (
    <div style={{ padding: '32px 40px', background: '#F8FAFC', minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Filter form ── */}
      <div style={card}>
        <p style={sectionTitle}>🔍 Load Data</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 20px', marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Metric ID <span style={{ color: '#EF4444' }}>*</span></label>
            <input style={inputStyle} type="number" placeholder="e.g. 1024" value={metricId} onChange={e => setMetricId(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Stage Type</label>
            <input style={inputStyle} placeholder="e.g. Outcome" value={stageType} onChange={e => setStageType(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Authority ID</label>
            <input style={inputStyle} type="number" placeholder="e.g. 100" value={authId} onChange={e => setAuthId(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <input style={inputStyle} placeholder="e.g. Metric" value={authType} onChange={e => setAuthType(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Role Type</label>
            <input style={inputStyle} placeholder="e.g. HOD" value={roleType} onChange={e => setRoleType(e.target.value)} />
          </div>
        </div>
        {error && <p style={{ color: '#EF4444', fontSize: 12, margin: '0 0 12px' }}>{error}</p>}
        <button onClick={handleLoad} disabled={loading}
          style={{ padding: '10px 28px', borderRadius: 9, border: 'none', background: loading ? '#94A3B8' : '#F97316', color: '#fff', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
          {loading ? 'Loading…' : 'Load Data'}
        </button>
      </div>

      {/* ── Two-column: Stages + Checklist ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Stages */}
        <div style={card}>
          <p style={sectionTitle}>📋 Stages</p>
          {stages.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '24px 0' }}>No stages available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stages.map((s: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F97316', color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {s.StageOrder ?? i + 1}
                  </div>
                  <span style={{ fontSize: 13, color: '#1E293B', fontWeight: 500 }}>{s.Stages ?? s.stages ?? '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checklist */}
        <div style={card}>
          <p style={sectionTitle}>✅ Checklist</p>
          {checkList.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '24px 0' }}>No checklist items available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {checkList.map((c: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 8, background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>✓</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>{c.CheckListName ?? c.checkListName ?? '—'}</span>
                    {c.Type && <span style={{ marginLeft: 8, fontSize: 10, color: '#4ADE80', background: '#166534', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>{c.Type}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Head Authority Table ── */}
      <div style={card}>
        <p style={sectionTitle}>👥 Assignment Data</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {authorityColumns.map(col => (
                  <th key={col.key} style={thStyle}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {authority.length === 0 ? (
                <tr>
                  <td colSpan={authorityColumns.length} style={{ ...tdStyle, textAlign: 'center', color: '#94A3B8', padding: '32px 12px' }}>
                    No assignment data available.
                  </td>
                </tr>
              ) : (
                authority.map((row: any, i: number) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8FAFC' }}>
                    {authorityColumns.map(col => (
                      <td key={col.key} style={tdStyle}>{row[col.key] ?? '—'}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// ─── Classic Tree Visual Constants ────────────────────────────────────────────

const LEVEL_COLORS = {
  faculty:    { bg: '#1E40AF', light: '#EFF6FF', accent: '#60A5FA', label: 'LEVEL 1 · FACULTY' },
  school:     { bg: '#065F46', light: '#F0FDF4', accent: '#34D399', label: 'LEVEL 2 · SCHOOL' },
  department: { bg: '#0C4A6E', light: '#F0F9FF', accent: '#38BDF8', label: 'LEVEL 3 · DEPARTMENT (COS)' },
  subdept:    { bg: '#374151', light: '#F9FAFB', accent: '#9CA3AF', label: 'LEVEL 4 · SUB-DEPARTMENTS' },
  staff:      { bg: '#1F2937', light: '#F9FAFB', accent: '#6B7280', label: 'LEVEL 5 · STAFF CATEGORIES' },
};

const STAFF_ROLE_COLORS = [
  { name: 'Professor', color: '#EC4899', desc: 'Senior Faculty' },
  { name: 'Prof. & Dean', color: '#EC4899', desc: 'Prof. with Admin Role' },
  { name: 'Assoc. Prof.', color: '#7C3AED', desc: 'Associate Faculty' },
  { name: 'Asst. Prof.', color: '#0EA5E9', desc: 'Junior Faculty' },
  { name: 'Ext. Expert', color: '#F97316', desc: 'External/Visiting Expert' },
  { name: 'Teaching Asst.', color: '#10B981', desc: 'Teaching Support' },
  { name: 'Trainer', color: '#10B981', desc: 'Skill Trainer' },
  { name: 'Librarian', color: '#F97316', desc: 'Library Staff' },
];

function LevelBadge({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, marginTop: 16 }}>
      <div style={{ width: 4, height: 36, borderRadius: 2, background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color, textTransform: 'uppercase' as const }}>{label}</span>
    </div>
  );
}

function VConnector({ color = '#CBD5E1', h = 24 }: { color?: string; h?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <div style={{ width: 2, height: h, background: color }} />
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, marginTop: -4 }} />
    </div>
  );
}

// ─── Classic Tree ─────────────────────────────────────────────────────────────

function ClassicTree({ dynamicData }: { dynamicData?: DynamicTreeData }) {
  const [activeTab, setActiveTab] = useState<'structure' | 'allocation'>('structure');
  const [tip, setTip] = useState<TipData | null>(null);
  const [hov, setHov] = useState<number | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [levelsOpen, setLevelsOpen] = useState(true);
  const [deptsOpen, setDeptsOpen] = useState(true);
  const [rolesOpen, setRolesOpen] = useState(true);
  const [l1Open, setL1Open] = useState(true);
  const [l2Open, setL2Open] = useState(true);
  const [l3Open, setL3Open] = useState(true);
  const [openSubs, setOpenSubs] = useState<Set<number>>(new Set());
  const toggleSub = (i: number) => setOpenSubs(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const [l3Open2, setL3Open2] = useState(true);
  const [hov2, setHov2] = useState<number | null>(null);
  const [openSubs2, setOpenSubs2] = useState<Set<number>>(new Set());
  const toggleSub2 = (i: number) => setOpenSubs2(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  // Resolve data: dynamic API data takes priority, fallback to static
  const facultyName = dynamicData?.facultyName ?? FALLBACK_FACULTY;
  const schoolData  = dynamicData?.school     ?? FALLBACK_SCHOOL;
  const cos1Data    = dynamicData?.cos1       ?? FALLBACK_COS1;
  const cos2Data    = dynamicData?.cos2       ?? FALLBACK_COS2;
  const subDepts1   = dynamicData?.subDepts1  ?? FALLBACK_DEPTS1;
  const subDepts2   = dynamicData?.subDepts2  ?? FALLBACK_DEPTS2;

  // Reset collapse state when data changes
  useEffect(() => {
    setOpenSubs(new Set(subDepts1.map((_, i) => i)));
  }, [subDepts1.length]);
  useEffect(() => {
    setOpenSubs2(new Set(subDepts2.map((_, i) => i)));
  }, [subDepts2.length]);

  const list = subDepts1;
  const n = list.length || 1;
  const visibleRoles = Array.from(new Set([...subDepts1, ...subDepts2].flatMap(d => d.staff.map(s => s.name))));
  const roleColorMap = STAFF_ROLE_COLORS.filter(r => visibleRoles.includes(r.name));
  const allSubDepts = [...subDepts1, ...subDepts2];

  return (
    <div style={{ background: '#F1F5F9', width: '100%' }}>
      {tip && <Tooltip data={tip} />}

      {/* ── Tabs ── */}
      <div style={{ background: '#fff', borderBottom: '2px solid #E2E8F0', display: 'flex' }}>
        {([{ id: 'structure', label: 'University Structure' }, { id: 'allocation', label: 'Allocation' }] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1, padding: '16px 0', fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500, border: 'none', borderBottom: activeTab === tab.id ? '2.5px solid #F97316' : '2.5px solid transparent', background: activeTab === tab.id ? '#FFF7ED' : 'transparent', color: activeTab === tab.id ? '#F97316' : '#64748B', cursor: 'pointer', marginBottom: -2, transition: 'all 0.2s', letterSpacing: 0.2, textAlign: 'center' as const }}
            onMouseEnter={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.color = '#374151'; }}
            onMouseLeave={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.color = '#64748B'; }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Allocation Tab ── */}
      {activeTab === 'allocation' && <AllocationTab />}

      {activeTab === 'structure' && <>
      {/* ── Color Legend Panel ── */}
      <div style={{ background: '#fff', borderBottom: '2px solid #E2E8F0' }}>
        <button onClick={() => setGuideOpen(v => !v)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 32px', background: '#F97316', border: 'none', cursor: 'pointer', textAlign: 'left' as const, borderBottom: guideOpen ? '1px solid #ea6b00' : 'none' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#ea6b00'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F97316'; }}>
          <div style={{ width: 3, height: 18, background: 'rgba(255,255,255,0.6)', borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: 0.3 }}>Colour Guide</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>— what each colour in the chart represents</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: '#fff', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 4, padding: '2px 8px' }}>{guideOpen ? 'Click to collapse' : 'Click to expand'}</span>
            <span style={{ fontSize: 11, color: '#fff', display: 'inline-block', transform: guideOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.25s' }}>▼</span>
          </span>
        </button>

        <div style={{ maxHeight: guideOpen ? 0 : 30, opacity: guideOpen ? 0 : 1, overflow: 'hidden', transition: 'max-height 0.35s ease, opacity 0.4s ease', textAlign: 'center', paddingTop: guideOpen ? 0 : 6, paddingBottom: guideOpen ? 0 : 4, background: '#fff8f4', borderBottom: guideOpen ? 'none' : '1px solid #FFE4CC' }}>
          <span style={{ fontSize: 11, color: '#F97316', fontWeight: 500, letterSpacing: 0.2 }}>↑ Click the bar above to view colour guide</span>
        </div>

        <Collapse open={guideOpen} maxH={360} duration="0.3s">
          <div style={{ padding: '8px 32px 8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden' }}>

              <div style={{ padding: '0 12px 6px', borderRight: '1px solid #E2E8F0' }}>
                <button onClick={() => setLevelsOpen(v => !v)} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 6px', background: 'transparent', border: 'none', borderBottom: '1px solid #E2E8F0', cursor: 'pointer', marginBottom: levelsOpen ? 6 : 0, borderRadius: 4, transition: 'background 0.15s' }}>
                  <span style={{ fontSize: 12 }}>🏛️</span>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>Hierarchy Levels</div>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 9, color: '#94A3B8', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 4, padding: '1px 5px' }}>{levelsOpen ? 'collapse' : 'expand'}</span>
                    <span style={{ fontSize: 9, color: '#64748B', display: 'inline-block', transform: levelsOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.25s' }}>▼</span>
                  </span>
                </button>
                <Collapse open={levelsOpen}>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 3, paddingBottom: 4 }}>
                    {[{ color: LEVEL_COLORS.faculty.bg, label: 'Faculty', level: 'L1' }, { color: LEVEL_COLORS.school.bg, label: 'School', level: 'L2' }, { color: LEVEL_COLORS.department.bg, label: 'Department (COS)', level: 'L3' }].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '3px 6px', borderRadius: 6, background: '#F8FAFC' }}>
                        <div style={{ width: 20, height: 20, borderRadius: 5, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8, fontWeight: 900, color: '#fff' }}>{item.level}</span></div>
                        <div style={{ width: 20, height: 6, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>

              <div style={{ padding: '0 12px 6px', borderRight: '1px solid #E2E8F0', background: '#FAFBFC' }}>
                <button onClick={() => setDeptsOpen(v => !v)} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 6px', background: 'transparent', border: 'none', borderBottom: '1px solid #E2E8F0', cursor: 'pointer', marginBottom: deptsOpen ? 6 : 0, borderRadius: 4, transition: 'background 0.15s' }}>
                  <span style={{ fontSize: 12 }}>📂</span>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>Sub-Departments</div>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 9, color: '#94A3B8', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 4, padding: '1px 5px' }}>{deptsOpen ? 'collapse' : 'expand'}</span>
                    <span style={{ fontSize: 9, color: '#64748B', display: 'inline-block', transform: deptsOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.25s' }}>▼</span>
                  </span>
                </button>
                <Collapse open={deptsOpen}>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 3, paddingTop: 6, paddingBottom: 2 }}>
                    {list.map((sub, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '3px 6px', borderRadius: 6, background: `${sub.color}0d`, border: `1px solid ${sub.color}30` }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: sub.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#1E293B' }}>{sub.name}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, color: sub.color }}>{sub.count}</span>
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>

              <div style={{ padding: '0 12px 6px' }}>
                <button onClick={() => setRolesOpen(v => !v)} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 6px', background: 'transparent', border: 'none', borderBottom: '1px solid #E2E8F0', cursor: 'pointer', marginBottom: rolesOpen ? 6 : 0, borderRadius: 4, transition: 'background 0.15s' }}>
                  <span style={{ fontSize: 12 }}>👤</span>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>Staff Roles</div>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 9, color: '#94A3B8', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 4, padding: '1px 5px' }}>{rolesOpen ? 'collapse' : 'expand'}</span>
                    <span style={{ fontSize: 9, color: '#64748B', display: 'inline-block', transform: rolesOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.25s' }}>▼</span>
                  </span>
                </button>
                <Collapse open={rolesOpen}>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 3, paddingTop: 6, paddingBottom: 2 }}>
                    {roleColorMap.map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '3px 6px', borderRadius: 6, background: `${r.color}0d`, border: `1px solid ${r.color}30` }}>
                        <div style={{ width: 9, height: 9, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>{r.name}</div>
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>

            </div>
          </div>
        </Collapse>
      </div>

      {/* ── Main Tree ── */}
      <div style={{ padding: '20px 32px 48px' }}>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* L1: FACULTY */}
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 3, height: 20, borderRadius: 2, background: LEVEL_COLORS.faculty.bg }} />
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: LEVEL_COLORS.faculty.bg, textTransform: 'uppercase' as const }}>{LEVEL_COLORS.faculty.label}</span>
            </div>
            <div onClick={() => setL1Open(v => !v)}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; (e.currentTarget as HTMLElement).style.cursor = 'pointer'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: 'linear-gradient(135deg,#1E40AF,#2563EB)', color: '#fff', padding: '10px 16px', borderRadius: 12, boxShadow: '0 4px 18px #1E40AF44', cursor: 'pointer', transition: 'filter 0.2s', userSelect: 'none' as const }}>
              <div style={{ width: 4, height: 44, borderRadius: 2, background: LEVEL_COLORS.faculty.accent, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, color: LEVEL_COLORS.faculty.accent, marginBottom: 2 }}>Faculty</div>
                <div style={{ fontSize: 13, fontWeight: 900 }}>{facultyName}</div>
              </div>
              <div style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: LEVEL_COLORS.faculty.accent }}><Counter to={schoolData.count} /></div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>staff</div>
              </div>
              <div style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
              <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', display: 'inline-block', transform: l1Open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.3s', flexShrink: 0 }}>▼</div>
            </div>

            <Collapse open={l1Open}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <VConnector h={20} />

                {/* L2: SCHOOL */}
                <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 3, height: 20, borderRadius: 2, background: LEVEL_COLORS.school.bg }} />
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: LEVEL_COLORS.school.bg, textTransform: 'uppercase' as const }}>{LEVEL_COLORS.school.label}</span>
                </div>
                <div onClick={() => setL2Open(v => !v)}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: 'linear-gradient(135deg,#065F46,#059669)', color: '#fff', padding: '10px 16px', borderRadius: 12, boxShadow: '0 4px 18px #065F4644', cursor: 'pointer', userSelect: 'none' as const, transition: 'filter 0.2s' }}>
                  <div style={{ width: 4, height: 44, borderRadius: 2, background: LEVEL_COLORS.school.accent, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, color: LEVEL_COLORS.school.accent, marginBottom: 2 }}>Academic School</div>
                    <div style={{ fontSize: 13, fontWeight: 900 }}>{schoolData.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{schoolData.head} · {schoolData.headId}</div>
                  </div>
                  <div style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: LEVEL_COLORS.school.accent }}><Counter to={schoolData.count} /></div>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>staff</div>
                  </div>
                  <div style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                  <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: '3px 10px', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>HOS — Head of School</div>
                  <div style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                  <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', display: 'inline-block', transform: l2Open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.3s', flexShrink: 0 }}>▼</div>
                </div>

                <Collapse open={l2Open}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <VConnector h={20} />

                    {/* L3: DEPARTMENT label */}
                    <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 3, height: 20, borderRadius: 2, background: LEVEL_COLORS.department.bg }} />
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: LEVEL_COLORS.department.bg, textTransform: 'uppercase' as const }}>{LEVEL_COLORS.department.label}</span>
                    </div>

                    {/* Two COS nodes side by side */}
                    <div style={{ width: '100%' }}>
                      <div style={{ position: 'relative', height: 2, marginBottom: 0 }}>
                        <div style={{ position: 'absolute', left: '25%', right: '25%', height: 2, background: '#CBD5E1', borderRadius: 1 }} />
                      </div>
                      <div style={{ display: 'flex', width: '100%' }}>
                        {([
                          { cos: cos1Data, isOpen: l3Open, setOpen: setL3Open, depts: subDepts1, hovState: hov, setHovState: setHov, subsState: openSubs, toggleSubFn: toggleSub },
                          { cos: cos2Data, isOpen: l3Open2, setOpen: setL3Open2, depts: subDepts2, hovState: hov2, setHovState: setHov2, subsState: openSubs2, toggleSubFn: toggleSub2 },
                        ] as const).map((col, ci) => {
                          const cn = col.depts.length || 1;
                          const cpct = `${(100 / (cn * 2)).toFixed(2)}%`;
                          return (
                            <div key={ci} style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ width: 2, height: 20, background: '#CBD5E1' }} />
                              <div onClick={() => col.setOpen((v: boolean) => !v)}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: 'linear-gradient(135deg,#0C4A6E,#0284C7)', color: '#fff', padding: '10px 16px', borderRadius: 12, boxShadow: '0 4px 18px #0C4A6E44', cursor: 'pointer', userSelect: 'none' as const, transition: 'filter 0.2s' }}>
                                <div style={{ width: 4, height: 44, borderRadius: 2, background: LEVEL_COLORS.department.accent, flexShrink: 0 }} />
                                <div>
                                  <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, color: LEVEL_COLORS.department.accent, marginBottom: 2 }}>Centre of Studies</div>
                                  <div style={{ fontSize: 13, fontWeight: 900 }}>{col.cos.name}</div>
                                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{col.cos.head} · {col.cos.headId}</div>
                                </div>
                                <div style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                  <div style={{ fontSize: 24, fontWeight: 900, color: LEVEL_COLORS.department.accent }}><Counter to={col.cos.count} /></div>
                                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>staff</div>
                                </div>
                                <div style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: '3px 10px', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>COS — Head of Centre</div>
                                <div style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                                <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', display: 'inline-block', transform: col.isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.3s', flexShrink: 0 }}>▼</div>
                              </div>

                              <Collapse open={col.isOpen}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <VConnector h={24} />
                                  <div style={{ width: '100%' }}>
                                    <LevelBadge label={LEVEL_COLORS.subdept.label} color={LEVEL_COLORS.subdept.bg} />
                                    <div style={{ position: 'relative', width: '100%', height: 2, marginBottom: 0 }}>
                                      <div style={{ position: 'absolute', left: cpct, right: cpct, height: 2, background: '#CBD5E1', borderRadius: 1 }} />
                                    </div>
                                    <div style={{ display: 'flex', width: '100%' }}>
                                      {col.depts.map((sub, i) => {
                                        const sn = sub.staff.length;
                                        const sp = `${(100 / (sn * 2)).toFixed(2)}%`;
                                        const isH = col.hovState === i;
                                        const isSubOpen = col.subsState.has(i);
                                        return (
                                          <div key={i} style={{ width: `${100 / cn}%`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{ width: 2, height: 20, background: '#CBD5E1' }} />
                                            <div
                                              onClick={() => { col.toggleSubFn(i); setTip(null); }}
                                              onMouseEnter={e => { col.setHovState(i); setTip({ x: e.clientX, y: e.clientY, dept: sub }); }}
                                              onMouseMove={e => setTip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                                              onMouseLeave={() => { col.setHovState(null); setTip(null); }}
                                              style={{ width: '92%', background: `linear-gradient(160deg, ${sub.color}, ${sub.color}bb)`, color: '#fff', borderRadius: 12, padding: '10px 8px 8px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', transform: isH ? 'scale(1.05) translateY(-3px)' : 'scale(1)', boxShadow: isH ? `0 16px 32px ${sub.color}55` : `0 4px 14px ${sub.color}33`, position: 'relative', overflow: 'hidden' }}>
                                              <div style={{ position: 'absolute', top: -12, right: -12, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                                              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, color: 'rgba(255,255,255,0.6)', marginBottom: 3, textAlign: 'center' }}>Sub-Department</div>
                                              <div style={{ fontSize: 12, fontWeight: 800, textAlign: 'center', lineHeight: 1.3, minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{sub.name}</div>
                                              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '2px 8px' }}>
                                                  <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{isSubOpen ? 'collapse' : 'expand'}</span>
                                                  <span style={{ fontSize: 10, color: '#fff', display: 'inline-block', transform: isSubOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.3s' }}>▼</span>
                                                </div>
                                              </div>
                                            </div>
                                            <div style={{ width: '92%', background: '#fff', border: `1px solid ${sub.color}33`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '8px 6px 6px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 4 }}>
                                              <div style={{ fontSize: 26, fontWeight: 900, color: sub.color, lineHeight: 1 }}>{sub.count}</div>
                                              <div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600, marginTop: 2 }}>staff</div>
                                              <div style={{ height: 1, background: `${sub.color}22`, margin: '6px 0' }} />
                                              <div style={{ fontSize: 9, color: '#475569', lineHeight: 1.4 }}>{sub.head}</div>
                                              <div style={{ display: 'inline-block', background: `${sub.color}15`, color: sub.color, fontSize: 8, padding: '2px 8px', borderRadius: 20, fontWeight: 700, marginTop: 4, border: `1px solid ${sub.color}33` }}>HOD / COD</div>
                                            </div>
                                            <Collapse open={isSubOpen}>
                                              <div style={{ width: '100%' }}>
                                                {sn > 1
                                                  ? <div style={{ position: 'relative', width: '100%', height: 2 }}><div style={{ position: 'absolute', left: sp, right: sp, height: 2, background: `${sub.color}44` }} /></div>
                                                  : <div style={{ width: 2, height: 16, background: `${sub.color}44`, margin: '0 auto' }} />}
                                                <div style={{ display: 'flex', width: '100%' }}>
                                                  {sub.staff.map((st, j) => (
                                                    <div key={j} style={{ width: `${100 / sn}%`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                      {sn > 1 && <div style={{ width: 2, height: 16, background: `${sub.color}44` }} />}
                                                      <div style={{ width: '87%', borderRadius: '8px 8px 0 0', background: `linear-gradient(135deg, ${st.color}, ${st.color}cc)`, color: '#fff', textAlign: 'center', padding: '6px 3px 5px', position: 'relative', overflow: 'hidden' }}>
                                                        <div style={{ position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                                                        <div style={{ fontSize: 8, fontWeight: 800, lineHeight: 1.3, minHeight: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{st.name}</div>
                                                      </div>
                                                      <div style={{ width: '87%', background: `${st.color}12`, border: `1px solid ${st.color}33`, borderTop: 'none', textAlign: 'center', padding: '5px 0', borderRadius: '0 0 8px 8px' }}>
                                                        <div style={{ fontSize: 16, fontWeight: 900, color: st.color }}>{st.count}</div>
                                                        <div style={{ fontSize: 7, color: '#94A3B8', fontWeight: 600 }}>staff</div>
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            </Collapse>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </Collapse>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Collapse>
              </div>
            </Collapse>

          </div>
        </div>
      </div>
      </>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConstructionOrgChart() {

  const [phase, setPhase] = useState<'intro' | 'select' | 'chart'>('intro');
  const [titleVisible, setTitleVisible] = useState(false);
  const [fieldsVisible, setFieldsVisible] = useState(false);
  const [treeVisible, setTreeVisible] = useState(false);

  const [wings, setWings] = useState<WingOption[]>([]);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [selectedWingId, setSelectedWingId] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedWingLabel, setSelectedWingLabel] = useState('');
  const [selectedSchoolLabel, setSelectedSchoolLabel] = useState('');
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingTree, setLoadingTree] = useState(false);
  const [dynamicData, setDynamicData] = useState<DynamicTreeData | undefined>(undefined);

  // Intro animation
  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 150);
    const t2 = setTimeout(() => setPhase('select'), 1900);
    const t3 = setTimeout(() => setFieldsVisible(true), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Fetch wings on mount via server action
  useEffect(() => {
    setLoadingWings(true);
    getWingStructure()
      .then(res => {
        console.log('[OrgChart] wings full result:', JSON.stringify(res));
        if (res.status === 'error') console.error('[OrgChart] wings API error:', res.message);
        setWings(res.ApiData?.item1 ?? []);
      })
      .catch(err => console.error('[OrgChart] wings fetch error:', err))
      .finally(() => setLoadingWings(false));
  }, []);

  // Fetch schools when wing changes
  useEffect(() => {
    if (!selectedWingId) { setSchools([]); return; }
    setLoadingSchools(true);
    getSchoolDivStructure(selectedWingId)
      .then(res => {
        console.log('[OrgChart] schools result:', res);
        setSchools(res.ApiData?.item1 ?? []);
      })
      .catch(err => console.error('[OrgChart] schools error:', err))
      .finally(() => setLoadingSchools(false));
  }, [selectedWingId]);

  // Fetch tree when school selected
  useEffect(() => {
    if (!selectedSchoolId) return;
    setLoadingTree(true);
    setFieldsVisible(false);
    getTreeViewStructure(selectedSchoolId)
      .then(res => {
        console.log('[OrgChart] tree result:', res);
        const nodes: ApiNode[] = res.ApiData?.item1 ?? [];
        setDynamicData(nodes.length ? parseApiTree(nodes) : undefined);
        setTimeout(() => { setPhase('chart'); setTreeVisible(true); }, 700);
      })
      .catch(() => {
        setDynamicData(undefined);
        setTimeout(() => { setPhase('chart'); setTreeVisible(true); }, 700);
      })
      .finally(() => setLoadingTree(false));
  }, [selectedSchoolId]);

  const handleReset = () => {
    setPhase('select');
    setSelectedWingId('');
    setSelectedSchoolId('');
    setSelectedWingLabel('');
    setSelectedSchoolLabel('');
    setTreeVisible(false);
    setDynamicData(undefined);
    setTimeout(() => setFieldsVisible(true), 100);
  };

  const titleTop = phase !== 'intro';

  const selectStyle: React.CSSProperties = {
    minWidth: 300, padding: '13px 40px 13px 16px', fontSize: 13, borderRadius: 12,
    border: '1px solid #CBD5E1', background: '#F8FAFC', color: '#0F172A', outline: 'none',
    cursor: 'pointer', appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394A3B8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ fontFamily: '"Inter", system-ui, sans-serif', background: '#ffffff', minHeight: '100vh' }}>

      {/* ── Animated Header ── */}
      <div style={{
        background: '#ffffff',
        paddingTop: titleTop ? 52 : '40vh',
        paddingBottom: 52,
        minHeight: phase === 'chart' ? 'auto' : '100vh',
        transition: 'padding-top 1s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', overflow: 'hidden', boxSizing: 'border-box' as const,
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 20, right: 100, width: 110, height: 110, borderRadius: '50%', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.09)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: 180, width: 150, height: 150, borderRadius: '50%', background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.09)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', left: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.08)', pointerEvents: 'none' }} />

        {/* Title */}
        <div style={{ opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)', transition: 'opacity 1.4s ease, transform 1.4s ease', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: titleTop ? 44 : 84, fontWeight: 900, margin: 0, letterSpacing: -2, lineHeight: 1.05, transition: 'font-size 1s cubic-bezier(0.4,0,0.2,1)' }}>
            <span style={{ color: '#F97316' }}>University</span>{' '}
            <span style={{ color: '#0F172A' }}>Structure</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 14, margin: '10px 0 0', fontWeight: 400, letterSpacing: 0.2 }}>Academic hierarchy &amp; staff overview</p>
        </div>

        {/* Selection fields */}
        {phase !== 'intro' && phase !== 'chart' && (
          <div style={{ opacity: fieldsVisible ? 1 : 0, transform: fieldsVisible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.7s ease, transform 0.7s ease', marginTop: 52, display: 'flex', gap: 28, flexWrap: 'wrap' as const, justifyContent: 'center', position: 'relative', zIndex: 1, pointerEvents: fieldsVisible ? 'auto' : 'none' }}>

            {/* Wing / Division */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
              <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 3, color: '#64748B', paddingLeft: 2 }}>Wing / Division</label>
              <select value={selectedWingId} onChange={e => { setSelectedWingId(e.target.value); setSelectedSchoolId(''); setSelectedWingLabel(wings.find(w => w.wingId === e.target.value)?.wingName ?? ''); }} style={selectStyle} disabled={loadingWings}>
                <option value="">{loadingWings ? 'Loading…' : 'Select wing or division…'}</option>
                {wings.map(w => <option key={w.wingId} value={w.wingId}>{w.wingName}</option>)}
              </select>
            </div>

            {/* School / Department */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
              <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 3, color: '#64748B', paddingLeft: 2 }}>School / Department</label>
              <select value={selectedSchoolId} onChange={e => { setSelectedSchoolId(e.target.value); setSelectedSchoolLabel(schools.find(s => s.id === e.target.value)?.schoolDivisionName ?? ''); }} style={{ ...selectStyle, cursor: selectedWingId ? 'pointer' : 'not-allowed' }} disabled={!selectedWingId || loadingSchools}>
                <option value="">{loadingSchools ? 'Loading…' : 'Select school or department…'}</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.schoolDivisionName}</option>)}
              </select>
            </div>

          </div>
        )}

        {/* Loading indicator while fetching tree */}
        {loadingTree && phase !== 'chart' && (
          <div style={{ marginTop: 32, fontSize: 13, color: '#94A3B8', position: 'relative', zIndex: 1 }}>Loading structure…</div>
        )}

        {/* Breadcrumb + Change button */}
        {phase === 'chart' && (
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1, opacity: treeVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400 }}>{selectedWingLabel}</span>
            <span style={{ color: '#CBD5E1', fontSize: 12 }}>›</span>
            <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>{selectedSchoolLabel}</span>
            <button onClick={handleReset}
              style={{ marginLeft: 10, padding: '4px 14px', fontSize: 10, fontWeight: 700, borderRadius: 20, border: '1px solid #CBD5E1', background: '#F1F5F9', color: '#64748B', cursor: 'pointer', letterSpacing: 0.5, transition: 'background 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E2E8F0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; }}>
              Change
            </button>
          </div>
        )}
      </div>

      {/* ── Classic Tree ── */}
      {treeVisible && (
        <div style={{ opacity: treeVisible ? 1 : 0, animation: 'fadeInUp 0.7s ease forwards' }}>
          <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          <ClassicTree dynamicData={dynamicData} />
        </div>
      )}
    </div>
  );
}
