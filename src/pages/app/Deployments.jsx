import { useState } from 'react'
import '../../App.css'

const PIPELINES = [
  {
    id: 1, project: 'ecommerce-api', branch: 'main', commit: 'a3f8c21',
    msg: 'feat: add stripe webhook endpoint', author: 'Carlos M.', time: '5 min atrás',
    status: 'success', duration: '1m 48s', env: 'Production',
    steps: [
      { name: 'Checkout', status: 'success', dur: '2s' },
      { name: 'Install deps', status: 'success', dur: '18s' },
      { name: 'Lint & Format', status: 'success', dur: '8s' },
      { name: 'Tests (142)', status: 'success', dur: '34s' },
      { name: 'Build', status: 'success', dur: '22s' },
      { name: 'AI Security Scan', status: 'success', dur: '12s' },
      { name: 'Deploy → Production', status: 'success', dur: '12s' },
    ],
  },
  {
    id: 2, project: 'mobile-app', branch: 'develop', commit: 'b7d2e44',
    msg: 'fix: fix push notification crash on iOS', author: 'Fernanda C.', time: '23 min atrás',
    status: 'running', duration: '45s...', env: 'Staging',
    steps: [
      { name: 'Checkout', status: 'success', dur: '2s' },
      { name: 'Install deps', status: 'success', dur: '28s' },
      { name: 'Lint & Format', status: 'success', dur: '9s' },
      { name: 'Tests (89)', status: 'running', dur: '...' },
      { name: 'Build', status: 'pending', dur: '—' },
      { name: 'AI Security Scan', status: 'pending', dur: '—' },
      { name: 'Deploy → Staging', status: 'pending', dur: '—' },
    ],
  },
  {
    id: 3, project: 'user-service', branch: 'main', commit: 'c9a1f77',
    msg: 'refactor: remove deprecated bcrypt calls', author: 'Ana R.', time: '1h atrás',
    status: 'failed', duration: '2m 03s', env: 'Production',
    steps: [
      { name: 'Checkout', status: 'success', dur: '2s' },
      { name: 'Install deps', status: 'success', dur: '22s' },
      { name: 'Lint & Format', status: 'success', dur: '7s' },
      { name: 'Tests (211)', status: 'failed', dur: '1m 12s', error: '3 testes falharam: AuthController.spec.js linha 48, 72, 91' },
      { name: 'Build', status: 'skipped', dur: '—' },
      { name: 'AI Security Scan', status: 'skipped', dur: '—' },
      { name: 'Deploy → Production', status: 'skipped', dur: '—' },
    ],
  },
  {
    id: 4, project: 'dashboard-v2', branch: 'main', commit: 'e2b3d98',
    msg: 'chore: update react to 19.2', author: 'Ana R.', time: '3h atrás',
    status: 'success', duration: '58s', env: 'Production',
    steps: [
      { name: 'Checkout', status: 'success', dur: '1s' },
      { name: 'Install deps', status: 'success', dur: '14s' },
      { name: 'Lint & Format', status: 'success', dur: '6s' },
      { name: 'Tests (67)', status: 'success', dur: '18s' },
      { name: 'Build', status: 'success', dur: '11s' },
      { name: 'AI Security Scan', status: 'success', dur: '4s' },
      { name: 'Deploy → Production', status: 'success', dur: '4s' },
    ],
  },
]

const STATUS_CFG = {
  success: { label: '✓ Sucesso', color: '#10b981', bg: 'rgba(16,185,129,.1)' },
  running: { label: '⟳ Executando', color: '#0ea5e9', bg: 'rgba(6,182,212,.1)' },
  failed:  { label: '✕ Falhou', color: '#ef4444', bg: 'rgba(239,68,68,.1)' },
  pending: { label: '○ Pendente', color: '#6b7280', bg: 'rgba(107,114,128,.1)' },
  skipped: { label: '⊘ Ignorado', color: '#6b7280', bg: 'rgba(107,114,128,.08)' },
}

function StepIcon({ status }) {
  if (status === 'success') return <span className="step-ico success">✓</span>
  if (status === 'failed')  return <span className="step-ico failed">✕</span>
  if (status === 'running') return <span className="step-ico running"><span className="spinner" /></span>
  return <span className="step-ico pending">○</span>
}

export default function Deployments() {
  const [selected, setSelected] = useState(PIPELINES[0])
  const [filter, setFilter] = useState('all')
  const [rerunning, setRerunning] = useState(null)

  const rerun = async (id) => {
    setRerunning(id)
    await new Promise(r => setTimeout(r, 1500))
    setRerunning(null)
  }

  const visible = filter === 'all' ? PIPELINES : PIPELINES.filter(p => p.status === filter)

  const successRate = Math.round((PIPELINES.filter(p=>p.status==='success').length / PIPELINES.length) * 100)
  const avgDur = '1m 28s'

  return (
    <div className="dash-page reviews-layout">
      {/* Left */}
      <div>
        <div className="dash-head" style={{ marginBottom: 16 }}>
          <div>
            <h1 className="dash-title">Deployments</h1>
            <p className="dash-sub">{PIPELINES.length} pipelines recentes</p>
          </div>
        </div>

        <div className="deploy-summary">
          <div className="ds-stat"><strong style={{ color: '#10b981' }}>{successRate}%</strong><small>Taxa de sucesso</small></div>
          <div className="ds-stat"><strong>{avgDur}</strong><small>Duração média</small></div>
          <div className="ds-stat"><strong>{PIPELINES.filter(p=>p.status==='running').length}</strong><small>Em execução</small></div>
        </div>

        <div className="filter-tabs" style={{ marginBottom: 16 }}>
          {['all','success','running','failed'].map(f => (
            <button key={f} className={`filter-tab${filter===f?' on':''}`} onClick={()=>setFilter(f)}>
              {f==='all'?'Todos':STATUS_CFG[f].label}
            </button>
          ))}
        </div>

        <div className="pipeline-list">
          {visible.map(p => {
            const s = STATUS_CFG[p.status]
            return (
              <div key={p.id} className={`pipeline-item${selected?.id===p.id?' active':''}`} onClick={() => setSelected(p)}>
                <div className="pi-top">
                  <div className="pi-left">
                    <span className="pi-status" style={{ color: s.color }}>{s.label}</span>
                    <strong className="pi-project">{p.project}</strong>
                  </div>
                  <span className="pi-env">{p.env}</span>
                </div>
                <div className="pi-msg">{p.msg}</div>
                <div className="pi-meta">
                  <code>{p.commit}</code>
                  <span className="ri-dot">·</span>
                  <span>{p.branch}</span>
                  <span className="ri-dot">·</span>
                  <span>{p.author}</span>
                  <span className="ri-dot">·</span>
                  <span>{p.time}</span>
                </div>
                <div className="pi-dur">⏱ {p.duration}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right — detail */}
      {selected && (() => {
        const s = STATUS_CFG[selected.status]
        return (
          <div className="review-detail">
            <div className="rd-header">
              <div>
                <div className="rd-pr-title">
                  <strong>{selected.project}</strong>
                  <span className="ri-status" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                </div>
                <p className="rd-title" style={{ fontSize: 16 }}>{selected.msg}</p>
                <div className="ri-meta">
                  <code>{selected.commit}</code>
                  <span className="ri-dot">·</span>
                  <span>{selected.branch} → {selected.env}</span>
                  <span className="ri-dot">·</span>
                  <span>{selected.author}</span>
                  <span className="ri-dot">·</span>
                  <span>{selected.time}</span>
                </div>
              </div>
            </div>

            <div className="pipeline-steps">
              <h3 style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '.06em' }}>Pipeline</h3>
              {selected.steps.map((step, i) => (
                <div key={i} className={`ps-step${step.status === 'failed' ? ' failed' : ''}`}>
                  <div className="ps-left">
                    <StepIcon status={step.status} />
                    <div>
                      <strong className="ps-name">{step.name}</strong>
                      {step.error && <p className="ps-error">{step.error}</p>}
                    </div>
                  </div>
                  <span className="ps-dur">{step.dur}</span>
                </div>
              ))}
            </div>

            <div className="rd-actions">
              {selected.status === 'failed' && (
                <button className="btn-primary" onClick={() => rerun(selected.id)} disabled={rerunning === selected.id}>
                  {rerunning === selected.id ? <><span className="spinner" /> Reiniciando...</> : '↺ Re-executar pipeline'}
                </button>
              )}
              {selected.status === 'success' && (
                <button className="btn-outline">📋 Ver logs completos</button>
              )}
              <button className="btn-outline">🔗 Ver no GitHub</button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
