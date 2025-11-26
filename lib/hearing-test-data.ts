export interface TheoreticalQuestion {
  id: string
  question: string
  options: string[]
  weight: number // Weight for scoring (1-5, higher = more concerning)
}

export interface FrequencyTest {
  frequency: number // Hz
  ear: "left" | "right"
  minVolume: number
  maxVolume: number
}

export interface HearingTestResult {
  theoreticalScore: number
  leftEarResults: { frequency: number; threshold: number }[]
  rightEarResults: { frequency: number; threshold: number }[]
  overallAssessment: "normal" | "mild-loss" | "moderate-loss" | "severe-loss"
  recommendations: string[]
  hearingTips: string[]
}

// Medical-approved theoretical questions based on standard hearing questionnaires
export const theoreticalQuestions: TheoreticalQuestion[] = [
  {
    id: "q1",
    question: "How would you describe your hearing?",
    options: ["Excellent", "Good", "I have a little trouble", "I have some trouble", "I have a lot of trouble"],
    weight: 5,
  },
  {
    id: "q2",
    question: "In conversations in a quiet environment, do people seem to mumble?",
    options: ["Never", "Rarely", "Occasionally", "Often", "Always"],
    weight: 4,
  },
  {
    id: "q3",
    question: "Do you find it hard to have a conversation on the phone?",
    options: ["Never", "Rarely", "Occasionally", "Often", "Always"],
    weight: 4,
  },
  {
    id: "q4",
    question:
      "Do you find it hard to follow conversations in a noisy environment? (such as in noisy restaurants or in a crowd)",
    options: ["Never", "Rarely", "Occasionally", "Often", "Always"],
    weight: 5,
  },
  {
    id: "q5",
    question: "Do you often ask people to repeat themselves?",
    options: ["Never", "Rarely", "Occasionally", "Often", "Always"],
    weight: 4,
  },
  {
    id: "q6",
    question: "Do you feel like one ear hears significantly better than the other one? If so, which one?",
    options: ["Both about the same", "Left", "Right"],
    weight: 3,
  },
  {
    id: "q7",
    question: "Do you have difficulty hearing the television or radio at normal volume?",
    options: ["Never", "Rarely", "Occasionally", "Often", "Always"],
    weight: 4,
  },
]

// Standard audiometric frequencies (Hz) used in medical hearing tests
export const testFrequencies = [250, 500, 1000, 2000, 4000, 8000]

export function calculateHearingPercentages(results: { frequency: number; threshold: number }[]): number {
  // If threshold is low (0.1), it means user could hear at low volume = good hearing = 90% (1 - 0.1 = 0.9)
  // If threshold is high (0.9), it means user needed high volume = poor hearing = 10% (1 - 0.9 = 0.1)
  const avgThreshold = results.reduce((sum, r) => sum + r.threshold, 0) / results.length
  // Invert: (1 - threshold) gives correct hearing ability percentage
  return Math.round((1 - avgThreshold) * 100)
}

export function calculateOverallPercentage(
  leftEarResults: { frequency: number; threshold: number }[],
  rightEarResults: { frequency: number; threshold: number }[],
): number {
  const leftPercentage = calculateHearingPercentages(leftEarResults)
  const rightPercentage = calculateHearingPercentages(rightEarResults)
  return Math.round((leftPercentage + rightPercentage) / 2)
}

export function getHearingCategory(percentage: number): string {
  if (percentage >= 90) return "Good Hearing"
  if (percentage >= 70) return "Mild Loss"
  if (percentage >= 50) return "Moderate Loss"
  if (percentage >= 20) return "Severe Loss"
  return "Significant Loss"
}

export function calculateTheoreticalScore(answers: number[]): number {
  let totalScore = 0
  answers.forEach((answer, index) => {
    if (index < theoreticalQuestions.length) {
      // Reverse scoring for most questions (higher answer = more hearing difficulty)
      const question = theoreticalQuestions[index]
      if (question.id === "q6") {
        // Special handling for ear preference question
        totalScore += answer > 0 ? question.weight : 0
      } else {
        totalScore += answer * question.weight
      }
    }
  })
  return totalScore
}

export function calculateOverallAssessment(
  theoreticalScore: number,
  leftEarResults: { frequency: number; threshold: number }[],
  rightEarResults: { frequency: number; threshold: number }[],
): HearingTestResult["overallAssessment"] {
  const allThresholds = [...leftEarResults, ...rightEarResults].map((r) => r.threshold)
  const avgThreshold = allThresholds.reduce((a, b) => a + b, 0) / allThresholds.length

  // Convert: lower threshold (0.1) = better hearing, higher threshold (0.9) = worse hearing
  // Medical scale: 0-25dB = normal, 26-40dB = mild loss, 41-70dB = moderate loss, 71+dB = severe loss
  const estimatedDBLoss = (1 - avgThreshold) * 80 // Inverted: low avgThreshold = high loss, high avgThreshold = low loss

  const theoreticalFactor = theoreticalScore / 100

  if (estimatedDBLoss > 70 || theoreticalFactor > 0.8) {
    return "severe-loss"
  } else if (estimatedDBLoss > 45 || theoreticalFactor > 0.65) {
    return "moderate-loss"
  } else if (estimatedDBLoss > 20 || theoreticalFactor > 0.35) {
    return "mild-loss"
  } else {
    return "normal"
  }
}

export function generateRecommendations(
  assessment: HearingTestResult["overallAssessment"],
  percentage?: number,
): string[] {
  const firstRecommendation =
    percentage !== undefined
      ? `Your results show ${getHearingCategory(percentage)} (${percentage}%).`
      : "Your results suggest mild hearing loss in certain frequencies."

  switch (assessment) {
    case "normal":
      return [
        firstRecommendation,
        "Continue to protect your hearing from loud noises and use hearing protection when necessary.",
        "Schedule regular hearing check-ups every 2-3 years to monitor your hearing health.",
        "Maintain a healthy lifestyle with proper nutrition and exercise to support overall ear health.",
      ]
    case "mild-loss":
      return [
        firstRecommendation,
        "We recommend scheduling a comprehensive audiological evaluation with our certified audiologists.",
        "Early intervention can prevent further hearing deterioration and improve quality of life.",
        "Consider using hearing protection in noisy environments to prevent additional damage.",
        "Modern hearing aids can significantly improve your hearing in challenging listening situations.",
      ]
    case "moderate-loss":
      return [
        firstRecommendation,
        "We strongly recommend scheduling an appointment with our audiologists for a complete evaluation.",
        "Hearing aids are highly recommended and can dramatically improve your quality of life.",
        "Our audiologists can help you find the perfect hearing solution tailored to your lifestyle.",
        "Don't delay - addressing hearing loss early leads to better outcomes and adaptation.",
      ]
    case "severe-loss":
      return [
        firstRecommendation,
        "Please schedule an appointment with our audiologists as soon as possible for a comprehensive evaluation.",
        "Advanced hearing aid technology or cochlear implants may be appropriate solutions for you.",
        "Untreated hearing loss can lead to social isolation and cognitive decline - early treatment is crucial.",
        "We offer free consultations and can help you explore all available treatment options.",
        "Our team specializes in severe hearing loss and can provide the support you need.",
      ]
  }
}

export function generateHearingTips(): string[] {
  return [
    "Protect Your Ears: Use earplugs or earmuffs in noisy environments (concerts, construction sites, loud machinery).",
    "Lower the Volume: Keep personal audio devices at 60% volume or lower and take listening breaks every hour.",
    "Maintain Ear Hygiene: Keep ears clean and dry. Never insert cotton swabs deep into the ear canal.",
    "Exercise Regularly: Good cardiovascular health improves blood flow to the ears and supports hearing health.",
    "Eat a Balanced Diet: Foods rich in omega-3 fatty acids, vitamins A, C, and E support ear health.",
    "Avoid Smoking: Smoking restricts blood flow to the ears and increases risk of hearing loss.",
    "Manage Stress: Chronic stress can affect hearing. Practice relaxation techniques and get adequate sleep.",
    "Regular Check-ups: Schedule annual hearing tests, especially if you're over 50 or work in noisy environments.",
    "Stay Alert to Warning Signs: Ringing in ears (tinnitus), muffled sounds, or difficulty understanding speech warrant immediate attention.",
    "Use Assistive Devices: Don't hesitate to use hearing aids if recommended - they significantly improve quality of life.",
  ]
}
