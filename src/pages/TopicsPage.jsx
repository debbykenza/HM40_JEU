import React from 'react'

const topics = [
  {
    title: 'Géographie',
    subtitle: 'Pays, capitales et continents',
    icon: '🌍',
    color: 'green',
  },
  {
    title: 'Sciences',
    subtitle: 'Physique, chimie, biologie',
    icon: '⚛️',
    color: 'darkgreen',
  },
  {
    title: 'Histoire',
    subtitle: 'Événements historiques',
    icon: '📖',
    color: 'amber',
  },
  {
    title: 'Culture Générale',
    subtitle: 'Un peu de tout !',
    color: 'coral',
    icon: '💡',
  },
  {
    title: 'Arts',
    subtitle: 'Peinture, sculpture, artistes',
    icon: '🎨',
    color: 'red',
  },
  {
    title: 'Musique',
    subtitle: 'Instruments et compositeurs',
    icon: '🎵',
    color: 'emerald',
  },
]

function TopicsPage({ onBack, onSelectTopic }) {
  return (
    <div className="topics-page">
      <div className="topics-shell">
        <div className="topics-header">
          <button type="button" className="circle-back-btn" onClick={onBack} aria-label="Retour">
            ←
          </button>
          <h1>Choisis ton sujet</h1>
        </div>

        <div className="topics-list">
          {topics.map((topic) => (
            <button type="button" className={`topic-card topic-card--${topic.color}`} key={topic.title} onClick={onSelectTopic}>
              <div className="topic-icon-wrap">
                <span className="topic-icon">{topic.icon}</span>
              </div>
              <div className="topic-text">
                <h2>{topic.title}</h2>
                <p>{topic.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopicsPage
