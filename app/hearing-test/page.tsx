"use client"

import { useState } from "react"
import { MainNavigation } from "@/components/main-navigation"
import { EquipmentSetup } from "@/components/equipment-setup"
import { TheoreticalQuestions } from "@/components/theoretical-questions"
import { FrequencyTest } from "@/components/frequency-test"
import { HearingTestResultsNew } from "@/components/hearing-test-results-new"
import {
  calculateTheoreticalScore,
  calculateOverallAssessment,
  generateRecommendations,
  generateHearingTips,
  type HearingTestResult,
} from "@/lib/hearing-test-data"

type TestStage = "equipment" | "theoretical" | "left-ear" | "right-ear" | "results"

export default function HearingTestPage() {
  const [stage, setStage] = useState<TestStage>("equipment")
  const [equipmentData, setEquipmentData] = useState<any>(null)
  const [theoreticalAnswers, setTheoreticalAnswers] = useState<number[]>([])
  const [leftEarResults, setLeftEarResults] = useState<{ frequency: number; threshold: number }[]>([])
  const [rightEarResults, setRightEarResults] = useState<{ frequency: number; threshold: number }[]>([])
  const [finalResults, setFinalResults] = useState<HearingTestResult | null>(null)

  const handleEquipmentComplete = (equipment: any) => {
    setEquipmentData(equipment)
    setStage("theoretical")
  }

  const handleTheoreticalComplete = (answers: number[]) => {
    setTheoreticalAnswers(answers)
    setStage("left-ear")
  }

  const handleLeftEarComplete = (results: { frequency: number; threshold: number }[]) => {
    setLeftEarResults(results)
    setStage("right-ear")
  }

  const handleRightEarComplete = (results: { frequency: number; threshold: number }[]) => {
    setRightEarResults(results)

    // Calculate final results
    const theoreticalScore = calculateTheoreticalScore(theoreticalAnswers)
    const assessment = calculateOverallAssessment(theoreticalScore, results, leftEarResults)
    const recommendations = generateRecommendations(assessment)
    const hearingTips = generateHearingTips()

    const testResults: HearingTestResult = {
      theoreticalScore,
      leftEarResults,
      rightEarResults: results,
      overallAssessment: assessment,
      recommendations,
      hearingTips,
    }

    setFinalResults(testResults)
    setStage("results")
  }

  const handleRetake = () => {
    setStage("equipment")
    setEquipmentData(null)
    setTheoreticalAnswers([])
    setLeftEarResults([])
    setRightEarResults([])
    setFinalResults(null)
  }

  return (
    <div className="min-h-screen">
      <MainNavigation />

      <div className="container mx-auto max-w-7xl px-4 py-12">
        {stage === "equipment" && <EquipmentSetup onComplete={handleEquipmentComplete} />}

        {stage === "theoretical" && <TheoreticalQuestions onComplete={handleTheoreticalComplete} />}

        {stage === "left-ear" && <FrequencyTest ear="left" onComplete={handleLeftEarComplete} />}

        {stage === "right-ear" && <FrequencyTest ear="right" onComplete={handleRightEarComplete} />}

        {stage === "results" && finalResults && <HearingTestResultsNew result={finalResults} onRetake={handleRetake} />}
      </div>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Al-Barakat Hearing Care</h3>
              <p className="text-sm text-muted-foreground">Your trusted partner in hearing health and wellness.</p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/services" className="text-muted-foreground hover:text-foreground">
                    Services
                  </a>
                </li>
                <li>
                  <a href="/products" className="text-muted-foreground hover:text-foreground">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/hearing-test" className="text-muted-foreground hover:text-foreground">
                    Hearing Test
                  </a>
                </li>
                <li>
                  <a href="/hearing-health" className="text-muted-foreground hover:text-foreground">
                    Hearing Health
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+966 12 345 6789</li>
                <li>info@albarakat-hearing.com</li>
                <li>Sun-Thu: 9AM-8PM</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Al-Barakat Hearing Care Centers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
