"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Question {
  id: string
  question: string
  options: string[]
}

interface CareerResult {
  careerPath: string
  alumni: Array<{ name: string; role: string; expertise: string }>
  events: Array<{ title: string; date: string }>
  internships: Array<{ company: string; role: string }>
}

const questions: Question[] = [
  {
    id: "interest",
    question: "What field interests you most?",
    options: ["Core Engineering", "IT & Software", "Management", "Design"],
  },
  {
    id: "workType",
    question: "What's your preferred work type?",
    options: ["Office", "Field", "Hybrid", "Remote"],
  },
  {
    id: "higherStudies",
    question: "Are you interested in higher studies?",
    options: ["Yes", "No", "Maybe Later"],
  },
  {
    id: "strength",
    question: "What's your main strength?",
    options: ["Coding", "Design", "Analysis", "Communication"],
  },
]

// Mock data for results
const careerPathsData: Record<string, CareerResult> = {
  "Core Engineering": {
    careerPath: "Mechanical/Civil Engineering",
    alumni: [
      { name: "Rajesh Kumar", role: "Sr. Structural Engineer", expertise: "Bridge Design" },
      { name: "Priya Sharma", role: "Design Lead", expertise: "CAD & BIM" },
    ],
    events: [
      { title: "Infrastructure Workshop", date: "2025-01-15" },
      { title: "Sustainability in Engineering", date: "2025-02-01" },
    ],
    internships: [
      { company: "TCS Engineering", role: "Graduate Intern" },
      { company: "L&T", role: "Design Intern" },
    ],
  },
  "IT & Software": {
    careerPath: "Software Development & Tech",
    alumni: [
      { name: "Arjun Singh", role: "Principal Engineer", expertise: "Full Stack Development" },
      { name: "Neha Gupta", role: "Tech Lead", expertise: "Cloud Architecture" },
    ],
    events: [
      { title: "Web Development Bootcamp", date: "2025-01-20" },
      { title: "AI/ML Career Panel", date: "2025-02-10" },
    ],
    internships: [
      { company: "Google India", role: "Software Engineer Intern" },
      { company: "Microsoft", role: "Cloud Engineering Intern" },
    ],
  },
  Management: {
    careerPath: "Business & Management",
    alumni: [
      { name: "Vikram Patel", role: "Business Manager", expertise: "Strategic Planning" },
      { name: "Anjali Reddy", role: "Operations Lead", expertise: "Process Optimization" },
    ],
    events: [
      { title: "Leadership Masterclass", date: "2025-01-25" },
      { title: "Entrepreneurship Summit", date: "2025-02-15" },
    ],
    internships: [
      { company: "Accenture", role: "Management Consultant Intern" },
      { company: "McKinsey", role: "Associate Intern" },
    ],
  },
  Design: {
    careerPath: "Design & UI/UX",
    alumni: [
      { name: "Divya Iyer", role: "Senior Designer", expertise: "UI/UX Design" },
      { name: "Rohan Menon", role: "Creative Director", expertise: "Brand Design" },
    ],
    events: [
      { title: "Design Thinking Workshop", date: "2025-01-18" },
      { title: "Portfolio Building Session", date: "2025-02-05" },
    ],
    internships: [
      { company: "Adobe", role: "Design Intern" },
      { company: "Figma", role: "UX Design Intern" },
    ],
  },
}

export function CareerDecisionHelper({ onClose }: { onClose: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState<CareerResult | null>(null)

  const handleAnswer = (answer: string) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: answer,
    }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Generate results
      const careerPath = newAnswers.interest || "IT & Software"
      setSelectedCareer(careerPathsData[careerPath])
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setSelectedCareer(null)
  }

  if (showResults && selectedCareer) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Your Career Path</h3>
          <p className="text-lg text-accent font-semibold">{selectedCareer.careerPath}</p>
        </div>

        {/* Alumni Section */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">Relevant Alumni to Talk To</h4>
          <div className="grid gap-4">
            {selectedCareer.alumni.map((alumni, idx) => (
              <Card key={idx} className="p-4">
                <p className="font-semibold text-foreground">{alumni.name}</p>
                <p className="text-sm text-accent">{alumni.role}</p>
                <p className="text-xs text-muted-foreground mt-1">Expertise: {alumni.expertise}</p>
                <Button className="mt-3 w-full bg-accent hover:bg-accent/90 h-auto py-1 text-sm">
                  Request Mentorship
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h4>
          <div className="grid gap-3">
            {selectedCareer.events.map((event, idx) => (
              <Card key={idx} className="p-3">
                <p className="font-medium text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground">Date: {event.date}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Internships Section */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">Relevant Internships</h4>
          <div className="grid gap-3">
            {selectedCareer.internships.map((internship, idx) => (
              <Card key={idx} className="p-3">
                <p className="font-medium text-foreground">{internship.company}</p>
                <p className="text-sm text-muted-foreground">{internship.role}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleReset} className="flex-1 border border-border bg-background hover:bg-muted">
            Retake Quiz
          </Button>
          <Button onClick={onClose} className="flex-1 bg-accent hover:bg-accent/90">
            Continue to Login
          </Button>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-foreground">Career Decision Helper</h3>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div>
        <h4 className="text-xl font-semibold text-foreground mb-6">{questions[currentQuestion].question}</h4>

        {/* Options */}
        <div className="grid gap-3">
          {questions[currentQuestion].options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="p-4 text-left border border-border rounded-lg bg-card hover:border-accent hover:bg-muted transition-all"
            >
              <span className="text-foreground font-medium">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Close Button */}
      <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Skip and go to Login
      </button>
    </div>
  )
}
