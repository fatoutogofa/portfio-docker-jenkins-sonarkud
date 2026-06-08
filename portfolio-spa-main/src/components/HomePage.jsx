import { Link } from 'react-router'

function HomePage() {
  return (
    <section className="home-stack">
      <section className="hero-banner panel">
        <div className="hero-copy">
          <p className="section-label">Accueil</p>
          <h2>Portfolio de Fatou Togo</h2>
          <p className="hero-text">
            Etudiante en DevOps, passionnee par Kubernetes, CI/CD et le cloud.
            Ce portfolio presente mes projets realises avec Docker, Jenkins et MongoDB.
          </p>

          <div className="hero-metrics">
            <div className="metric-card">
              <strong>6</strong>
              <span>projets de demonstration</span>
            </div>
            <div className="metric-card">
              <strong>4</strong>
              <span>composants principaux</span>
            </div>
            <div className="metric-card">
              <strong>1</strong>
              <span>API REST avec MongoDB</span>
            </div>
          </div>

          <div className="helper-actions">
            <Link className="button" to="/projets">
              Voir les projets
            </Link>
            <Link className="button-secondary" to="/ajouter">
              Ajouter un projet
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <img
            className="hero-image"
            src="/images/fatou.jpg"
            alt="Photo de Fatou Togo"
            style={{ borderRadius: '50%', objectFit: 'cover', width: '300px', height: '300px' }}
          />
        </div>
      </section>

      <section className="panel gallery-panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Apercu visuel</p>
            <h3>Les illustrations du portfolio</h3>
          </div>
        </div>

        <div className="reference-gallery">
          <img src="/images/projet1.jpg" alt="Apercu projet 1" />
          <img src="/images/projet2.jpg" alt="Apercu projet 2" />
          <img src="/images/Projet3.jpg" alt="Apercu projet 3" />
          <img src="/images/projet4.jpg" alt="Apercu projet 4" />
          <img src="/images/projet5.png" alt="Apercu projet 5" />
          <img src="/images/projet1.jpg" alt="Apercu projet 6" />
        </div>
      </section>
    </section>
  )
}

export default HomePage
