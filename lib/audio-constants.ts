// Reference threshold: 50 dB SPL (standardized starting level for audiometry)
// Web Audio API gain ranges from 0 to 1, where:
// - 0.001 ≈ 20 dB SPL (barely audible)
// - 0.1 ≈ 60 dB SPL (normal conversation)
// - 1.0 ≈ 100+ dB SPL (very loud)

export const AUDIOMETRY_STARTING_DB = 50
export const DB_TO_GAIN_CONVERSION = {
  20: 0.001, // Threshold of hearing
  30: 0.003,
  40: 0.01,
  50: 0.032, // Standard starting level for pure tone audiometry
  60: 0.1,
  70: 0.316,
  80: 1.0,
}

export function dbToGain(dB: number): number {
  // Linear interpolation for dB to gain conversion
  // Formula: gain = 10^(dB/20) normalized to 0-1 range
  const minDb = 20
  const maxDb = 80
  const clampedDb = Math.max(minDb, Math.min(maxDb, dB))

  // Convert dB to gain using standard formula
  // This maps 20dB -> 0.001 and 80dB -> 1.0
  const normalizedDb = (clampedDb - minDb) / (maxDb - minDb)
  return Math.pow(10, (normalizedDb * 60) / 20) * 0.001
}

export function gainToDb(gain: number): number {
  // Reverse conversion from gain back to dB
  const minDb = 20
  const maxDb = 80
  const normalizedGain = Math.max(0.001, Math.min(1, gain))
  const db = 20 * Math.log10(normalizedGain / 0.001) + minDb
  return Math.max(minDb, Math.min(maxDb, db))
}
