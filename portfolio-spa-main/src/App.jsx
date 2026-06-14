import './App.css'
import { Link, Navigate, NavLink, Route, Routes } from 'react-router'
import Dossier from './components/Dossier.jsx'
import HomePage from './components/HomePage.jsx'

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand" to="/">
            <img
              className="brand-logo"
              src="/images/fatou.jpg"
              alt="Photo Fatou Togo"
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <div className="brand-copy">
              <p className="brand-group">DevOps Engineer</p>
              <h1>Fatou Togo</h1>
            </div>
          </Link>

          <nav className="main-nav" aria-label="Navigation principale">
            <NavLink
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
              to="/"
              end
            >
              Accueil
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
              to="/projets"
            >
              Projets
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
              to="/ajouter"
            >
              Ajouter Projet
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/projets" element={<Dossier mode="projets" />} />
          <Route
            path="/projets/:projectId"
            element={<Dossier mode="details" />}
          />
          <Route path="/ajouter" element={<Dossier mode="ajouter" />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
         <p>Portfolio DevOps de Fatou Togo — Kubernetes, CI/CD, Docker, MongoDB.</p>
         <p>Deploye sur Kubernetes avec Jenkins, SonarQube et Prometheus.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
