import { useEffect, useState } from "react";
import "./App.css";

const flashcards = [
  {
    question: "What is HTML?",
    answer:
      "HTML stands for HyperText Markup Language. It is used to structure content on web pages.",
    options: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language",
    ],
    correct: 0,
  },
  {
    question: "What does CSS stand for?",
    answer:
      "CSS stands for Cascading Style Sheets. It is used to style web pages.",
    options: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets",
    ],
    correct: 1,
  },
  {
    question: "What is JavaScript?",
    answer:
      "JavaScript is a programming language used to make web pages interactive.",
    options: [
      "A database",
      "A programming language",
      "An operating system",
      "A web browser",
    ],
    correct: 1,
  },
  {
    question: "What is React?",
    answer:
      "React is a JavaScript library for building user interfaces.",
    options: [
      "A database",
      "A programming language",
      "A JavaScript library",
      "A web server",
    ],
    correct: 2,
  },
  {
    question: "What is Vite?",
    answer:
      "Vite is a modern frontend build tool used for developing web applications.",
    options: [
      "A frontend build tool",
      "A database",
      "An operating system",
      "A programming language",
    ],
    correct: 0,
  },
];

const TIMER_SECONDS = 20;

/* ================= SHUFFLE ================= */

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function shuffleOptions(question) {
  return question.options
    .map((option, index) => ({
      option: option,
      originalIndex: index,
    }))
    .sort(() => Math.random() - 0.5);
}

/* ================= APP ================= */

function App() {
  const [questions, setQuestions] = useState(flashcards);

  const [currentCard, setCurrentCard] = useState(0);

  const [shuffledOptions, setShuffledOptions] = useState(
    shuffleOptions(flashcards[0])
  );

  const [showAnswer, setShowAnswer] = useState(false);

  const [score, setScore] = useState(0);

  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem("flashcardBestScore")) || 0
  );

  const [quizStarted, setQuizStarted] = useState(false);

  const [quizFinished, setQuizFinished] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("flashcardDarkMode") === "true"
  );

  const card = questions[currentCard];

  /* ================= DARK MODE ================= */

  useEffect(() => {
    localStorage.setItem("flashcardDarkMode", darkMode);
  }, [darkMode]);

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!quizStarted || quizFinished || selectedAnswer !== null) {
      return;
    }

    if (timeLeft === 0) {
      if (currentCard < questions.length - 1) {
        const nextIndex = currentCard + 1;

        setCurrentCard(nextIndex);
        setShuffledOptions(
          shuffleOptions(questions[nextIndex])
        );
        setShowAnswer(false);
        setSelectedAnswer(null);
        setTimeLeft(TIMER_SECONDS);
      } else {
        setQuizFinished(true);
        setQuizStarted(false);
      }

      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previousTime) => previousTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    quizStarted,
    quizFinished,
    selectedAnswer,
    timeLeft,
    currentCard,
    questions,
  ]);

  /* ================= START QUIZ ================= */

  const startQuiz = () => {
    const shuffledQuestions = shuffleArray(flashcards);

    setQuestions(shuffledQuestions);
    setCurrentCard(0);

    setShuffledOptions(
      shuffleOptions(shuffledQuestions[0])
    );

    setScore(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
    setTimeLeft(TIMER_SECONDS);

    setQuizStarted(true);
    setQuizFinished(false);
  };

  /* ================= SELECT ANSWER ================= */

  const selectAnswer = (index) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    if (index === card.correct) {
      const newScore = score + 1;

      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);

        localStorage.setItem(
          "flashcardBestScore",
          newScore
        );
      }
    }
  };

  /* ================= NEXT ================= */

  const nextCard = () => {
    if (currentCard < questions.length - 1) {
      const nextIndex = currentCard + 1;

      setCurrentCard(nextIndex);

      setShuffledOptions(
        shuffleOptions(questions[nextIndex])
      );

      setShowAnswer(false);
      setSelectedAnswer(null);
      setTimeLeft(TIMER_SECONDS);
    } else {
      setQuizFinished(true);
      setQuizStarted(false);
    }
  };

  /* ================= PREVIOUS ================= */

  const previousCard = () => {
    if (currentCard > 0) {
      const previousIndex = currentCard - 1;

      setCurrentCard(previousIndex);

      setShuffledOptions(
        shuffleOptions(questions[previousIndex])
      );

      setShowAnswer(false);
      setSelectedAnswer(null);
      setTimeLeft(TIMER_SECONDS);
    }
  };

  /* ================= RESTART ================= */

  const restartQuiz = () => {
    startQuiz();
  };

  /* ================= BACK ================= */

  const backToFlashcards = () => {
    setQuestions(flashcards);
    setCurrentCard(0);

    setShuffledOptions(
      shuffleOptions(flashcards[0])
    );

    setScore(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setTimeLeft(TIMER_SECONDS);

    setQuizStarted(false);
    setQuizFinished(false);
  };

  /* ================= CALCULATIONS ================= */

  const progress =
    ((currentCard + 1) / questions.length) * 100;

  const percentage = Math.round(
    (score / questions.length) * 100
  );

  /* ================= UI ================= */

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>

      {/* HEADER */}

      <header className="header">

        <div className="header-content">

          <p className="project-label">
            CODEALPHA INTERNSHIP PROJECT
          </p>

          <h1>Flashcard Quiz App</h1>

          <p className="subtitle">
            Learn, practice and test your knowledge.
          </p>

        </div>

        <div className="header-actions">

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <div className="score-box">
            <span>Score</span>
            <strong>{score}</strong>
          </div>

          <div className="best-score-box">
            <span>Best</span>
            <strong>{bestScore}</strong>
          </div>

        </div>

      </header>

      {/* QUIZ */}

      {!quizFinished ? (

        <main className="main">

          {/* PROGRESS */}

          <div className="progress-section">

            <div className="progress-top">

              <span>
                {quizStarted ? "Question" : "Card"}{" "}
                {currentCard + 1} of {questions.length}
              </span>

              <span>
                {Math.round(progress)}%
              </span>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              ></div>

            </div>

          </div>

          {/* TIMER */}

          {quizStarted && (

            <div
              className={`timer ${
                timeLeft <= 5
                  ? "timer-warning"
                  : ""
              }`}
            >
              ⏱️ Time Left:{" "}
              <strong>
                00:{String(timeLeft).padStart(2, "0")}
              </strong>
            </div>

          )}

          {/* FLASHCARD */}

          <div className="flashcard">

            <p className="question-label">
              {quizStarted
                ? "QUIZ QUESTION"
                : "QUESTION"}
            </p>

            <h2>{card.question}</h2>

            {!quizStarted && (

              <p className="instruction">
                Click "Start Quiz" to begin.
              </p>

            )}

            {quizStarted && (

              <>

                {/* OPTIONS */}

                {selectedAnswer === null ? (

                  <div className="options">

                    {shuffledOptions.map(
                      (item, index) => (

                        <button
                          key={index}
                          className="option"
                          onClick={() =>
                            selectAnswer(
                              item.originalIndex
                            )
                          }
                        >
                          {item.option}
                        </button>

                      )
                    )}

                  </div>

                ) : (

                  /* RESULT */

                  <div
                    className={`result-box ${
                      selectedAnswer === card.correct
                        ? "correct-result"
                        : "wrong-result"
                    }`}
                  >

                    <p className="result-title">

                      {selectedAnswer === card.correct
                        ? "🎉 Correct!"
                        : "❌ Incorrect!"}

                    </p>

                    <p className="correct-answer">

                      Correct answer:{" "}

                      <strong>
                        {card.options[card.correct]}
                      </strong>

                    </p>

                  </div>

                )}

                {/* ANSWER */}

                {showAnswer && (

                  <div className="answer-box">

                    <p className="answer-label">
                      ANSWER
                    </p>

                    <p>{card.answer}</p>

                  </div>

                )}

              </>

            )}

          </div>

          {/* CONTROLS */}

          <div className="controls">

            <button
              className="secondary-btn"
              onClick={previousCard}
              disabled={currentCard === 0}
            >
              ← Previous
            </button>

            {quizStarted && (

              <button
                className="primary-btn"
                onClick={() =>
                  setShowAnswer(!showAnswer)
                }
              >
                {showAnswer
                  ? "Hide Answer"
                  : "Show Answer"}
              </button>

            )}

            <button
              className="secondary-btn"
              onClick={nextCard}
            >
              {currentCard === questions.length - 1
                ? "Finish"
                : "Next →"}
            </button>

          </div>

          {/* START */}

          {!quizStarted && (

            <button
              className="start-btn"
              onClick={startQuiz}
            >
              🎯 Start Quiz
            </button>

          )}

        </main>

      ) : (

        /* COMPLETION */

        <main className="main">

          <div className="completion-card">

            <div className="trophy">
              🏆
            </div>

            <h2>Quiz Completed!</h2>

            <p>You scored</p>

            <div className="final-score">
              {score} / {questions.length}
            </div>

            <div className="percentage">
              {percentage}%
            </div>

            <p className="message">

              {score === questions.length
                ? "Excellent! Perfect score! 🎉"
                : score >= 3
                ? "Great job! Keep learning! 👍"
                : "Good effort! Keep practicing! 💪"}

            </p>

            <div className="final-stats">

              <div>

                <span>Current Score</span>

                <strong>
                  {score}/{questions.length}
                </strong>

              </div>

              <div>

                <span>Best Score</span>

                <strong>
                  {bestScore}/{questions.length}
                </strong>

              </div>

            </div>

            <button
              className="start-btn"
              onClick={restartQuiz}
            >
              🔄 Restart Quiz
            </button>

            <button
              className="back-btn"
              onClick={backToFlashcards}
            >
              ← Back to Flashcards
            </button>

          </div>

        </main>

      )}

      {/* FOOTER */}

      <footer>
        Built with React • CodeAlpha App Development Internship
      </footer>

    </div>
  );
}

export default App;