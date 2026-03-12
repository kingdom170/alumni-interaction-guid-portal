"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

interface CareerPath {
  id: number
  title: string
  description: string
  skills: string[]
  relatedAlumni: string[]
  opportunities: string[]
}

const careerPaths: CareerPath[] = [
  {
    id: 1,
    title: "Software Engineering",
    description: "Build applications and systems that power the digital world",
    skills: ["Programming", "Problem Solving", "System Design", "Databases"],
    relatedAlumni: ["Alex Kumar - Senior Engineer at Google", "Priya Sharma - CTO at TechStartup"],
    opportunities: ["Google Internship 2025", "Microsoft Summer Program", "Amazon SDE Roles"],
  },
  {
    id: 2,
    title: "Data Science & AI",
    description: "Leverage data to solve complex business problems and create intelligent systems",
    skills: ["Python", "Statistics", "Machine Learning", "Data Visualization"],
    relatedAlumni: ["Raj Patel - Data Scientist at Meta", "Neha Singh - AI Researcher at OpenAI"],
    opportunities: ["JPMorgan Data Fellowship", "Tesla AI Program", "DeepMind Research Internship"],
  },
  {
    id: 3,
    title: "Product Management",
    description: "Lead the vision and strategy of digital products that impact millions",
    skills: ["Leadership", "Analytics", "User Research", "Communication"],
    relatedAlumni: ["Vikram Gupta - PM at Amazon", "Anjali Desai - Product Lead at Airbnb"],
    opportunities: ["Stripe PM Program", "Uber Fellowship", "Notion Product Roles"],
  },
  {
    id: 4,
    title: "Design & UX",
    description: "Create beautiful and intuitive experiences for users worldwide",
    skills: ["Design Thinking", "User Research", "Prototyping", "Visual Design"],
    relatedAlumni: ["Zara Khan - Design Lead at Apple", "Arjun Mehta - UX Strategist at Meta"],
    opportunities: ["Adobe Design Internship", "Figma Design Program", "Dribbble Fellowship"],
  },
]

export default function CareerHelperPage() {
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="career helper" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Career Helper</h1>
          <p className="text-muted-foreground">
            Explore different career paths and discover opportunities aligned with your interests
          </p>
        </div>

        {!selectedPath ? (
          <>
            {/* Career Paths Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {careerPaths.map((path) => (
                <div
                  key={path.id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedPath(path)
                    setShowDetails(true)
                  }}
                >
                  <h3 className="text-xl font-semibold text-foreground mb-2">{path.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {path.skills.slice(0, 2).map((skill, idx) => (
                      <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {path.skills.length > 2 && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        +{path.skills.length - 2} more
                      </span>
                    )}
                  </div>
                  <Button className="w-full">Explore Path</Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Career Path Details */}
            <button
              onClick={() => {
                setSelectedPath(null)
                setShowDetails(false)
              }}
              className="text-sm text-primary hover:underline mb-6"
            >
              ← Back to all paths
            </button>

            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">{selectedPath.title}</h2>
              <p className="text-lg text-muted-foreground mb-8">{selectedPath.description}</p>

              {/* Skills Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Key Skills</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedPath.skills.map((skill, idx) => (
                    <div key={idx} className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <p className="text-sm font-medium text-foreground">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Alumni Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Related Alumni</h3>
                <div className="space-y-3">
                  {selectedPath.relatedAlumni.map((alumni, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-muted/50 rounded-lg p-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {alumni[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{alumni}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunities Section */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Relevant Opportunities</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedPath.opportunities.map((opportunity, idx) => (
                    <div
                      key={idx}
                      className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground mb-2">{opportunity}</p>
                      <Button size="sm" className="w-full">
                        Learn More
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <Button
                  onClick={() => {
                    setSelectedPath(null)
                    setShowDetails(false)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Explore Other Paths
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
