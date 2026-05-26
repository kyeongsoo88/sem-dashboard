import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import './App.css';

// ── DATA (단위: 백만원) ──────────────────────────────────
const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

const google24 = [210,230,280,320,350,380,400,390,360,340,320,380];
const meta24   = [120,130,150,180,200,220,230,220,200,190,180,210];
const google25 = [240,260,310,350,380,420,440,410,390,360,340,400];
const meta25   = [140,150,180,210,230,250,260,240,220,200,195,235];
const rev24    = [1250,1380,1620,1850,2030,2210,2350,2280,2100,1980,1860,2240];
const rev25    = [1420,1560,1880,2120,2350,2580,2700,2560,2380,2180,2050,2480];

const spend24 = months.map((_, i) => google24[i] + meta24[i]);
const spend25 = months.map((_, i) => google25[i] + meta25[i]);
const roas24  = rev24.map((r, i) => parseFloat((r / spend24[i]).toFixed(2)));
const roas25  = rev25.map((r, i) => parseFloat((r / spend25[i]).toFixed(2)));
const roi24   = rev24.map((r, i) => parseFloat(((r - spend24[i]) / spend24[i] * 100).toFixed(1)));
const roi25   = rev25.map((r, i) => parseFloat(((r - spend25[i]) / spend25[i] * 100).toFixed(1)));

const totSpend24 = spend24.reduce((a, b) => a + b, 0);
const totSpend25 = spend25.reduce((a, b) => a + b, 0);
const totRev24   = rev24.reduce((a, b) => a + b, 0);
const totRev25   = rev25.reduce((a, b) => a + b, 0);
const totROAS25  = parseFloat((totRev25 / totSpend25).toFixed(2));
const totROI25   = parseFloat(((totRev25 - totSpend25) / totSpend25 * 100).toFixed(1));
const costRate24 = parseFloat((totSpend24 / totRev24 * 100).toFixed(1));
const costRate25 = parseFloat((totSpend25 / totRev25 * 100).toFixed(1));
const spendYoY   = parseFloat(((totSpend25 - totSpend24) / totSpend24 * 100).toFixed(1));
const revYoY     = parseFloat(((totRev25 - totRev24) / totRev24 * 100).toFixed(1));
const totGoogle25 = google25.reduce((a, b) => a + b, 0);
const totMeta25   = meta25.reduce((a, b) => a + b, 0);

const monthlyData = months.map((m, i) => ({
  month: m,
  google24: google24[i], meta24: meta24[i],
  google25: google25[i], meta25: meta25[i],
  spend24: spend24[i],   spend25: spend25[i],
  rev24: rev24[i],       rev25: rev25[i],
  roas24: roas24[i],     roas25: roas25[i],
  roi24: roi24[i],       roi25: roi25[i],
}));

// Brand data
const brands = [
  { name: 'MLB',      spend: 2800, rev: 15800 },
  { name: 'Discovery',spend: 1200, rev: 5800  },
  { name: 'K2',       spend: 800,  rev: 3600  },
  { name: 'SCOTT',    spend: 500,  rev: 2100  },
  { name: 'Duvetica', spend: 320,  rev: 1350  },
].map(b => ({
  ...b,
  roas: parseFloat((b.rev / b.spend).toFixed(2)),
  roi:  parseFloat(((b.rev - b.spend) / b.spend * 100).toFixed(1)),
  costRate: parseFloat((b.spend / b.rev * 100).toFixed(1)),
}));

const COLORS = {
  google25: '#4285F4',
  meta25:   '#1877F2',
  google24: '#9ab8f7',
  meta24:   '#90b4f5',
  rev25:    '#34a853',
  rev24:    '#a8d5b5',
  spend25:  '#4285F4',
  spend24:  '#9ab8f7',
  roas25:   '#4285F4',
  roas24:   '#bbb',
  roi25:    '#34a853',
  roi24:    '#bbb',
};

type Tab = 'spend' | 'roas' | 'roi';

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}B` : `${n}M`;

function KPI({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="kpi-card">
      <div className="kpi-value" style={color ? { color } : {}}>{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('spend');

  return (
    <div className="app">
      {/* ── HEADER ── */}
      <div className="header">
        <div>
          <h1>SEM 광고비 분석 대시보드</h1>
          <p className="sub">구글 · 메타 | 2024 전년대비 2025 | 브랜드별 ROI / ROAS 비교</p>
        </div>
        <div className="badge">샘플 데이터 · 단위: 백만원</div>
      </div>

      {/* ── KPI STRIP ── */}
      <div className="kpi-grid">
        <KPI label="2025 총 광고비"    value={fmt(totSpend25)} />
        <KPI label="2025 귀속 매출"    value={fmt(totRev25)}   color="#34a853" />
        <KPI label="ROAS (2025)"       value={`${totROAS25}x`} color="#4285F4" />
        <KPI label="ROI (2025)"        value={`${totROI25}%`}  color="#34a853" />
        <KPI label="비용율 (광고비÷매출)" value={`${costRate25}%`} sub={`전년 ${costRate24}%`} />
        <KPI label="광고비 YoY"        value={`+${spendYoY}%`} color="#f4a320"
          sub={`매출 YoY +${revYoY}%`} />
      </div>

      {/* ── YoY SUMMARY ── */}
      <div className="callout-grid">
        <div className="callout callout-blue">
          <strong>2025 vs 2024 광고비</strong>
          <span>전년 {fmt(totSpend24)} → 올해 {fmt(totSpend25)} (+{spendYoY}%)
          · 구글 {Math.round(totGoogle25 / (totGoogle25 + totMeta25) * 100)}%
          / 메타 {Math.round(totMeta25 / (totGoogle25 + totMeta25) * 100)}%</span>
        </div>
        <div className="callout callout-green">
          <strong>2025 vs 2024 귀속 매출</strong>
          <span>전년 {fmt(totRev24)} → 올해 {fmt(totRev25)} (+{revYoY}%)
          · ROAS {parseFloat((totRev24 / totSpend24).toFixed(2))}x → {totROAS25}x
          / 비용율 {costRate24}% → {costRate25}%</span>
        </div>
      </div>

      {/* ── TREND SECTION ── */}
      <div className="section-header">
        <h2>채널별 광고비 · 성과 추이</h2>
        <div className="tab-group">
          {(['spend','roas','roi'] as Tab[]).map(v => (
            <button
              key={v}
              className={`tab-btn${tab === v ? ' active' : ''}`}
              onClick={() => setTab(v)}
            >
              {v === 'spend' ? '광고비' : v === 'roas' ? 'ROAS' : 'ROI'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'spend' && (
        <div className="chart-grid-2">
          <div className="chart-block">
            <h3>구글 vs 메타 월별 광고비 (2024 vs 2025)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="M" />
                <Tooltip formatter={(v) => [`${v}M`, '']} />
                <Legend />
                <Bar dataKey="google24" name="구글 2024" stackId="a" fill={COLORS.google24} />
                <Bar dataKey="meta24"   name="메타 2024" stackId="a" fill={COLORS.meta24} />
                <Bar dataKey="google25" name="구글 2025" stackId="b" fill={COLORS.google25} />
                <Bar dataKey="meta25"   name="메타 2025" stackId="b" fill={COLORS.meta25} />
              </BarChart>
            </ResponsiveContainer>
            <p className="chart-caption">Source: 구글 애즈 · 메타 비즈니스 · 2024–2025 연간</p>
          </div>
          <div className="chart-block">
            <h3>채널 믹스 구성비 (2025 연간)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={[
                    { name: '구글', value: totGoogle25 },
                    { name: '메타',  value: totMeta25 },
                  ]}
                  cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                  dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  <Cell fill={COLORS.google25} />
                  <Cell fill={COLORS.meta25} />
                </Pie>
                <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}M`]} />
              </PieChart>
            </ResponsiveContainer>
            <p className="chart-caption">
              구글 {totGoogle25.toLocaleString()}M · 메타 {totMeta25.toLocaleString()}M
            </p>
          </div>
        </div>
      )}

      {tab === 'roas' && (
        <div className="chart-block chart-block-full">
          <h3>월별 ROAS 추이 — 전년 vs 올해 (귀속매출 ÷ 광고비)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={['auto','auto']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="roas24" name="ROAS 2024" stroke={COLORS.roas24} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="roas25" name="ROAS 2025" stroke={COLORS.roas25} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="chart-caption">ROAS = 귀속매출 / (구글+메타 광고비)</p>
        </div>
      )}

      {tab === 'roi' && (
        <div className="chart-block chart-block-full">
          <h3>월별 ROI 추이 — 전년 vs 올해 ((매출−비용)÷비용 × 100)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v) => [`${v}%`, '']} />
              <Legend />
              <Line type="monotone" dataKey="roi24" name="ROI 2024" stroke={COLORS.roi24} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="roi25" name="ROI 2025" stroke={COLORS.roi25} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="chart-caption">ROI = (귀속매출 − 광고비) / 광고비 × 100</p>
        </div>
      )}

      {/* ── YoY BAR COMPARISON ── */}
      <h2 className="section-title">전년대비 절대값 비교 (2024 vs 2025)</h2>
      <div className="chart-grid-2">
        <div className="chart-block">
          <h3>총 광고비 월별 YoY</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="M" />
              <Tooltip formatter={(v) => [`${v}M`, '']} />
              <Legend />
              <Bar dataKey="spend24" name="2024 광고비" fill={COLORS.spend24} />
              <Bar dataKey="spend25" name="2025 광고비" fill={COLORS.spend25} />
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-caption">단위: 백만원 · 구글+메타 합산</p>
        </div>
        <div className="chart-block">
          <h3>귀속 매출 월별 YoY</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="M" />
              <Tooltip formatter={(v) => [`${v}M`, '']} />
              <Legend />
              <Bar dataKey="rev24" name="2024 매출" fill={COLORS.rev24} />
              <Bar dataKey="rev25" name="2025 매출" fill={COLORS.rev25} />
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-caption">단위: 백만원 · SEM 귀속 매출 기준</p>
        </div>
      </div>

      {/* ── BRAND COMPARISON ── */}
      <h2 className="section-title">브랜드별 SEM 성과 비교 (2025 연간)</h2>
      <div className="chart-grid-2">
        <div className="chart-block">
          <h3>브랜드별 광고비 vs 귀속 매출</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={brands} layout="vertical" margin={{ top: 4, right: 24, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tick={{ fontSize: 11 }} unit="M" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}M`, '']} />
              <Legend />
              <Bar dataKey="spend" name="광고비"    fill={COLORS.meta25} />
              <Bar dataKey="rev"   name="귀속매출" fill={COLORS.rev25} />
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-caption">단위: 백만원 · 2025 연간</p>
        </div>
        <div className="chart-block">
          <h3>브랜드별 ROAS (귀속매출 ÷ 광고비)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={brands} layout="vertical" margin={{ top: 4, right: 24, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 7]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v}x`, 'ROAS']} />
              <Bar dataKey="roas" name="ROAS" fill={COLORS.google25}>
                {brands.map((b) => (
                  <Cell key={b.name} fill={b.roas >= 5.5 ? '#34a853' : b.roas < 4.5 ? '#f4a320' : COLORS.google25} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-caption">5.5x 이상: 초록 · 4.5x 미만: 주의</p>
        </div>
      </div>

      {/* ── MONTHLY TABLE ── */}
      <h2 className="section-title">월별 상세 현황 (2025)</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>월</th><th>구글(M)</th><th>메타(M)</th><th>총광고비(M)</th>
              <th>귀속매출(M)</th><th>ROAS</th><th>ROI(%)</th><th>비용율(%)</th>
              <th>광고비 YoY</th><th>매출 YoY</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m, i) => {
              const s = spend25[i], r = rev25[i];
              const cr  = parseFloat((s / r * 100).toFixed(1));
              const sYoY = ((s - spend24[i]) / spend24[i] * 100).toFixed(1);
              const rYoY = ((r - rev24[i])   / rev24[i]   * 100).toFixed(1);
              return (
                <tr key={m}>
                  <td>{m}</td>
                  <td className="num">{google25[i].toLocaleString()}</td>
                  <td className="num">{meta25[i].toLocaleString()}</td>
                  <td className="num">{s.toLocaleString()}</td>
                  <td className="num">{r.toLocaleString()}</td>
                  <td className="num">{roas25[i]}x</td>
                  <td className="num">{roi25[i]}%</td>
                  <td className="num">{cr}%</td>
                  <td className="num yoy">+{sYoY}%</td>
                  <td className="num yoy-g">+{rYoY}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── BRAND TABLE ── */}
      <h2 className="section-title">브랜드별 상세 (2025 연간)</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>브랜드</th><th>광고비(M)</th><th>귀속매출(M)</th>
              <th>ROAS</th><th>ROI(%)</th><th>비용율(%)</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(b => (
              <tr key={b.name} className={b.roas >= 5.5 ? 'row-green' : b.roas < 4.5 ? 'row-orange' : ''}>
                <td><strong>{b.name}</strong></td>
                <td className="num">{b.spend.toLocaleString()}</td>
                <td className="num">{b.rev.toLocaleString()}</td>
                <td className="num">{b.roas}x</td>
                <td className="num">{b.roi}%</td>
                <td className="num">{b.costRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer-note">
        * 현재 수치는 레이아웃 검토용 샘플 데이터입니다. 실제 구글 애즈 / 메타 비즈니스 데이터를 연동하면 자동으로 반영됩니다.
      </div>
    </div>
  );
}
