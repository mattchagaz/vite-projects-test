import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function validate(f) {
  const e = {}
  if (!f.name.trim() || f.name.trim().length < 2) e.name = 'Nome deve ter pelo menos 2 caracteres'
  if (!f.email.trim()) e.email = 'Email é obrigatório'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Email inválido'
  if (!f.password) e.password = 'Senha é obrigatória'
  else if (f.password.length < 8) e.password = 'Mínimo 8 caracteres'
  else if (!/[A-Z]/.test(f.password)) e.password = 'Deve ter pelo menos 1 letra maiúscula'
  else if (!/[0-9]/.test(f.password)) e.password = 'Deve ter pelo menos 1 número'
  if (!f.confirm) e.confirm = 'Confirme a senha'
  else if (f.password !== f.confirm) e.confirm = 'As senhas não coincidem'
  if (!f.terms) e.terms = 'Você precisa aceitar os termos'
  return e
}

function strength(p) {
  let s = 0
  if (p.length >= 8) s++
  if (p.length >= 12) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}

const LEVELS = ['', 'Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte']
const COLORS = ['', '#ef4444', '#f59e0b', '#eab308', '#10b981', '#06b6d4']

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: false })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    if (touched[k]) {
      const e = validate({ ...form, [k]: v })
      setErrors(p => ({ ...p, [k]: e[k] }))
    }
  }

  const blur = (k) => {
    setTouched(p => ({ ...p, [k]: true }))
    const e = validate(form)
    setErrors(p => ({ ...p, [k]: e[k] }))
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const all = { name: true, email: true, password: true, confirm: true, terms: true }
    setTouched(all)
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length) return
    setLoading(true)
    try {
      await register(form)
      navigate('/app/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const lvl = strength(form.password)

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="glow g1" style={{ opacity: .4 }} />
        <div className="glow g2" style={{ opacity: .3 }} />
      </div>

      <div className="auth-card wide">
        <div className="auth-logo" onClick={() => navigate('/')}><span className="logo-gem">◈</span> Lumina</div>
        <h2 className="auth-title">Crie sua conta</h2>
        <p className="auth-sub">14 dias grátis no plano Pro, sem cartão de crédito</p>

        <form className="auth-form" onSubmit={submit} noValidate>
          <div className={`field${errors.name && touched.name ? ' err' : touched.name && !errors.name ? ' ok' : ''}`}>
            <label htmlFor="name">Nome completo</label>
            <div className="input-wrap">
              <input id="name" type="text" placeholder="Seu Nome" value={form.name}
                onChange={e => set('name', e.target.value)} onBlur={() => blur('name')} autoComplete="name" />
              {touched.name && !errors.name && <span className="field-ico ok">✓</span>}
            </div>
            {errors.name && touched.name && <span className="field-err">{errors.name}</span>}
          </div>

          <div className={`field${errors.email && touched.email ? ' err' : touched.email && !errors.email ? ' ok' : ''}`}>
            <label htmlFor="reg-email">Email</label>
            <div className="input-wrap">
              <input id="reg-email" type="email" placeholder="seu@email.com" value={form.email}
                onChange={e => set('email', e.target.value)} onBlur={() => blur('email')} autoComplete="email" />
              {touched.email && !errors.email && <span className="field-ico ok">✓</span>}
            </div>
            {errors.email && touched.email && <span className="field-err">{errors.email}</span>}
          </div>

          <div className={`field${errors.password && touched.password ? ' err' : touched.password && !errors.password ? ' ok' : ''}`}>
            <label htmlFor="reg-password">Senha</label>
            <div className="input-wrap">
              <input id="reg-password" type={showPass ? 'text' : 'password'} placeholder="Mín. 8 chars, 1 maiúscula, 1 número"
                value={form.password} onChange={e => set('password', e.target.value)}
                onBlur={() => blur('password')} autoComplete="new-password" />
              <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)} aria-label="Mostrar senha">
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {form.password && (
              <div className="strength-wrap">
                <div className="strength-bar">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="strength-seg" style={{ background: i <= lvl ? COLORS[lvl] : undefined }} />
                  ))}
                </div>
                <span className="strength-label" style={{ color: COLORS[lvl] }}>{LEVELS[lvl]}</span>
              </div>
            )}
            {errors.password && touched.password && <span className="field-err">{errors.password}</span>}
          </div>

          <div className={`field${errors.confirm && touched.confirm ? ' err' : touched.confirm && !errors.confirm ? ' ok' : ''}`}>
            <label htmlFor="confirm">Confirmar senha</label>
            <div className="input-wrap">
              <input id="confirm" type={showConf ? 'text' : 'password'} placeholder="Repita a senha"
                value={form.confirm} onChange={e => set('confirm', e.target.value)}
                onBlur={() => blur('confirm')} autoComplete="new-password" />
              <button type="button" className="eye-btn" onClick={() => setShowConf(!showConf)} aria-label="Mostrar senha">
                {showConf ? '🙈' : '👁'}
              </button>
            </div>
            {errors.confirm && touched.confirm && <span className="field-err">{errors.confirm}</span>}
          </div>

          <div className={`field-check${errors.terms && touched.terms ? ' err' : ''}`}>
            <label className="checkbox-label">
              <input type="checkbox" checked={form.terms}
                onChange={e => { set('terms', e.target.checked); setTouched(p => ({ ...p, terms: true })) }} />
              <span>Li e aceito os <a className="auth-link" href="#">Termos de Uso</a> e a <a className="auth-link" href="#">Política de Privacidade</a></span>
            </label>
            {errors.terms && touched.terms && <span className="field-err">{errors.terms}</span>}
          </div>

          <button type="submit" className="btn-primary w100 btn-lg auth-submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Criando conta...</> : 'Criar conta gratuita'}
          </button>
        </form>

        <p className="auth-switch">
          Já tem uma conta? <Link to="/login" className="auth-link">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
