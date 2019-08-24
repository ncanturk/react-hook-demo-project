import React, { useState, useEffect } from 'react';
import Letter from './Letter';

export default function App() {
  const [point, setPoint] = useState(0);
  const [message, setMessage] = useState(null);
  const [time, setTime] = useState(null);
  const [game, setGame] = useState(
    {
      availableQuestion: null,
      questions: [
        {
          question: "A static type checker for JavaScript.",
          answer: "FLOW",
          status: false
        },
        {
          question: "A JavaScript library.",
          answer: "REACT",
          status: false
        },
        {
          question: "Where is the correct place to insert a JavaScript?",
          answer: "SCRIPT",
          status: false
        },
        {
          question: "A module bundler.",
          answer: "WEBPACK",
          status: false
        },
        {
          question: "Dependency manager for PHP.",
          answer: "COMPOSER",
          status: false
        }
      ],
      letters: [],
      point: 0,
      letterPoints: 0,
      completed: false,
      newAnswer: ""
    });

  const giveMessage = (message, type) => {
    if (type === "error") {
      setMessage({ ...message, message, style: "bg-danger text-white" });
    } else if (type === "true") {
      setMessage({ ...message, message, style: "bg-success text-white" });
    } else {
      setMessage({ ...message, message, style: "bg-dark text-white" })
    }
  };

  useEffect(() => {
    if (time && time.remaining > 0) {
      const sureInterval = setInterval(() => {
        setTime({ ...time, remaining: time.remaining - 1 });
      }, 1000);
      return () => {
        clearInterval(sureInterval);
      };
    }
  });

  const startGame = () => {
    setTime({
      remaining: 240
    });
    setMessage(null);
    setPoint(0);
    setGame({
      ...game,
      questions: game.questions.map(question => {
        question.status = false; return question;
      }),
      point: 0,
      letterPoints: 0,
      completed: false
    })
    askQuestion();
  };
  const askQuestion = () => {
    let questions = game.questions;
    let availableQuestion = questions.find(question => !question.status);

    if (!availableQuestion) {
      gameOver();
      return;
    }

    let letters = [];
    availableQuestion.answer.split("").forEach(h => {
      letters.push({
        value: h,
        status: false
      });
    });
    availableQuestion.status = true;
    let totalLetterPoints = letters.length * 100;
    setGame({
      ...game,
      availableQuestion,
      letters,
      questions,
      letterPoints: totalLetterPoints,
      newAnswer: "",
      completed: false
    });
  }
  const answerQuestion = () => {
    let total = point;
    if (game.newAnswer.toUpperCase() ===
      game.availableQuestion.answer.toUpperCase()
    ) {
      total += game.letterPoints;
      giveMessage(`Congratulations, you did it right.`, "true");
    } else {
      total -= game.letterPoints;
      giveMessage(`Unfortunately, the wrong answer. Right answer "${game.availableQuestion.answer}"`, "error");
    }
    setPoint(total);

    askQuestion();

  }
  const gameOver = () => {
    setGame({
      ...game, completed: true, availableQuestion: null, letters: []
    })
  }

  const giveLetter = () => {
    if (game.letterPoints <= 100) {
      return;
    }
    let randomLetterIndex = Math.floor(Math.random() * game.letters.length);
    let letter = game.letters[randomLetterIndex];
    while (letter.status) {
      randomLetterIndex = Math.floor(Math.random() * game.letters.length);
      letter = game.letters[randomLetterIndex];
    }
    setGame({
      ...game,
      letters: game.letters.map((letter, index) => {
        if (index === randomLetterIndex) {
          letter.status = true;
        }
        return letter;
      }),
      letterPoints: game.letterPoints - 100
    });
  };
  const answerChanged = (e) => {
    setGame({ ...game, newAnswer: e.target.value })
  }

  return (
    <div className="container mt-4">
      {
        !game.availableQuestion && (
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="mb-0">Welcome to Word Game!</h4>
            </div>
            <div className="card-body">
              <p className="mb-0">Click the START button to start the game.</p>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary" onClick={startGame}>START</button>
            </div>
          </div>)
      }
      {
        game.completed && (
          <div className="card">
            <div className="card-body">
              Congratulations! You have completed the game with {point} Points.
            </div>
          </div>)
      }
      {
        game.availableQuestion && (
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="mb-0">{game.availableQuestion.question}</h4>
            </div>
            <div className="card-body">
              <div className="d-flex">
                {game.letters.map((letter, index) => (
                  <Letter {...letter} key={'key-' + index} />
                ))}
              </div>
            </div>
            <div className="card-footer d-flex">
              <div className="mr-4">Total Point: {point}</div>
              <div className="mr-4">Word's Point: {game.letterPoints}</div>
              <div className="mr-4">Time Remaining: {time.remaining} second.</div>
            </div>
            <div className="card-footer">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Answer" value={game.newAnswer} onChange={answerChanged} />
                <div className="input-group-append" id="button-addon4">
                  <button className="btn btn-primary" type="button" onClick={answerQuestion}>Answer</button>
                  <button className="btn btn-success" type="button" onClick={giveLetter}>Letter Please</button>
                </div>
              </div>
            </div>
            {
              message && (
                <div className={"card-footer " + message.style}>
                  {message.message}
                </div>
              )
            }
          </div>)
      }
    </div>
  )
}
