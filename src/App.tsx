import { useMemo, useState } from 'react'

type MiniGame = {
  id: string
  title: string
  description: string
  badge: string
  icon: string
  color: string
}

type Level = {
  id: string
  title: string
  emojis: string[]
  answer: string
  clue: string
}

const miniGames: MiniGame[] = [
  {
    id: 'mot-en-images',
    title: 'Mot en images',
    description: 'Observe les indices et devine le mot secret.',
    badge: '⭐ Jeu principal',
    icon: '🧠',
    color: '#7c3aed',
  },
  {
    id: 'quiz-culture',
    title: 'Quiz de culture',
    description: 'Réponds à des questions pour apprendre chaque jour.',
    badge: '🌍 À découvrir',
    icon: '📚',
    color: '#0f766e',
  },
  {
    id: 'objet-cache',
    title: 'Objet caché',
    description: 'Repère l’objet et enrichis ton vocabulaire.',
    badge: '🔎 Défi',
    icon: '🗺️',
    color: '#b45309',
  },
  {
    id: 'mystere-monde',
    title: 'Mystère du monde',
    description: 'Découvre des curiosités fascinantes du monde.',
    badge: '✨ Surprise',
    icon: '🌈',
    color: '#be185d',
  },
]

const levels: Level[] = [
  {
    id: 'mer',
    title: 'Niveau 1',
    emojis: ['🌊', '🐠', '🏖️', '☀️'],
    answer: 'plage',
    clue: 'C’est un endroit où l’on va pour se baigner et jouer.',
  },
  {
    id: 'science',
    title: 'Niveau 2',
    emojis: ['🔬', '🧪', '🧫', '🌡️'],
    answer: 'laboratoire',
    clue: 'On y fait des expériences scientifiques.',
  },
  {
    id: 'planet',
    title: 'Niveau 3',
    emojis: ['🪐', '☄️', '⭐', '🌌'],
    answer: 'espace',
    clue: 'C’est le grand vide au-dessus de la Terre.',
  },
]

function App() {
  const [selectedGame, setSelectedGame] = useState<string>('mot-en-images')
  const [currentLevel, setCurrentLevel] = useState(0)
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState('Observe bien les indices et trouve le mot secret !')
  const [score, setScore] = useState(0)
  const [solvedLevels, setSolvedLevels] = useState<number[]>([])

  const activeGame = useMemo(() => miniGames.find((game) => game.id === selectedGame), [selectedGame])
  const current = levels[currentLevel]
  const isSolved = solvedLevels.includes(currentLevel)

  const handleCheck = () => {
    const normalizedGuess = guess.trim().toLowerCase()

    if (!normalizedGuess) {
      setFeedback('Écris un mot pour essayer !')
      return
    }

    if (normalizedGuess === current.answer) {
      setFeedback(`Bravo ! Tu as trouvé ${current.answer}.`)
      setScore((value) => value + 1)
      setSolvedLevels((value) => (value.includes(currentLevel) ? value : [...value, currentLevel]))
      return
    }

    setFeedback('Pas encore… Relis les indices et essaie une autre réponse.')
  }

  const handleNext = () => {
    setCurrentLevel((value) => (value + 1) % levels.length)
    setGuess('')
    setFeedback('Un nouveau défi t’attend !')
  }

  const handleHint = () => {
    setFeedback(`Indice : ${current.clue}`)
  }

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Application éducative pour enfants</p>
          <h1>Mini-jeux de culture générale</h1>
          <p className="hero-copy">
            Un espace coloré et simple pour apprendre en s’amusant, avec des jeux adaptés à des enfants de 10 à 12 ans.
          </p>
          <div className="hero-actions">
            <span className="pill">🎮 4 mini-jeux</span>
            <span className="pill">⭐ Score : {score}</span>
          </div>
        </div>
      </header>

      <main className="content-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>Choisis un mini-jeu</h2>
            <p>Chaque jeu aide à développer la culture générale.</p>
          </div>

          <div className="game-list">
            {miniGames.map((game) => (
              <button
                key={game.id}
                type="button"
                className={`game-card ${selectedGame === game.id ? 'active' : ''}`}
                onClick={() => setSelectedGame(game.id)}
              >
                <div className="game-card-top">
                  <span className="game-icon">{game.icon}</span>
                  <span className="game-badge">{game.badge}</span>
                </div>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="panel play-panel">
          <div className="panel-header">
            <h2>{activeGame?.title ?? 'Jeu principal'}</h2>
            <p>{activeGame?.description ?? 'Clique sur un jeu pour commencer.'}</p>
          </div>

          <div className="progress-row">
            <div className="progress-track" aria-label="Progression du jeu">
              <div className="progress-fill" style={{ width: `${(solvedLevels.length / levels.length) * 100}%` }} />
            </div>
            <span>{solvedLevels.length}/{levels.length} réussis</span>
          </div>

          <div className="game-zone">
            <div className="level-label">{current.title}</div>
            <div className="image-grid">
              {current.emojis.map((emoji, index) => (
                <div className="image-card" key={`${emoji}-${index}`}>
                  <span>{emoji}</span>
                </div>
              ))}
            </div>

            <label className="input-label" htmlFor="answer">
              Quel est le mot secret ?
            </label>
            <input
              id="answer"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              placeholder="Écris ton mot ici"
            />

            <div className="button-row">
              <button type="button" onClick={handleCheck} className="primary-btn">
                Vérifier
              </button>
              <button type="button" onClick={handleHint} className="secondary-btn">
                Indice
              </button>
              <button type="button" onClick={handleNext} className="secondary-btn">
                Niveau suivant
              </button>
            </div>

            <div className={`feedback-box ${isSolved ? 'success' : ''}`}>
              <strong>{isSolved ? '✅ Bien joué !' : '💡 À toi de jouer'}</strong>
              <p>{feedback}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
