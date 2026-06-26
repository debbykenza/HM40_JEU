import React, { useMemo, useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getQuestions } from '../data/quizData';

function QuizPage({ onBack, onHome, topic, game, level }) {
  const { updateStats, completeLevel } = useUser();

  const topicId   = typeof topic === 'string' ? topic : topic?.id;
  const gameType  = typeof game  === 'string' ? game  : game?.name;
  const questions = getQuestions(gameType, topicId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [levelUnlocked, setLevelUnlocked] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedAnswerId(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    setLevelUnlocked(false);
  }, [topicId, gameType]);

  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-shell">
          <h1>Aucune question disponible pour ce thème</h1>
          <button type="button" className="quiz-action-btn quiz-action-btn--secondary" onClick={onBack}>
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const correctAnswerId = useMemo(
    () => currentQuestion?.answers.find((a) => a.isCorrect)?.id,
    [currentQuestion]
  );
  const successPercent  = Math.round((score / totalQuestions) * 100);
  const resultSubtitle  = successPercent >= 80 ? 'Excellent ! Tu maîtrises déjà le sujet.'
    : successPercent >= 60 ? 'Très bon résultat, continue comme ça !'
    : successPercent >= 40 ? 'Bien joué, encore un peu de pratique.'
    : 'Tu peux t\'améliorer, réessaye !';
  const stars = successPercent >= 70 ? '⭐⭐⭐' : successPercent >= 40 ? '⭐⭐☆' : '⭐☆☆';

  const handleSelect = (answerId) => {
    if (showFeedback) return;
    setSelectedAnswerId(answerId);
    setShowFeedback(true);
    if (answerId === correctAnswerId) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (!showFeedback) return;

    if (currentIndex === questions.length - 1) {
      // Sauvegarde des stats (local-first)
      if (topicId) updateStats(topicId, score, totalQuestions);

      // Déblocage du niveau suivant si ≥ 70%
      if (successPercent >= 70 && gameType && topicId && level !== undefined) {
        completeLevel(gameType, topicId, level);
        if (level < 4) setLevelUnlocked(true);
      }

      setFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswerId(null);
    setShowFeedback(false);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswerId(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    setLevelUnlocked(false);
  };

  const progressLabel = `Question ${currentIndex + 1} sur ${questions.length}`;

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
                  const isCorrect  = answer.id === correctAnswerId;
                  let cardClass = 'answer-card answer-card--neutral';

                  if (showFeedback) {
                    if (isCorrect)       cardClass = 'answer-card answer-card--correct';
                    else if (isSelected) cardClass = 'answer-card answer-card--wrong';
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
                        <span className="answer-state">
                          {showFeedback && isCorrect ? '✓' : showFeedback && isSelected ? '✕' : '•'}
                        </span>
                      </div>
                      <img className="answer-image" src={answer.image} alt={answer.label} />
                      <p>{answer.label}</p>
                    </button>
                  );
                })}
              </div>
            </section>

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
            <div className="quiz-finish-trophy" aria-hidden="true">🏆</div>
            <h1>Quiz terminé !</h1>
            <p className="quiz-finish-subtitle">{resultSubtitle}</p>

            <div className="quiz-result-box">
              <div className="quiz-score-large">{score}/{totalQuestions}</div>
              <div className="quiz-percent">{successPercent}% de réussite</div>
              <div className="quiz-stars" aria-label={`Évaluation ${stars}`}>{stars}</div>
            </div>

            {levelUnlocked && (
              <div className="quiz-unlock-banner">
                Niveau suivant débloqué !
              </div>
            )}

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
