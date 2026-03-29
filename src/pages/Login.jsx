import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function validate(f) {
  const e = {}
  if (!f.email.trim()) e.email = 'Email é obrigatório'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Email inválido'
  if (!f.password) e.password = 'Senha é obrigatória'
  else if (f.password.length < 8) e.password = 'Mínimo 8 caracteres'
  return e
}

export default function Login() {
  const navigate = useNavigate()
  const { login, error, setError } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    setError(null)
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
    const e = validate(form)
    setErrors(e)
    setTouched({ email: true, password: true })
    if (Object.keys(e).length) return
    setLoading(true)
    try {
      await login(form)
      navigate('/app/dashboard')
    } catch {
      // error already set in context
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setForm({ email: 'demo@lumina.dev', password: 'Demo@1234' })
    setErrors({})
    setTouched({})
    setError(null)
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="glow g1" style={{ opacity: .4 }} />
        <div className="glow g2" style={{ opacity: .3 }} />
      </div>

      <div className="auth-card">
        <div className="auth-logo" onClick={() => navigate('/')}><span className="logo-gem">◈</span> Lumina</div>
        <h2 className="auth-title">Bem-vindo de volta</h2>
        <p className="auth-sub">Entre na sua conta para continuar</p>

        <button className="demo-hint" type="button" onClick={fillDemo}>
          <span className="demo-icon">✦</span>
          Preencher com conta demo
        </button>

        <form className="auth-form" onSubmit={submit} noValidate>
          <div className={`field${errors.email && touched.email ? ' err' : touched.email && !errors.email ? ' ok' : ''}`}>
            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                onBlur={() => blur('email')}
                autoComplete="email"
              />
              {touched.email && !errors.email && <span className="field-ico ok">✓</span>}
            </div>
            {errors.email && touched.email && <span className="field-err">{errors.email}</span>}
          </div>

          <div className={`field${errors.password && touched.password ? ' err' : touched.password && !errors.password ? ' ok' : ''}`}>
            <label htmlFor="password">Senha</label>
            <div className="input-wrap">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                onBlur={() => blur('password')}
                autoComplete="current-password"
              />
              <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)} aria-label="Mostrar senha">
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && touched.password && <span className="field-err">{errors.password}</span>}
          </div>

          <div className="auth-row">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked /> Lembrar de mim
            </label>
            <a className="auth-link" href="#">Esqueci a senha</a>
          </div>

          {error && <div className="auth-error"><span>⚠</span>{error}</div>}

          <button type="submit" className="btn-primary w100 btn-lg auth-submit" disabled={loading}>
            {loading
              ? <><span className="spinner" /> Entrando...</>
              : 'Entrar na plataforma'
            }
          </button>
        </form>

        <p className="auth-switch">
          Não tem uma conta? <Link to="/register" className="auth-link">Criar conta grátis</Link>
        </p>
      </div>
    </div>
  )
}
