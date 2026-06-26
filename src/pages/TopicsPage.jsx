import React from 'react'
import './TopicsPage.css'

const topics = [
  {
    id: 'geographie',
    title: 'Géographie',
    subtitle: 'Pays, capitales et continents',
    icon: '🌍',
    color: 'green',
  },
  {
    id: 'sciences',
    title: 'Sciences',
    subtitle: 'Physique, chimie, biologie',
    icon: '⚛️',
    color: 'blue',
  },
  {
    id: 'histoire',
    title: 'Histoire',
    subtitle: 'Événements historiques',
    icon: '📖',
    color: 'amber',
  },
  {
    id: 'culture-generale',
    title: 'Culture Générale',
    subtitle: 'Un peu de tout !',
    icon: '💡',
    color: 'coral',
  },
  {
    id: 'arts',
    title: 'Arts',
    subtitle: 'Peinture, sculpture, artistes',
    icon: '🎨',
    color: 'red',
  },
  {
    id: 'musique',
    title: 'Musique',
    subtitle: 'Instruments et compositeurs',
    icon: '🎵',
    color: 'purple',
  },
]

function TopicsPage({ onBack, onSelectTopic }) {
  return (
    <div className="topics-page">
      <div className="topics-shell">
        <header className="topics-nav">
          <button type="button" className="circle-back-btn" onClick={onBack} aria-label="Retour">
            <svg viewBox="0 0 24 24" fill="none" className="back-icon" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="topics-title">Choisis ton sujet</h1>
        </header>

        <ul className="topics-list" role="list">
          {topics.map((topic) => (
            <li key={topic.id}>
              <button
                type="button"
                className={`topic-card topic-card--${topic.color}`}
                onClick={() => onSelectTopic?.(topic)}
              >
                <span className="topic-icon-wrap" aria-hidden="true">
                  <span className="topic-icon">{topic.icon}</span>
                </span>
                <span className="topic-text">
                  <span className="topic-title">{topic.title}</span>
                  <span className="topic-subtitle">{topic.subtitle}</span>
                </span>
                <svg viewBox="0 0 24 24" fill="none" className="topic-chevron" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TopicsPage
