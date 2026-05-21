import Link from "next/link"

export default function PublicarPage() {
  return (
    <div>
      {/* HERO FOR LANDLORDS */}
      <section className="hero-landlord">
        <div className="hero-landlord-overlay"></div>
        <div className="hero-landlord-content container">
          <span className="hero-badge">
            <i className="fa-solid fa-shield-halved"></i> Plataforma certificada para arrendadores
          </span>
          <h1 className="hero-landlord-title">
            Rentabiliza tu propiedad
            <br />
            <span className="hero-accent">con seguridad y orden.</span>
          </h1>
          <p className="hero-landlord-subtitle">
            Gestiona contratos, verifica inquilinos y controla tus pagos desde un solo lugar. Diseñado para el arrendador moderno.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary btn-large">
              <i className="fa-solid fa-rocket"></i> Comenzar ahora — es gratis
            </Link>
            <button className="btn-ghost btn-large hero-btn-ghost">
              <i className="fa-solid fa-play-circle"></i> Ver cómo funciona
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">4,800</span>
              <span className="stat-label">Propiedades activas</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-num">98%</span>
              <span className="stat-label">Contratos sin conflictos</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-num">12,000</span>
              <span className="stat-label">Inquilinos verificados</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES FOR LANDLORDS */}
      <section className="features section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Funcionalidades clave</span>
            <h2 className="section-title">Todo lo que necesitas para arrendar con confianza</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon-wrap icon-coral">
                <i className="fa-solid fa-id-card-clip"></i>
              </div>
              <h3 className="feature-title">Verificación KYC</h3>
              <p className="feature-desc">
                Validación de identidad biométrica y antecedentes de cada inquilino antes de firmar cualquier contrato.
              </p>
              <button className="feature-link">
                Conocer más <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon-wrap icon-green">
                <i className="fa-solid fa-file-signature"></i>
              </div>
              <h3 className="feature-title">Contratos Legales</h3>
              <p className="feature-desc">
                Generación automática de contratos con validez legal, adaptados a la normativa peruana vigente.
              </p>
              <button className="feature-link">
                Ver contrato demo <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon-wrap icon-amber">
                <i className="fa-solid fa-gauge-high"></i>
              </div>
              <h3 className="feature-title">Dashboard Administrativo</h3>
              <p className="feature-desc">
                Panel centralizado para controlar pagos, estados de ocupación y comunicaciones con inquilinos.
              </p>
              <Link href="/dashboard" className="feature-link">
                Ir al dashboard <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon-wrap icon-purple">
                <i className="fa-solid fa-brain"></i>
              </div>
              <h3 className="feature-title">Matching Inteligente</h3>
              <p className="feature-desc">
                Algoritmo de compatibilidad que conecta tu propiedad con el perfil de inquilino más adecuado.
              </p>
              <button className="feature-link">
                Ver cómo funciona <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="dashboard section" id="dashboard" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Panel de control</span>
            <h2 className="section-title">Tu dashboard de arrendador</h2>
            <p className="section-subtitle">
              Visualiza el estado de tus propiedades, pagos y contratos en tiempo real.
            </p>
          </div>
          <div className="dashboard-layout">
            <div className="dash-panel fade-in">
              <div className="dash-panel-header">
                <h3>
                  <i className="fa-solid fa-traffic-light"></i> Semáforo de Pagos
                </h3>
                <span className="dash-period">Abril 2026</span>
              </div>
              <div className="payment-list">
                <div className="payment-row">
                  <div className="payment-info">
                    <div className="payment-dot green"></div>
                    <div>
                      <span className="payment-name">Depa Miraflores — Piso 4</span>
                      <span className="payment-tenant">Inquilino: Carlos R.</span>
                    </div>
                  </div>
                  <div className="payment-right">
                    <span className="payment-amount">S/ 1,800</span>
                    <span className="payment-status green-text">Pagado</span>
                  </div>
                </div>
                <div className="payment-row">
                  <div className="payment-info">
                    <div className="payment-dot red"></div>
                    <div>
                      <span className="payment-name">Habitación San Isidro — 2B</span>
                      <span className="payment-tenant">Inquilino: María L.</span>
                    </div>
                  </div>
                  <div className="payment-right">
                    <span className="payment-amount">S/ 750</span>
                    <span className="payment-status red-text">Pendiente</span>
                  </div>
                </div>
                <div className="payment-row">
                  <div className="payment-info">
                    <div className="payment-dot green"></div>
                    <div>
                      <span className="payment-name">Casa Surco — Principal</span>
                      <span className="payment-tenant">Inquilino: Familia Torres</span>
                    </div>
                  </div>
                  <div className="payment-right">
                    <span className="payment-amount">S/ 3,200</span>
                    <span className="payment-status green-text">Pagado</span>
                  </div>
                </div>
                <div className="payment-row">
                  <div className="payment-info">
                    <div className="payment-dot amber"></div>
                    <div>
                      <span className="payment-name">Depa Barranco — Vista Mar</span>
                      <span className="payment-tenant">Inquilino: Andrea P.</span>
                    </div>
                  </div>
                  <div className="payment-right">
                    <span className="payment-amount">S/ 2,400</span>
                    <span className="payment-status amber-text">En proceso</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link href="/dashboard" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                  <i className="fa-solid fa-arrow-right"></i> Ver dashboard completo
                </Link>
              </div>
            </div>
            <div className="dash-panel fade-in">
              <div className="dash-panel-header">
                <h3>
                  <i className="fa-solid fa-chart-pie"></i> Ocupación mensual
                </h3>
                <span className="dash-period">Últimos 6 meses</span>
              </div>
              <div className="chart-wrap">
                <div className="bar-chart" id="barChart">
                  <div className="bar-group">
                    <div className="bar" style={{ '--h': '72%' } as React.CSSProperties}>
                      <span className="bar-val">72%</span>
                    </div>
                    <span className="bar-label">Nov</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar" style={{ '--h': '85%' } as React.CSSProperties}>
                      <span className="bar-val">85%</span>
                    </div>
                    <span className="bar-label">Dic</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar" style={{ '--h': '90%' } as React.CSSProperties}>
                      <span className="bar-val">90%</span>
                    </div>
                    <span className="bar-label">Ene</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar" style={{ '--h': '78%' } as React.CSSProperties}>
                      <span className="bar-val">78%</span>
                    </div>
                    <span className="bar-label">Feb</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar" style={{ '--h': '95%' } as React.CSSProperties}>
                      <span className="bar-val">95%</span>
                    </div>
                    <span className="bar-label">Mar</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar active" style={{ '--h': '88%' } as React.CSSProperties}>
                      <span className="bar-val">88%</span>
                    </div>
                    <span className="bar-label">Abr</span>
                  </div>
                </div>
              </div>
              <div className="dash-kpis">
                <div className="kpi">
                  <i className="fa-solid fa-house-circle-check kpi-icon green-icon"></i>
                  <div>
                    <span className="kpi-val">5/6</span>
                    <span className="kpi-label">Ocupadas</span>
                  </div>
                </div>
                <div className="kpi">
                  <i className="fa-solid fa-coins kpi-icon amber-icon"></i>
                  <div>
                    <span className="kpi-val">S/ 8,150</span>
                    <span className="kpi-label">Ingresos mes</span>
                  </div>
                </div>
                <div className="kpi">
                  <i className="fa-solid fa-file-circle-check kpi-icon blue-icon"></i>
                  <div>
                    <span className="kpi-val">6</span>
                    <span className="kpi-label">Contratos activos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO START */}
      <section className="how-it-works section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Proceso simple</span>
            <h2 className="section-title">Comienza en 3 pasos</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card fade-in">
              <div className="step-number">1</div>
              <div className="step-icon">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <h3 className="step-title">Regístrate gratis</h3>
              <p className="step-desc">
                Crea tu cuenta de arrendador en menos de 2 minutos. Sin costos iniciales.
              </p>
            </div>

            <div className="step-card fade-in">
              <div className="step-number">2</div>
              <div className="step-icon">
                <i className="fa-solid fa-home"></i>
              </div>
              <h3 className="step-title">Publica tu propiedad</h3>
              <p className="step-desc">
                Agrega fotos, descripción y detalles. Nuestro equipo verificará tu propiedad.
              </p>
            </div>

            <div className="step-card fade-in">
              <div className="step-number">3</div>
              <div className="step-icon">
                <i className="fa-solid fa-handshake"></i>
              </div>
              <h3 className="step-title">Recibe solicitudes</h3>
              <p className="step-desc">
                Inquilinos verificados contactarán contigo. Tú decides con quién firmar.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/register" className="btn-primary btn-large">
              <i className="fa-solid fa-rocket"></i> Comenzar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Testimonios</span>
            <h2 className="section-title">Lo que dicen nuestros arrendadores</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="testimonial-rating">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="feature-desc" style={{ marginBottom: '16px' }}>
                "Antes perdía mucho tiempo verificando inquilinos. Ahora Habita Perú lo hace por mí y me siento mucho más seguro."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-user" style={{ color: 'var(--accent)' }}></i>
                </div>
                <div>
                  <strong style={{ fontSize: '0.875rem' }}>Juan Díaz</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>6 propiedades en Lima</p>
                </div>
              </div>
            </div>
            <div className="feature-card fade-in">
              <div className="testimonial-rating">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="feature-desc" style={{ marginBottom: '16px' }}>
                "El dashboard me permite ver todo en tiempo real. Los pagos llegan puntual y sin complicaciones."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-user" style={{ color: 'var(--accent)' }}></i>
                </div>
                <div>
                  <strong style={{ fontSize: '0.875rem' }}>Rosa Vargas</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3 propiedades en San Isidro</p>
                </div>
              </div>
            </div>
            <div className="feature-card fade-in">
              <div className="testimonial-rating">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="feature-desc" style={{ marginBottom: '16px' }}>
                "Los contratos digitales son un cambio total. Todo es más rápido y profesional."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-user" style={{ color: 'var(--accent)' }}></i>
                </div>
                <div>
                  <strong style={{ fontSize: '0.875rem' }}>Carlos Mendoza</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 propiedades en Miraflores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <h2>¿Listo para arrendar con total control?</h2>
              <p>Únete a más de 4,800 arrendadores que ya gestionan sus propiedades con Habita Perú.</p>
            </div>
            <Link href="/register" className="btn-primary btn-large">
              <i className="fa-solid fa-rocket"></i> Comenzar ahora — es gratis
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
