"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  careerWeights: {
    "Software Engineering": number
    "Data Science & AI": number
    "Product Management": number
    "Design & UX": number
  }
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What interests you the most?",
    options: [
      "Building applications and systems",
      "Analyzing data and patterns",
      "Leading teams and strategy",
      "Creating beautiful user experiences",
    ],
    careerWeights: {
      "Software Engineering": 4,
      "Data Science & AI": 3,
      "Product Management": 2,
      "Design & UX": 1,
    },
  },
  {
    id: 2,
    question: "What type of work environment do you prefer?",
    options: [
      "Problem-solving with code",
      "Research and experimentation",
      "Strategic planning and meetings",
      "Creative and visual projects",
    ],
    careerWeights: {
      "Software Engineering": 4,
      "Data Science & AI": 4,
      "Product Management": 3,
      "Design & UX": 4,
    },
  },
  {
    id: 3,
    question: "How do you want to impact the world?",
    options: [
      "By creating robust technology",
      "By discovering insights and solutions",
      "By guiding product vision",
      "By improving how people interact with technology",
    ],
    careerWeights: {
      "Software Engineering": 4,
      "Data Science & AI": 4,
      "Product Management": 4,
      "Design & UX": 3,
    },
  },
  {
    id: 4,
    question: "What's your strongest skill?",
    options: [
      "Programming and system design",
      "Mathematics and statistics",
      "Communication and leadership",
      "Visual design and user empathy",
    ],
    careerWeights: {
      "Software Engineering": 4,
      "Data Science & AI": 4,
      "Product Management": 3,
      "Design & UX": 4,
    },
  },
]

interface CareerRecommendation {
  name: string
  score: number
  description: string
  skills: string[]
  avgSalary: string
  growthRate: string
}

interface CareerAssessmentQuizProps {
  onComplete?: (recommendation: CareerRecommendation) => void
}

export function CareerAssessmentQuiz({ onComplete }: CareerAssessmentQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState({
    "Software Engineering": 0,
    "Data Science & AI": 0,
    "Product Management": 0,
    "Design & UX": 0,
  })
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [recommendation, setRecommendation] = useState<CareerRecommendation | null>(null)

  const handleAnswer = (selectedIndex: number) => {
    const question = quizQuestions[currentQuestion]
    const newScores = { ...scores }

    Object.keys(newScores).forEach((career) => {
      newScores[career as keyof typeof newScores] +=
        question.careerWeights[career as keyof typeof question.careerWeights] * (selectedIndex + 1)
    })

    setScores(newScores)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeQuiz(newScores)
    }
  }

  const completeQuiz = (finalScores: typeof scores) => {
    const careerRecommendations: Record<string, CareerRecommendation> = {
      "Software Engineering": {
        name: "Software Engineering",
        score: finalScores["Software Engineering"],
        description: "Build scalable applications and systems that impact millions of users",
        skills: ["Programming", "System Design", "Problem Solving", "Databases"],
        avgSalary: "$120,000 - $180,000",
        growthRate: "15% annual growth",
      },
      "Data Science & AI": {
        name: "Data Science & AI",
        score: finalScores["Data Science & AI"],
        description: "Leverage data and AI to solve complex business problems",
        skills: ["Python", "Machine Learning", "Statistics", "Data Visualization"],
        avgSalary: "$130,000 - $200,000",
        growthRate: "25% annual growth",
      },
      "Product Management": {
        name: "Product Management",
        score: finalScores["Product Management"],
        description: "Lead product strategy and vision for innovative solutions",
        skills: ["Leadership", "Analytics", "User Research", "Communication"],
        avgSalary: "$125,000 - $190,000",
        growthRate: "18% annual growth",
      },
      "Design & UX": {
        name: "Design & UX",
        score: finalScores["Design & UX"],
        description: "Create beautiful and intuitive experiences that users love",
        skills: ["Design Thinking", "Prototyping", "User Research", "Visual Design"],
        avgSalary: "$100,000 - $160,000",
        growthRate: "12% annual growth",
      },
    }

    let bestCareer: CareerRecommendation | null = null
    let highestScore = -1

    Object.values(careerRecommendations).forEach((career) => {
      if (career.score > highestScore) {
        highestScore = career.score
        bestCareer = career
      }
    })

    setRecommendation(bestCareer)
    setQuizCompleted(true)
    onComplete?.(bestCareer!)
  }

  if (quizCompleted && recommendation) {
    return (
      <div className="space-y-6">
        {/* Result Card */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <h2 className="text-3xl font-bold text-foreground mb-4">Your Recommended Career Path</h2>
          <p className="text-lg text-primary font-semibold mb-2">{recommendation.name}</p>
          <p className="text-muted-foreground mb-6">{recommendation.description}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Average Salary Range</p>
              <p className="text-xl font-semibold text-foreground">{recommendation.avgSalary}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Industry Growth Rate</p>
              <p className="text-xl font-semibold text-foreground">{recommendation.growthRate}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Key Skills to Develop</h3>
            <div className="grid grid-cols-2 gap-2">
              {recommendation.skills.map((skill, idx) => (
                <div key={idx} className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                  <p className="text-sm font-medium text-primary">{skill}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                setCurrentQuestion(0)
                setScores({
                  "Software Engineering": 0,
                  "Data Science & AI": 0,
                  "Product Management": 0,
                  "Design & UX": 0,
                })
                setQuizCompleted(false)
                setRecommendation(null)
              }}
              variant="outline"
              className="flex-1"
            >
              Retake Quiz
            </Button>
            <Button className="flex-1">Explore Opportunities</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">{quizQuestions[currentQuestion].question}</h2>

        <div className="space-y-3">
          {quizQuestions[currentQuestion].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full p-4 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <p className="font-medium text-foreground group-hover:text-primary">{option}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
