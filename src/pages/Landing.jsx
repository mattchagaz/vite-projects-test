import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function useInView(t = 0.15) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: t })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [t])
  return [ref, vis]
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenu(false)
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <div className="nav-logo"><span className="logo-gem">◈</span> Lumina</div>
        <ul className={`nav-links${menu ? ' open' : ''}`}>
          {[['features','Recursos'],['how-it-works','Como Funciona'],['testimonials','Depoimentos'],['pricing','Preços']].map(([id, l]) => (
            <li key={id}><a onClick={() => go(id)}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-ctas">
          <button className="btn-ghost-sm" onClick={() => navigate('/login')}>Entrar</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>Começar Grátis</button>
        </div>
        <button className="hamburger" onClick={() => setMenu(!menu)} aria-label="Menu">
          <span className={menu ? 'open' : ''} /><span className={menu ? 'open' : ''} /><span className={menu ? 'open' : ''} />
        </button>
      </div>
    </nav>
  )
}

function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()
  useEffect(() => {
    const fn = (e) => setMouse({ x: (e.clientX / window.innerWidth - .5) * 18, y: (e.clientY / window.innerHeight - .5) * 18 })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-grid" /><div className="glow g1" /><div className="glow g2" /><div className="glow g3" />
      </div>
      <div className="hero-content">
        <div className="hero-badge"><span className="badge-pulse" />Novo: Agente de IA autônomo para code review</div>
        <h1 className="hero-title">Desenvolva <span className="grad">10x mais rápido</span><br />com inteligência artificial</h1>
        <p className="hero-sub">Lumina combina automação inteligente, revisão de código com IA e deploy contínuo para transformar como equipes criam software de classe mundial.</p>
        <div className="hero-btns">
          <button className="btn-primary btn-lg" onClick={() => navigate('/register')}>Começar gratuitamente <span className="arrow">→</span></button>
          <button className="btn-outline btn-lg" onClick={() => navigate('/login')}><span className="play-ring">▶</span> Ver demo</button>
        </div>
        <div className="hero-proof">
          <div className="avatars">
            {['#7c3aed','#0ea5e9','#10b981','#f59e0b','#ef4444'].map((c, i) => (
              <span key={i} className="av" style={{ background: c }}>{String.fromCharCode(65 + i)}</span>
            ))}
          </div>
          <span>+12.000 devs já usam a Lumina</span>
        </div>
      </div>
      <div className="hero-visual" style={{ transform: `translate(${mouse.x * .25}px, ${mouse.y * .25}px)` }}>
        <div className="code-card">
          <div className="cc-header">
            <span className="dot r" /><span className="dot y" /><span className="dot g" />
            <span className="cc-title">lumina.config.ts</span>
          </div>
          <pre className="cc-body">{`import { defineConfig } from 'lumina'

export default defineConfig({
  ai: {
    codeReview: true,
    autoFix: true,
    model: 'lumina-pro'
  },
  deploy: {
    auto: true,
    envs: ['staging', 'prod']
  },
  monitoring: {
    realtime: true,
    alerts: true
  }
})`}</pre>
          <div className="cc-footer"><span className="status-dot" /> IA analisando seu código...</div>
        </div>
        <div className="float-card fc1"><span className="fc-icon green">✓</span><div><strong>Deploy realizado</strong><small>há 2 minutos</small></div></div>
        <div className="float-card fc2"><span className="fc-icon purple">✦</span><div><strong>3 melhorias sugeridas</strong><small>pela IA</small></div></div>
        <div className="float-card fc3"><span className="fc-icon blue">⚡</span><div><strong>Pipeline: 45s</strong><small>-62% vs média</small></div></div>
      </div>
    </section>
  )
}

function Stats() {
  const [ref, vis] = useInView()
  const items = [{ v: '10x', l: 'Mais velocidade no deploy' }, { v: '87%', l: 'Redução em bugs de produção' }, { v: '12k+', l: 'Desenvolvedores ativos' }, { v: '99.9%', l: 'Uptime garantido por SLA' }]
  return (
    <section className="stats-section" ref={ref}>
      <div className="container">
        <div className={`stats-grid${vis ? ' vis' : ''}`}>
          {items.map((s, i) => (
            <div key={i} className="stat-item" style={{ animationDelay: `${i * .12}s` }}>
              <div className="stat-val grad">{s.v}</div><div className="stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const [ref, vis] = useInView()
  const cards = [
    { icon: '🤖', title: 'Code Review com IA', desc: 'Nossa IA analisa cada commit, detecta bugs, sugere refatorações e explica o raciocínio de forma clara — como um sênior no seu time.', accent: '#7c3aed' },
    { icon: '⚡', title: 'Deploy Contínuo', desc: 'Configure pipelines completos de CI/CD em segundos. Deploy automático para múltiplos ambientes com rollback inteligente quando necessário.', accent: '#0ea5e9' },
    { icon: '👥', title: 'Colaboração em Tempo Real', desc: 'Edite código com sua equipe simultaneamente. Comentários contextuais diretamente nas linhas, como um Google Docs para desenvolvimento.', accent: '#10b981' },
    { icon: '📊', title: 'Monitoramento Inteligente', desc: 'Dashboards em tempo real, alertas proativos e análise preditiva para identificar gargalos antes que virem problemas em produção.', accent: '#f59e0b' },
    { icon: '🔒', title: 'Segurança Avançada', desc: 'Auditoria automática de segurança, detecção de vulnerabilidades OWASP e conformidade com LGPD integrada ao seu fluxo de PR.', accent: '#ef4444' },
    { icon: '🔌', title: 'Integrações Nativas', desc: 'Conecte com GitHub, GitLab, Jira, Slack, Vercel e mais de 100 ferramentas. API aberta para qualquer integração customizada.', accent: '#8b5cf6' },
  ]
  return (
    <section className="features-section" id="features" ref={ref}>
      <div className="container">
        <header className={`section-header${vis ? ' vis' : ''}`}>
          <span className="tag">Recursos</span>
          <h2>Tudo que sua equipe precisa,<br /><span className="grad">em um só lugar</span></h2>
          <p>Pare de alternar entre dezenas de ferramentas. Lumina integra tudo no seu workflow.</p>
        </header>
        <div className={`feat-grid${vis ? ' vis' : ''}`}>
          {cards.map((c, i) => (
            <div key={i} className="feat-card" style={{ '--accent': c.accent, animationDelay: `${i * .1}s` }}>
              <span className="feat-icon">{c.icon}</span><h3>{c.title}</h3><p>{c.desc}</p><div className="feat-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const [ref, vis] = useInView()
  const steps = [
    { n: '01', icon: '🔗', title: 'Conecte seu repositório', desc: 'Em menos de 60 segundos, conecte seu GitHub, GitLab ou Bitbucket. A Lumina aprende com seu código imediatamente.' },
    { n: '02', icon: '⚙️', title: 'Configure com IA', desc: 'Nossa IA analisa sua stack e configura pipelines de CI/CD, regras de code review e ambientes de deploy. Zero boilerplate.' },
    { n: '03', icon: '🚀', title: 'Desenvolva com superpoderes', desc: 'Cada commit é analisado, cada PR revisado pela IA e cada deploy monitorado em tempo real. Mais rápido com mais confiança.' },
    { n: '04', icon: '📈', title: 'Evolua continuamente', desc: 'A Lumina aprende com seus padrões a cada sprint, melhorando sugestões e se adaptando ao estilo único do seu time.' },
  ]
  return (
    <section className="how-section" id="how-it-works" ref={ref}>
      <div className="container">
        <header className={`section-header${vis ? ' vis' : ''}`}>
          <span className="tag">Como funciona</span>
          <h2>Do zero ao <span className="grad">produção em minutos</span></h2>
          <p>Sem configurações complexas. Sem curva de aprendizado longa. Só você e seu código.</p>
        </header>
        <div className={`steps${vis ? ' vis' : ''}`}>
          <div className="steps-line" />
          {steps.map((s, i) => (
            <div key={i} className="step" style={{ animationDelay: `${i * .15}s` }}>
              <div className="step-num">{s.n}</div>
              <div className="step-body"><span className="step-icon">{s.icon}</span><h3>{s.title}</h3><p>{s.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const [ref, vis] = useInView()
  const [idx, setIdx] = useState(0)
  const list = [
    { name: 'Ana Rodrigues', role: 'CTO · StartupBR', av: 'AR', color: '#7c3aed', text: 'A Lumina transformou completamente nosso processo. Nosso time de 8 devs entrega 3x mais features por sprint, e a qualidade do código nunca foi tão alta.' },
    { name: 'Carlos Mendes', role: 'Lead Dev · FinTech XYZ', av: 'CM', color: '#0ea5e9', text: 'O code review com IA foi um divisor de águas. Antes gastávamos 40% do tempo em reviews manuais. Hoje menos de 10% — bugs em produção caíram 80%.' },
    { name: 'Fernanda Costa', role: 'Engenheira Sênior · E-Plus', av: 'FC', color: '#10b981', text: 'Integração impecável com nossa stack. Em 2 dias estava tudo funcionando. O suporte é excepcional. É a única ferramenta que não abandono.' },
  ]
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % list.length), 5000)
    return () => clearInterval(t)
  }, [])
  const t = list[idx]
  return (
    <section className="testi-section" id="testimonials" ref={ref}>
      <div className="container">
        <header className={`section-header${vis ? ' vis' : ''}`}>
          <span className="tag">Depoimentos</span>
          <h2>Amado por <span className="grad">desenvolvedores</span> ao redor do mundo</h2>
        </header>
        <div className={`testi-wrap${vis ? ' vis' : ''}`}>
          <div className="testi-card" key={idx}>
            <div className="stars">★★★★★</div>
            <blockquote>"{t.text}"</blockquote>
            <div className="testi-author">
              <span className="testi-av" style={{ background: t.color }}>{t.av}</span>
              <div><strong>{t.name}</strong><small>{t.role}</small></div>
            </div>
          </div>
          <div className="testi-dots">
            {list.map((_, i) => <button key={i} className={`tdot${i === idx ? ' on' : ''}`} onClick={() => setIdx(i)} aria-label={`Depoimento ${i + 1}`} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const [ref, vis] = useInView()
  const [annual, setAnnual] = useState(true)
  const navigate = useNavigate()
  const plans = [
    { name: 'Starter', price: 0, desc: 'Para devs solo e projetos pessoais', features: ['1 projeto ativo','IA básica (100 reviews/mês)','Deploy automático','1 ambiente','Suporte por email'], cta: 'Começar grátis', hi: false },
    { name: 'Pro', price: annual ? 79 : 99, desc: 'Para times que querem velocidade com qualidade', features: ['Projetos ilimitados','IA avançada ilimitada','Multi-ambiente','Colaboração em tempo real','Monitoramento avançado','Integrações premium','Suporte prioritário'], cta: 'Teste grátis por 14 dias', hi: true, badge: 'Mais popular' },
    { name: 'Enterprise', price: null, desc: 'Para grandes equipes com necessidades avançadas', features: ['Tudo do Pro','SSO e SAML','Auditoria completa','SLA 99.9%','Deploy on-premise','Modelo de IA privado','Suporte 24/7 dedicado'], cta: 'Falar com vendas', hi: false },
  ]
  return (
    <section className="pricing-section" id="pricing" ref={ref}>
      <div className="container">
        <header className={`section-header${vis ? ' vis' : ''}`}>
          <span className="tag">Preços</span>
          <h2>Simples, transparente,<br /><span className="grad">sem surpresas</span></h2>
          <div className="toggle-wrap">
            <span className={!annual ? 'on' : ''}>Mensal</span>
            <button className={`toggle${annual ? ' on' : ''}`} onClick={() => setAnnual(!annual)}><span className="thumb" /></button>
            <span className={annual ? 'on' : ''}>Anual <em className="save">-20%</em></span>
          </div>
        </header>
        <div className={`price-grid${vis ? ' vis' : ''}`}>
          {plans.map((p, i) => (
            <div key={i} className={`price-card${p.hi ? ' hi' : ''}`} style={{ animationDelay: `${i * .1}s` }}>
              {p.badge && <span className="plan-badge">{p.badge}</span>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">
                {p.price !== null ? <><sup>R$</sup><strong>{p.price}</strong><sub>/mês</sub></> : <strong className="custom">Customizado</strong>}
              </div>
              <p className="plan-desc">{p.desc}</p>
              <ul className="plan-feats">{p.features.map((f, j) => <li key={j}><span className="ck">✓</span>{f}</li>)}</ul>
              <button className={p.hi ? 'btn-primary w100' : 'btn-outline w100'} onClick={() => navigate('/register')}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [ref, vis] = useInView()
  const [open, setOpen] = useState(null)
  const items = [
    { q: 'Preciso ter experiência com IA para usar a Lumina?', a: 'Não! A Lumina foi criada para ser completamente intuitiva. Você não precisa configurar modelos de IA nem entender de machine learning. Tudo funciona desde o primeiro acesso.' },
    { q: 'A Lumina suporta qualquer linguagem de programação?', a: 'Sim. Suportamos mais de 50 linguagens: JavaScript, TypeScript, Python, Go, Rust, Java, C#, PHP, Ruby e muito mais. Nossos modelos são treinados em código de alta qualidade.' },
    { q: 'Meu código fica salvo nos servidores de vocês?', a: 'Seu código é analisado em memória e nunca armazenado permanentemente. Temos certificação SOC 2 Type II, criptografia end-to-end e cumprimos integralmente a LGPD.' },
    { q: 'Posso cancelar a qualquer momento?', a: 'Sim, sem fidelidade e sem taxa de cancelamento. Você cancela pelo próprio painel e mantém o acesso até o fim do período pago.' },
    { q: 'Como funciona o teste gratuito do plano Pro?', a: '14 dias completos com todas as funcionalidades Pro, sem precisar inserir cartão. Após o período, você escolhe se continua ou volta ao plano gratuito.' },
  ]
  return (
    <section className="faq-section" ref={ref}>
      <div className="container">
        <header className={`section-header${vis ? ' vis' : ''}`}>
          <span className="tag">FAQ</span>
          <h2>Perguntas <span className="grad">frequentes</span></h2>
        </header>
        <div className={`faq-list${vis ? ' vis' : ''}`}>
          {items.map((item, i) => (
            <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>{item.q}<span className="faq-ico">{open === i ? '−' : '+'}</span></button>
              <div className="faq-a"><p>{item.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  const [ref, vis] = useInView()
  const navigate = useNavigate()
  return (
    <section className="cta-section" id="cta" ref={ref}>
      <div className="cta-glow" />
      <div className={`cta-inner${vis ? ' vis' : ''}`}>
        <h2>Pronto para desenvolver<br /><span className="grad">no nível dos melhores?</span></h2>
        <p>Junte-se a mais de 12.000 desenvolvedores que já transformaram seu workflow com a Lumina.</p>
        <button className="btn-primary btn-xl" onClick={() => navigate('/register')}>Começar gratuitamente</button>
        <span className="cta-note">Sem cartão de crédito &nbsp;·&nbsp; Cancele quando quiser</span>
        <div className="cta-trust">
          <span>Confiado por</span>
          <div className="trust-logos">
            {['Nubank','iFood','Totvs','Locaweb','RD Station'].map((n, i) => <span key={i} className="trust-badge">{n}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const navigate = useNavigate()
  const cols = [
    { title: 'Produto', links: ['Recursos','Preços','Changelog','Roadmap'] },
    { title: 'Empresa', links: ['Sobre nós','Blog','Carreiras','Contato'] },
    { title: 'Recursos', links: ['Documentação','API Reference','Status','Comunidade'] },
    { title: 'Legal', links: ['Privacidade','Termos de Uso','Cookies','LGPD'] },
  ]
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor:'pointer' }}><span className="logo-gem">◈</span> Lumina</div>
            <p>Acelerando o desenvolvimento de software com inteligência artificial. Feito para devs, por devs.</p>
            <div className="socials">{['𝕏','in','⌥'].map((s,i)=><a key={i} href="#" aria-label="social">{s}</a>)}</div>
          </div>
          {cols.map((col, i) => (
            <div key={i} className="footer-col">
              <h4>{col.title}</h4>
              <ul>{col.links.map((l,j)=><li key={j}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Lumina. Todos os direitos reservados.</span>
          <span>Feito com ♥ no Brasil</span>
        </div>
      </div>
    </footer>
  )
}

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}
