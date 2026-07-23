import { useNavigate } from 'react-router-dom'
import { useArticleReactions } from '../hooks/useArticleReactions.js'

const REACTIONS = [
  { key: 'love', emoji: '\u2764\uFE0F' },
  { key: 'like', emoji: '\uD83D\uDC4D' },
  { key: 'laugh', emoji: '\uD83D\uDE02' },
  { key: 'sad', emoji: '\uD83D\uDE22' },
]

export default function ReactionBar({ articleId, size = 'default' }) {
  const navigate = useNavigate()
  const { counts, myReaction, react } = useArticleReactions(articleId)

  const handleClick = async (reaction) => {
    const applied = await react(reaction)
    if (!applied) navigate('/account')
  }

  return (
    <div className={`reaction-bar reaction-bar-${size}`} onClick={(e) => e.preventDefault()}>
      {REACTIONS.map((r) => (
        <button
          key={r.key}
          type="button"
          className={`reaction-chip ${myReaction === r.key ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleClick(r.key)
          }}
        >
          <span className="reaction-emoji">{r.emoji}</span>
          <span className="reaction-count">{counts[r.key] || 0}</span>
        </button>
      ))}

      <style>{`
        .reaction-bar { display: flex; flex-wrap: wrap; gap: 6px; }
        .reaction-chip {
          display: inline-flex; align-items: center; gap: 5px;
          border: 1px solid var(--line); background: var(--paper);
          border-radius: 100px; cursor: pointer;
        }
        .reaction-bar-default .reaction-chip { padding: 6px 11px; font-size: 13.5px; }
        .reaction-bar-compact .reaction-chip { padding: 4px 8px; font-size: 12px; }
        .reaction-chip:hover { border-color: var(--sage); }
        .reaction-chip.active { background: var(--sage-pale); border-color: var(--sage); }
        .reaction-count { font-weight: 600; color: var(--ink-soft); }
        .reaction-chip.active .reaction-count { color: var(--sage-dark); }
      `}</style>
    </div>
  )
}
