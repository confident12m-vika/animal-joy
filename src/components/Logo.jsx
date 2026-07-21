import logoIcon from '../assets/logo-icon.png'

export default function Logo({ size = 'default' }) {
  const iconSize = size === 'large' ? 64 : 48

  return (
    <div className={`logo logo-${size}`}>
      <img src={logoIcon} alt="Urban Soul Vibe" width={iconSize} height={iconSize} />
      <span className="logo-name">Animal Joy</span>

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
        .logo-${size} .logo-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: ${size === 'large' ? '32px' : '25px'};
          letter-spacing: 0.01em;
          color: var(--brand-green);
          line-height: 1;
        }
      `}</style>
    </div>
  )
}
