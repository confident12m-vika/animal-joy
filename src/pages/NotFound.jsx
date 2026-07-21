import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container not-found-page">
      <span className="emoji">{'\uD83D\uDC3E'}</span>
      <h1>{'404 \u2014 Page not found'}</h1>
      <p>{'This page wandered off. Let\u2019s get you back to the good stuff.'}</p>
      <Link to="/" className="btn btn-primary">
        {'\u2190'} Back to Animal Joy
      </Link>

      <style>{`
        .not-found-page {
          min-height: 55vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 12px;
          padding: 60px 20px;
        }
        .not-found-page .emoji { font-size: 48px; }
        .not-found-page h1 { font-size: clamp(1.5rem, 4vw, 2rem); }
        .not-found-page p { color: var(--ink-soft); margin-bottom: 12px; }
      `}</style>
    </div>
  )
}
