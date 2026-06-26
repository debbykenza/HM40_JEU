// src/pages/QuizPage.jsx
import React, { useMemo, useState } from 'react';
import { useUser } from '../context/UserContext';

const createIllustration = (icon, accent, label) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="110" viewBox="0 0 180 110">
      <rect width="180" height="110" rx="24" fill="#fff"/>
      <rect x="14" y="14" width="152" height="82" rx="18" fill="${accent}"/>
      <circle cx="56" cy="56" r="24" fill="rgba(255,255,255,0.24)"/>
      <text x="90" y="64" text-anchor="middle" font-size="34">${icon}</text>
      <text x="90" y="96" text-anchor="middle" font-size="13" fill="#334155">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const questions = [
  {
    question: 'Quelle est la capitale de la France ?',
    tip: 'Paris est la capitale de la France et un grand centre culturel.',
    answers: [
      { id: 'A', label: 'Londres', image: createIllustration('🕒', '#fde2e2', 'Londres'), isCorrect: false },
      { id: 'B', label: 'Paris', image: createIllustration('🏰', '#dcfce7', 'Paris'), isCorrect: true },
      { id: 'C', label: 'Rome', image: createIllustration('🏛️', '#f8fafc', 'Rome'), isCorrect: false },
      { id: 'D', label: 'Madrid', image: createIllustration('🌆', '#f8fafc', 'Madrid'), isCorrect: false },
    ],
  },
  {
    question: 'Quel est le plus grand océan du monde ?',
    tip: 'L’océan Pacifique est le plus vaste du globe.',
    answers: [
      { id: 'A', label: 'Atlantique', image: createIllustration('🌊', '#f8fafc', 'Atlantique'), isCorrect: false },
      { id: 'B', label: 'Pacifique', image: createIllustration('🌊', '#dcfce7', 'Pacifique'), isCorrect: true },
      { id: 'C', label: 'Arctique', image: createIllustration('❄️', '#f8fafc', 'Arctique'), isCorrect: false },
      { id: 'D', label: 'Indien', image: createIllustration('🌅', '#f8fafc', 'Indien'), isCorrect: false },
    ],
  },
  {
    question: 'Quelle planète est connue comme la rouge ?',
    tip: 'Mars doit son nom à sa teinte rougeâtre.',
    answers: [
      { id: 'A', label: 'Mars', image: createIllustration('🔴', '#dcfce7', 'Mars'), isCorrect: true },
      { id: 'B', label: 'Vénus', image: createIllustration('🌙', '#f8fafc', 'Vénus'), isCorrect: false },
      { id: 'C', label: 'Mercure', image: createIllustration('☄️', '#f8fafc', 'Mercure'), isCorrect: false },
      { id: 'D', label: 'Jupiter', image: createIllustration('🪐', '#f8fafc', 'Jupiter'), isCorrect: false },
    ],
  },
  {
    question: 'Qui a peint la Joconde ?',
    tip: 'Leonardo da Vinci a créé ce tableau célèbre.',
    answers: [
      { id: 'A', label: 'Da Vinci', image: createIllustration('🎨', '#dcfce7', 'Da Vinci'), isCorrect: true },
      { id: 'B', label: 'Picasso', image: createIllustration('🖼️', '#f8fafc', 'Picasso'), isCorrect: false },
      { id: 'C', label: 'Monet', image: createIllustration('🌿', '#f8fafc', 'Monet'), isCorrect: false },
      { id: 'D', label: 'Van Gogh', image: createIllustration('🌌', '#f8fafc', 'Van Gogh'), isCorrect: false },
    ],
  },
  {
    question: 'Quel instrument a des cordes et un archet ?',
    tip: 'Le violon est joué avec un archet.',
    answers: [
      { id: 'A', label: 'Piano', image: createIllustration('🎹', '#f8fafc', 'Piano'), isCorrect: false },
      { id: 'B', label: 'Violon', image: createIllustration('🎻', '#dcfce7', 'Violon'), isCorrect: true },
      { id: 'C', label: 'Batterie', image: createIllustration('🥁', '#f8fafc', 'Batterie'), isCorrect: false },
      { id: 'D', label: 'Flûte', image: createIllustration('🪈', '#f8fafc', 'Flûte'), isCorrect: false },
    ],
  },
];

function QuizPage({ onBack, onHome, topic }) {
  const { updateStats } = useUser();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const correctAnswerId = useMemo(() => currentQuestion.answers.find((answer) => answer.isCorrect)?.id, [currentQuestion]);
  const successPercent = Math.round((score / totalQuestions) * 100);
  const resultSubtitle = successPercent >= 80 ? 'Excellent ! Tu maîtrises déjà le sujet.' : successPercent >= 60 ? 'Très bon résultat, continue comme ça !' : successPercent >= 40 ? 'Bien joué, encore un peu de pratique.' : 'Tu peux t\'améliorer, réessaye !';
  const stars = successPercent >= 70 ? '⭐⭐⭐' : successPercent >= 40 ? '⭐⭐☆' : '⭐☆☆';

  const handleSelect = (answerId) => {
    if (showFeedback) return;

    setSelectedAnswerId(answerId);
    setShowFeedback(true);

    if (answerId === correctAnswerId) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNext = () => {
    if (!showFeedback) return;

    if (currentIndex === questions.length - 1) {
      if (topic) {
        const topicId = typeof topic === 'string' ? topic : topic.id;
        updateStats(topicId, score, totalQuestions);
      }
      setFinished(true);
      return;
    }

    setCurrentIndex((prevIndex) => prevIndex + 1);
    setSelectedAnswerId(null);
    setShowFeedback(false);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswerId(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
  };

  const progressLabel = finished ? 'Quiz terminé' : `Question ${currentIndex + 1} sur ${questions.length}`;

  return (
    <div className="quiz-page">
      <div className={`quiz-shell ${finished ? 'quiz-shell--finished' : ''}`}>
        {!finished && (
          <>
            <header className="quiz-header">
              <button type="button" className="circle-back-btn quiz-back-btn" onClick={onBack} aria-label="Retour">
                ←
              </button>

              <div className="quiz-score-pill">
                <span>⭐</span>
                <span>{score}/{questions.length}</span>
              </div>
            </header>

            <div className="quiz-progress">
              {questions.map((_, index) => {
                const state = index < currentIndex ? 'filled' : index === currentIndex ? 'active' : 'pending';
                return <div key={index} className={`quiz-progress-segment quiz-progress-segment--${state}`} />;
              })}
            </div>
            <p className="quiz-progress-label">{progressLabel}</p>
          </>
        )}

        {!finished ? (
          <>
            <section className="quiz-card">
              <h1>{currentQuestion.question}</h1>

              <div className="answers-grid">
                {currentQuestion.answers.map((answer) => {
                  const isSelected = selectedAnswerId === answer.id;
                  const isCorrect = answer.id === correctAnswerId;
                  let cardClass = 'answer-card answer-card--neutral';

                  if (showFeedback) {
                    if (isCorrect) {
                      cardClass = 'answer-card answer-card--correct';
                    } else if (isSelected) {
                      cardClass = 'answer-card answer-card--wrong';
                    }
                  } else if (isSelected) {
                    cardClass = 'answer-card answer-card--selected';
                  }

                  return (
                    <button
                      key={answer.id}
                      type="button"
                      className={cardClass}
                      onClick={() => handleSelect(answer.id)}
                      disabled={showFeedback}
                    >
                      <div className="answer-visual">
                        <div className="answer-letter">{answer.id}</div>
                        <span className="answer-state">{showFeedback && isCorrect ? '✓' : showFeedback && isSelected ? '✕' : '•'}</span>
                      </div>
                      <img className="answer-image" src={answer.image} alt={answer.label} />
                      <p>{answer.label}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 🔥 Le tip s'affiche uniquement après avoir répondu (showFeedback) */}
            {showFeedback && (
              <section className="info-card">
                <div className="info-card-icon">💡</div>
                <div>
                  <h2>Le savais-tu ?</h2>
                  <p>{currentQuestion.tip}</p>
                </div>
              </section>
            )}

            <button 
              type="button" 
              className={`quiz-next-btn ${showFeedback ? 'quiz-next-btn--ready' : ''}`} 
              onClick={handleNext} 
              disabled={!showFeedback}
            >
              {currentIndex === questions.length - 1 ? 'Terminer le quiz' : 'Question suivante'}
            </button>
          </>
        ) : (
          <section className="quiz-card quiz-finish-card">
            <div className="quiz-finish-trophy" aria-hidden="true">
              🏆
            </div>
            <h1>Quiz terminé !</h1>
            <p className="quiz-finish-subtitle">{resultSubtitle}</p>

            <div className="quiz-result-box">
              <div className="quiz-score-large">{score}/{totalQuestions}</div>
              <div className="quiz-percent">{successPercent}% de réussite</div>
              <div className="quiz-stars" aria-label={`Évaluation ${stars}`}>
                {stars}
              </div>
            </div>

            <div className="quiz-action-row">
              <button type="button" className="quiz-action-btn quiz-action-btn--primary" onClick={resetQuiz}>
                🔄 Rejouer
              </button>
              <button type="button" className="quiz-action-btn quiz-action-btn--secondary" onClick={onHome}>
                🏠 Accueil
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default QuizPage;