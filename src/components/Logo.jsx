import logoIcon from '../assets/logo-icon.png'

export default function Logo({ size = 'default' }) {
  const iconSize = size === 'large' ? 64 : 48

  return (
    <div className={`logo logo-${size}`}>
      <img src={logoIcon} alt="Urban Soul Vibe" width={iconSize} height={iconSize} />
      <div className="logo-text">
        <span className="logo-name">Animal Joy</span>
        <span className="logo-subtitle">by Urban Soul Vibe</span>
      </div>

      <style>{`
        .logo-${size} {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-${size} img {
          width: ${iconSize}px;
          height: ${iconSize}px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .logo-${size} .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .logo-${size} .logo-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: ${size === 'large' ? '32px' : '25px'};
          letter-spacing: 0.01em;
          color: var(--brand-green);
          line-height: 1;
        }
        .logo-${size} .logo-subtitle {
          font-family: var(--font-body);
          font-weight: 400;
          font-size: ${size === 'large' ? '13px' : '11px'};
          letter-spacing: 0.02em;
          color: var(--ink-soft);
          opacity: 0.75;
          margin-top: 3px;
        }
      `}</style>
    </div>
  )
}
