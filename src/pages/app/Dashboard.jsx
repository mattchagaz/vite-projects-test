import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../App.css'

const CHART_DATA = [42, 58, 35, 71, 63, 88, 52, 94, 78, 65, 89, 96]
const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

const ACTIVITY = [
  { icon: '✓', color: '#10b981', bg: 'rgba(16,185,129,.12)', text: 'Deploy de ecommerce-api para produção', time: '3 min atrás', user: 'Você' },
  { icon: '✦', color: '#7c3aed', bg: 'rgba(124,58,237,.12)', text: 'IA detectou memory leak em user-service', time: '18 min atrás', user: 'Lumina AI' },
  { icon: '⌀', color: '#0ea5e9', bg: 'rgba(6,182,212,.12)', text: 'PR #52 "feat: add payment gateway" aberto', time: '34 min atrás', user: 'Carlos M.' },
  { icon: '⚡', color: '#f59e0b', bg: 'rgba(245,158,11,.12)', text: 'Pipeline mobile-app concluído em 43s', time: '1h atrás', user: 'Sistema' },
  { icon: '🔒', color: '#ef4444', bg: 'rgba(239,68,68,.12)', text: 'Vulnerabilidade CVE-2024-1234 corrigida', time: '2h atrás', user: 'Lumina AI' },
  { icon: '👥', color: '#10b981', bg: 'rgba(16,185,129,.12)', text: 'Fernanda entrou no projeto dashboard-v2', time: '3h atrás', user: 'Admin' },
]

const PROJECTS = [
  { name: 'ecommerce-api', lang: 'Node.js', status: 'online', health: 98, deploys: 24, reviews: 3, color: '#10b981' },
  { name: 'mobile-app', lang: 'React Native', status: 'building', health: 82, deploys: 11, reviews: 1, color: '#f59e0b' },
  { name: 'dashboard-v2', lang: 'React', status: 'online', health: 100, deploys: 8, reviews: 0, color: '#10b981' },
  { name: 'user-service', lang: 'Python', status: 'warning', health: 71, deploys: 19, reviews: 5, color: '#ef4444' },
]

function MiniChart({ data }) {
  const max = Math.max(...data)
  return (
    <div className="mini-chart">
      {data.map((v, i) => (
        <div key={i} className="bar-col">
          <div className="bar-fill" style={{ height: `${(v / max) * 100}%` }} />
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  const stats = [
    { label: 'Deploys hoje', value: '7', delta: '+2 vs ontem', positive: true, icon: '⚡' },
    { label: 'Reviews ativos', value: '12', delta: '3 aguardando IA', positive: null, icon: '✦' },
    { label: 'Taxa de sucesso', value: '97.3%', delta: '+1.2% este mês', positive: true, icon: '✓' },
    { label: 'Bugs detectados', value: '4', delta: '-8 vs semana passada', positive: true, icon: '🛡' },
  ]

  return (
    <div className="dash-page">
      {/* Header */}
      <div className="dash-head">
        <div>
          <h1 className="dash-title">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="dash-sub">Aqui está um resumo do seu ambiente hoje.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/app/projects')}>
          + Novo Projeto
        </button>
      </div>

      {/* Stats */}
      <div className="stat-cards">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="sc-top">
              <span className="sc-icon">{s.icon}</span>
              <span className={`sc-delta${s.positive === true ? ' pos' : s.positive === false ? ' neg' : ''}`}>
                {s.delta}
              </span>
            </div>
            <div className="sc-value">{s.value}</div>
            <div className="sc-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="dash-grid-2">
        {/* Deploy chart */}
        <div className="app-card">
          <div className="card-head">
            <div>
              <h3>Deploys por mês</h3>
              <p>Últimos 12 meses</p>
            </div>
            <span className="badge-green">+34% vs anterior</span>
          </div>
          <div className="bar-chart">
            {CHART_DATA.map((v, i) => {
              const max = Math.max(...CHART_DATA)
              return (
                <div key={i} className="barchart-col">
                  <div className="barchart-bar" style={{ height: `${(v / max) * 100}%` }}>
                    <span className="bar-tooltip">{v}</span>
                  </div>
                  <span className="barchart-label">{MONTHS[i]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Health ring */}
        <div className="app-card">
          <div className="card-head">
            <div>
              <h3>Saúde dos sistemas</h3>
              <p>Status em tempo real</p>
            </div>
          </div>
          <div className="health-list">
            {[
              { name: 'ecommerce-api', val: 98, color: '#10b981' },
              { name: 'mobile-app',    val: 82, color: '#f59e0b' },
              { name: 'dashboard-v2',  val: 100, color: '#10b981' },
              { name: 'user-service',  val: 71, color: '#ef4444' },
            ].map((h, i) => (
              <div key={i} className="health-row">
                <span className="health-name">{h.name}</span>
                <div className="health-bar-wrap">
                  <div className="health-bar" style={{ width: `${h.val}%`, background: h.color }} />
                </div>
                <span className="health-val" style={{ color: h.color }}>{h.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects + Activity */}
      <div className="dash-grid-2">
        {/* Projects */}
        <div className="app-card">
          <div className="card-head">
            <div><h3>Projetos ativos</h3><p>4 projetos em execução</p></div>
            <button className="btn-link" onClick={() => navigate('/app/projects')}>Ver todos →</button>
          </div>
          <div className="project-list">
            {PROJECTS.map((p, i) => (
              <div key={i} className="project-row">
                <div className="proj-info">
                  <span className="proj-dot" style={{ background: p.color }} />
                  <div>
                    <strong>{p.name}</strong>
                    <small>{p.lang}</small>
                  </div>
                </div>
                <div className="proj-meta">
                  <span className={`status-chip ${p.status}`}>
                    {p.status === 'online' ? '● Online' : p.status === 'building' ? '⟳ Building' : '⚠ Warning'}
                  </span>
                  <span className="proj-num">{p.deploys} deploys</span>
                  {p.reviews > 0 && <span className="proj-reviews">{p.reviews} reviews</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="app-card">
          <div className="card-head">
            <div><h3>Atividade recente</h3><p>Últimas ações no ambiente</p></div>
          </div>
          <div className="activity-list">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="activity-row">
                <span className="act-icon" style={{ background: a.bg, color: a.color }}>{a.icon}</span>
                <div className="act-body">
                  <span>{a.text}</span>
                  <small>{a.user} · {a.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
