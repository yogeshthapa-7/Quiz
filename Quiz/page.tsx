'use client'
import React, { useState, useEffect } from 'react'
import { quizQuestionsAnswers as originalQuestions } from '../data/QuizQuestion'

const shuffleArray = (array: any[]) => { 
    return [...array].sort(() => Math.random() - 0.5) 

  }
const Quiz = () => {
    const [quizQuestionsAnswers] = useState(() => shuffleArray(originalQuestions))
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isFinished, setIsFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30) // ⏱️ 30 seconds per question

  
  // Reset timer whenever question changes
  useEffect(() => {
    setTimeLeft(30)
  }, [currentStep])

  // Countdown effect
  useEffect(() => {
    if (isFinished) return
    if (timeLeft <= 0) {
      nextQuestion() // auto move if time runs out
      return
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, isFinished])

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswers[currentStep]) return
    setSelectedAnswers({ ...selectedAnswers, [currentStep]: answer })
  }

  const nextQuestion = () => {
    if (currentStep < quizQuestionsAnswers.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsFinished(true)
    }
  }

  const restartQuiz = () => {
    setCurrentStep(0)
    setSelectedAnswers({})
    setIsFinished(false)
    setTimeLeft(30)
  }

  const calculateScore = () => {
    return quizQuestionsAnswers.reduce((score, q, index) => {
      return selectedAnswers[index] === q.correctAnswer ? score + 1 : score
    }, 0)
  }

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-gradient-to-br from-green-400 to-blue-500 shadow-2xl rounded-3xl text-center text-white">
        <h2 className="text-3xl font-extrabold mb-4">🎉 Quiz Finished!</h2>
        <p className="text-xl mb-6">
          Your Score: 
          <span className="font-bold text-yellow-300">
            {calculateScore()} / {quizQuestionsAnswers.length}
          </span>
        </p>
        <button 
          onClick={restartQuiz}
          className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold hover:bg-indigo-100 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  const currentQuestionData = quizQuestionsAnswers[currentStep]
  const hasAnswered = !!selectedAnswers[currentStep]

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl text-white">
      {/* Progress Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold">
          Question {currentStep + 1} of {quizQuestionsAnswers.length}
        </span>
        <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / quizQuestionsAnswers.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="mb-4 text-lg font-bold text-yellow-300">
        ⏱️ Time Left: {timeLeft}s
      </div>

      {/* Question */}
      
      <h2 className="text-2xl font-bold mb-6">{currentQuestionData.question}</h2>

      {/* Answers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestionData.answers.map((ans, index) => {
          const isSelected = selectedAnswers[currentStep] === ans
          const isCorrect = ans === currentQuestionData.correctAnswer

          let buttonClass = "bg-white text-gray-800 border-2 border-gray-300"
          if (hasAnswered) {
            if (isCorrect) buttonClass = "bg-green-500 text-white border-green-700 scale-105"
            else if (isSelected) buttonClass = "bg-red-500 text-white border-red-700 scale-95"
            else buttonClass = "bg-gray-700 text-gray-400 opacity-50"
          } else {
            buttonClass += " hover:scale-105 hover:shadow-lg hover:border-indigo-400 transition-all"
          }

          return (
            <button
              key={index}
              disabled={hasAnswered}
              onClick={() => handleAnswerClick(ans)}
              className={`p-4 rounded-xl font-semibold transform transition-all duration-300 ${buttonClass}`}
            >
              {ans}
            </button>
          )
        })}
      </div>

      {/* Footer Navigation */}
      {hasAnswered && (
        <button 
          onClick={nextQuestion}
          className="mt-8 w-full py-3 rounded-xl font-bold text-white 
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
            hover:from-pink-500 hover:to-indigo-500 transition-transform transform hover:scale-105"
        >
          {currentStep === quizQuestionsAnswers.length - 1 ? "See Results 🎉" : "Next Question →"}
        </button>
      )}
    </div>
  )
}

export default Quiz
