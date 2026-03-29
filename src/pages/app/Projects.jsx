import { useState } from 'react'
import '../../App.css'

const INITIAL = [
  { id: 1, name: 'ecommerce-api', lang: 'Node.js', env: 'Production', status: 'online', health: 98, deploys: 24, branch: 'main', lastDeploy: '3 min atrás', contributors: ['AC','CM','FR'], color: '#10b981', private: true },
  { id: 2, name: 'mobile-app', lang: 'React Native', env: 'Staging', status: 'building', health: 82, deploys: 11, branch: 'develop', lastDeploy: '12 min atrás', contributors: ['AC','FR'], color: '#f59e0b', private: false },
  { id: 3, name: 'dashboard-v2', lang: 'React', env: 'Production', status: 'online', health: 100, deploys: 8, branch: 'main', lastDeploy: '2h atrás', contributors: ['AC'], color: '#10b981', private: false },
  { id: 4, name: 'user-service', lang: 'Python', env: 'Production', status: 'warning', health: 71, deploys: 19, branch: 'main', lastDeploy: '5h atrás', contributors: ['AC','CM'], color: '#ef4444', private: true },
  { id: 5, name: 'analytics-engine', lang: 'Go', env: 'Development', status: 'offline', health: 0, deploys: 3, branch: 'feature/v2', lastDeploy: '2 dias atrás', contributors: ['AC'], color: '#6b7280', private: true },
]

const STATUS_LABELS = { online: '● Online', building: '⟳ Building', warning: '⚠ Warning', offline: '○ Offline' }

function NewProjectModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', lang: 'Node.js', env: 'Production', private: true })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const langs = ['Node.js','React','Python','Go','Rust','Java','PHP','Ruby','TypeScript']
  const envs = ['Production','Staging','Development']

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nome é obrigatório'
    else if (form.name.trim().length < 3) errs.name = 'Mínimo 3 caracteres'
    else if (!/^[a-z0-9-]+$/.test(form.name.trim())) errs.name = 'Apenas letras minúsculas, números e hífens'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    onCreate({ ...form, name: form.name.trim() })
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Novo Projeto</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} noValidate>
          <div className={`field${errors.name ? ' err' : ''}`}>
            <label>Nome do repositório</label>
            <div className="input-wrap">
              <input type="text" placeholder="meu-projeto" value={form.name}
                onChange={e => { setForm(p=>({...p, name: e.target.value.toLowerCase().replace(/\s/g,'-')})); setErrors({}) }} />
            </div>
            {errors.name && <span className="field-err">{errors.name}</span>}
          </div>
          <div className="field">
            <label>Linguagem principal</label>
            <select value={form.lang} onChange={e => setForm(p=>({...p,lang:e.target.value}))}>
              {langs.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Ambiente inicial</label>
            <select value={form.env} onChange={e => setForm(p=>({...p,env:e.target.value}))}>
              {envs.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.private} onChange={e => setForm(p=>({...p,private:e.target.checked}))} />
            <span>Repositório privado</span>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Criando...</> : 'Criar projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState(INITIAL)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [deploying, setDeploying] = useState(null)

  const filtered = projects.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = p.name.includes(q) || p.lang.toLowerCase().includes(q)
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  const deploy = async (id) => {
    setDeploying(id)
    await new Promise(r => setTimeout(r, 2000))
    setProjects(ps => ps.map(p => p.id === id ? { ...p, status: 'online', lastDeploy: 'agora mesmo', deploys: p.deploys + 1 } : p))
    setDeploying(null)
  }

  const addProject = (data) => {
    const colors = { 'Node.js':'#10b981','React':'#0ea5e9','Python':'#f59e0b','Go':'#06b6d4','Rust':'#ef4444','Java':'#8b5cf6','PHP':'#7c3aed','Ruby':'#ec4899','TypeScript':'#3b82f6' }
    setProjects(ps => [...ps, {
      id: Date.now(), ...data, status: 'online', health: 100, deploys: 0,
      branch: 'main', lastDeploy: 'agora mesmo', contributors: ['AC'],
      color: colors[data.lang] || '#6b7280',
    }])
    setShowModal(false)
  }

  return (
    <div className="dash-page">
      <div className="dash-head">
        <div>
          <h1 className="dash-title">Projetos</h1>
          <p className="dash-sub">{projects.length} projetos configurados</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Novo Projeto</button>
      </div>

      {/* Filters */}
      <div className="app-card filters-bar">
        <div className="search-bar">
          <span className="search-ico">⌕</span>
          <input type="text" placeholder="Buscar por nome ou linguagem..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {['all','online','building','warning','offline'].map(f => (
            <button key={f} className={`filter-tab${filter === f ? ' on' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">{f === 'all' ? projects.length : projects.filter(p=>p.status===f).length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>🔍</span>
          <p>Nenhum projeto encontrado</p>
        </div>
      ) : (
        <div className="project-cards">
          {filtered.map(p => (
            <div key={p.id} className="project-card">
              <div className="pc-header">
                <div className="pc-name">
                  <span className="pc-dot" style={{ background: p.color }} />
                  <strong>{p.name}</strong>
                  {p.private && <span className="pc-private">🔒</span>}
                </div>
                <span className={`status-chip ${p.status}`}>{STATUS_LABELS[p.status]}</span>
              </div>

              <div className="pc-meta">
                <span className="pc-tag">{p.lang}</span>
                <span className="pc-tag">{p.env}</span>
                <span className="pc-tag">⌥ {p.branch}</span>
              </div>

              <div className="pc-health">
                <div className="health-bar-wrap">
                  <div className="health-bar" style={{ width: `${p.health}%`, background: p.health >= 90 ? '#10b981' : p.health >= 70 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <span style={{ color: p.health >= 90 ? '#10b981' : p.health >= 70 ? '#f59e0b' : '#ef4444', fontSize: 12 }}>{p.health}%</span>
              </div>

              <div className="pc-stats">
                <div className="pc-stat"><strong>{p.deploys}</strong><small>deploys</small></div>
                <div className="pc-stat"><strong>{p.contributors.length}</strong><small>devs</small></div>
                <div className="pc-stat-time">Último deploy: {p.lastDeploy}</div>
              </div>

              <div className="pc-contributors">
                {p.contributors.map((c, i) => (
                  <span key={i} className="pc-av" style={{ background: ['#7c3aed','#0ea5e9','#10b981'][i % 3] }}>{c}</span>
                ))}
              </div>

              <button
                className={deploying === p.id ? 'btn-outline w100' : 'btn-primary w100'}
                onClick={() => deploy(p.id)}
                disabled={deploying === p.id || p.status === 'building'}
              >
                {deploying === p.id ? <><span className="spinner" /> Deploying...</> : '⚡ Deploy agora'}
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} onCreate={addProject} />}
    </div>
  )
}
