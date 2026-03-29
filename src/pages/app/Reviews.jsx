import { useState } from 'react'
import '../../App.css'

const REVIEWS = [
  {
    id: 1, pr: 'PR #52', title: 'feat: add payment gateway integration', author: 'Carlos Mendes', avatar: 'CM', color: '#0ea5e9',
    repo: 'ecommerce-api', branch: 'feature/payment', base: 'main', files: 14, additions: 342, deletions: 28,
    status: 'needs_review', time: '23 min atrás',
    aiScore: 78,
    aiFindings: [
      { type: 'bug', severity: 'high', line: 48, file: 'src/payments/stripe.js', msg: 'Possível vazamento de chave API — `process.env.STRIPE_KEY` exposto em log de erro.' },
      { type: 'security', severity: 'high', line: 103, file: 'src/payments/webhook.js', msg: 'Webhook não valida assinatura HMAC da Stripe, abrindo risco de spoofing.' },
      { type: 'perf', severity: 'medium', line: 67, file: 'src/payments/stripe.js', msg: 'Requisição síncrona bloqueante dentro de loop. Considere `Promise.all` para chamadas paralelas.' },
    ],
  },
  {
    id: 2, pr: 'PR #48', title: 'refactor: migrate auth to JWT RS256', author: 'Ana Rodrigues', avatar: 'AR', color: '#7c3aed',
    repo: 'user-service', branch: 'refactor/jwt', base: 'main', files: 7, additions: 198, deletions: 211,
    status: 'approved', time: '1h atrás',
    aiScore: 96,
    aiFindings: [
      { type: 'suggestion', severity: 'low', line: 22, file: 'src/auth/jwt.js', msg: 'Considere adicionar `audience` e `issuer` ao payload para validação mais restrita.' },
    ],
  },
  {
    id: 3, pr: 'PR #51', title: 'fix: memory leak in websocket handler', author: 'Fernanda Costa', avatar: 'FC', color: '#10b981',
    repo: 'mobile-app', branch: 'fix/ws-leak', base: 'develop', files: 3, additions: 45, deletions: 12,
    status: 'changes_requested', time: '2h atrás',
    aiScore: 85,
    aiFindings: [
      { type: 'bug', severity: 'medium', line: 34, file: 'src/ws/handler.ts', msg: 'EventListener adicionado no `useEffect` sem cleanup no return. Isso causa o memory leak descrito.' },
      { type: 'suggestion', severity: 'low', line: 58, file: 'src/ws/handler.ts', msg: 'Use `useCallback` para estabilizar a referência do handler e evitar re-registros desnecessários.' },
    ],
  },
  {
    id: 4, pr: 'PR #49', title: 'chore: update dependencies to latest', author: 'Carlos Mendes', avatar: 'CM', color: '#0ea5e9',
    repo: 'dashboard-v2', branch: 'chore/deps', base: 'main', files: 2, additions: 89, deletions: 91,
    status: 'needs_review', time: '4h atrás',
    aiScore: 92,
    aiFindings: [],
  },
]

const SEV_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#6b7280' }
const SEV_BG    = { high: 'rgba(239,68,68,.1)', medium: 'rgba(245,158,11,.1)', low: 'rgba(107,114,128,.1)' }
const TYPE_ICON = { bug: '🐛', security: '🔒', perf: '⚡', suggestion: '💡' }

const STATUS_LABEL = {
  needs_review:      { label: 'Aguardando review', color: '#f59e0b', bg: 'rgba(245,158,11,.12)' },
  approved:          { label: '✓ Aprovado', color: '#10b981', bg: 'rgba(16,185,129,.12)' },
  changes_requested: { label: '⟳ Alterações solicitadas', color: '#ef4444', bg: 'rgba(239,68,68,.12)' },
}

function ScoreRing({ score }) {
  const r = 28, c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  const color = score >= 90 ? '#10b981' : score >= 75 ? '#f59e0b' : '#ef4444'
  return (
    <div className="score-ring">
      <svg width="72" height="72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 36 36)" />
      </svg>
      <span style={{ color }}>{score}</span>
    </div>
  )
}

export default function Reviews() {
  const [selected, setSelected] = useState(REVIEWS[0])
  const [filter, setFilter] = useState('all')
  const [approving, setApproving] = useState(false)

  const approve = async () => {
    setApproving(true)
    await new Promise(r => setTimeout(r, 800))
    setSelected(s => ({ ...s, status: 'approved' }))
    setApproving(false)
  }

  const visible = filter === 'all' ? REVIEWS : REVIEWS.filter(r => r.status === filter)

  return (
    <div className="dash-page reviews-layout">
      {/* Left panel */}
      <div>
        <div className="dash-head" style={{ marginBottom: 20 }}>
          <div>
            <h1 className="dash-title">Code Review</h1>
            <p className="dash-sub">IA analisou {REVIEWS.length} pull requests</p>
          </div>
        </div>
        <div className="filter-tabs" style={{ marginBottom: 16 }}>
          {['all','needs_review','approved','changes_requested'].map(f => (
            <button key={f} className={`filter-tab${filter === f ? ' on' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Todos' : STATUS_LABEL[f].label}
            </button>
          ))}
        </div>

        <div className="review-list">
          {visible.map(r => {
            const s = STATUS_LABEL[r.status]
            return (
              <div key={r.id} className={`review-item${selected?.id === r.id ? ' active' : ''}`} onClick={() => setSelected(r)}>
                <div className="ri-top">
                  <span className="ri-pr">{r.pr}</span>
                  <span className="ri-status" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                </div>
                <div className="ri-title">{r.title}</div>
                <div className="ri-meta">
                  <span className="ri-av" style={{ background: r.color }}>{r.avatar}</span>
                  <span>{r.author}</span>
                  <span className="ri-dot">·</span>
                  <span>{r.repo}</span>
                  <span className="ri-dot">·</span>
                  <span>{r.time}</span>
                </div>
                {r.aiFindings.length > 0 && (
                  <div className="ri-findings">
                    {r.aiFindings.filter(f => f.severity === 'high').length > 0 && (
                      <span className="finding-badge high">⚠ {r.aiFindings.filter(f=>f.severity==='high').length} crítico</span>
                    )}
                    {r.aiFindings.filter(f => f.severity === 'medium').length > 0 && (
                      <span className="finding-badge medium">● {r.aiFindings.filter(f=>f.severity==='medium').length} médio</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Right panel — detail */}
      {selected && (() => {
        const s = STATUS_LABEL[selected.status]
        return (
          <div className="review-detail">
            <div className="rd-header">
              <div>
                <div className="rd-pr-title">
                  <span className="ri-pr">{selected.pr}</span>
                  <span className="ri-status" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                </div>
                <h2 className="rd-title">{selected.title}</h2>
                <div className="ri-meta">
                  <span className="ri-av" style={{ background: selected.color }}>{selected.avatar}</span>
                  <span>{selected.author}</span>
                  <span className="ri-dot">·</span>
                  <span>{selected.repo}</span>
                  <span className="ri-dot">·</span>
                  <code>{selected.branch} → {selected.base}</code>
                  <span className="ri-dot">·</span>
                  <span>{selected.time}</span>
                </div>
              </div>
            </div>

            <div className="rd-stats-row">
              <div className="rd-stat"><strong>{selected.files}</strong><small>arquivos</small></div>
              <div className="rd-stat green"><strong>+{selected.additions}</strong><small>adições</small></div>
              <div className="rd-stat red"><strong>-{selected.deletions}</strong><small>remoções</small></div>
              <div className="rd-stat-score">
                <ScoreRing score={selected.aiScore} />
                <div><strong>Score IA</strong><small>Qualidade do código</small></div>
              </div>
            </div>

            <div className="ai-panel">
              <div className="ai-panel-header">
                <span className="ai-badge">✦ Lumina AI</span>
                <span className="ai-sub">{selected.aiFindings.length === 0 ? 'Nenhum problema encontrado 🎉' : `${selected.aiFindings.length} ocorrência${selected.aiFindings.length > 1 ? 's' : ''} encontrada${selected.aiFindings.length > 1 ? 's' : ''}`}</span>
              </div>

              {selected.aiFindings.length === 0 ? (
                <div className="ai-clean">
                  <span>✅</span>
                  <p>Código aprovado pela IA. Nenhum bug, vulnerabilidade ou problema de performance detectado. Excelente trabalho!</p>
                </div>
              ) : (
                <div className="ai-findings">
                  {selected.aiFindings.map((f, i) => (
                    <div key={i} className="ai-finding" style={{ borderLeftColor: SEV_COLOR[f.severity] }}>
                      <div className="af-top">
                        <span className="af-icon">{TYPE_ICON[f.type]}</span>
                        <span className="af-sev" style={{ color: SEV_COLOR[f.severity], background: SEV_BG[f.severity] }}>{f.severity}</span>
                        <code className="af-loc">{f.file}:{f.line}</code>
                      </div>
                      <p className="af-msg">{f.msg}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rd-actions">
              <button className="btn-outline">💬 Comentar</button>
              <button className="btn-outline" style={{ borderColor: 'rgba(239,68,68,.4)', color: '#ef4444' }}>
                ✕ Solicitar alterações
              </button>
              <button
                className="btn-primary"
                onClick={approve}
                disabled={approving || selected.status === 'approved'}
              >
                {approving ? <><span className="spinner" /> Aprovando...</> : selected.status === 'approved' ? '✓ Aprovado' : '✓ Aprovar PR'}
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
