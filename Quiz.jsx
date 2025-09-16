import React, { useState } from "react";

const questions = [
  {
    id: 1,
    question: "Which waste can generate biogas?",
    options: ["Plastic bottles", "Food waste", "Metal scraps", "Glass"],
    answer: "Food waste",
  },
  {
    id: 2,
    question: "E-waste should be?",
    options: ["Thrown with dry waste", "Burned in open", "Given to recycler", "Buried"],
    answer: "Given to recycler",
  },
  {
    id: 3,
    question: "What does RDF stand for?",
    options: ["Refuse Derived Fuel", "Renewable Dump Fuel", "Reduced Dry Fraction", "Recycled Dust Fraction"],
    answer: "Refuse Derived Fuel",
  },
  {
    id: 4,
    question: "Which gas is captured from anaerobic digestion?",
    options: ["Oxygen", "Methane", "Nitrogen", "Carbon Dioxide"],
    answer: "Methane",
  },
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option) => {
    if (option === questions[current].answer) {
      setScore((s) => s + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Waste → Energy Quiz</h1>

        {!showResult ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Q{current + 1}. {questions[current].question}
            </h2>
            <div className="grid gap-3">
              {questions[current].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="p-3 text-left border rounded-lg hover:bg-blue-50 transition"
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-4 text-right text-sm text-slate-500">
              {current + 1}/{questions.length}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Completed 🎉</h2>
            <p className="text-lg">
              Your Score: <span className="font-semibold">{score}</span> / {questions.length}
            </p>
            <p className="text-slate-600 mt-2">
              {score === questions.length
                ? "Perfect! 🌟"
                : score > 2
                ? "Good job!"
                : "Keep learning!"}
            </p>
            <button
              onClick={restartQuiz}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
