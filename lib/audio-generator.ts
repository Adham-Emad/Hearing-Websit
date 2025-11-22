export class AudiometryToneGenerator {
  private audioContext: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private gainNode: GainNode | null = null
  private pannerNode: StereoPannerNode | null = null
  private currentFrequency = 1000
  private currentVolume = 0.5
  private isLooping = false
  private currentEar: "left" | "right" | "both" = "both"

  constructor() {
    if (typeof window !== "undefined") {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  startLoopingTone(frequency: number, volume: number, ear: "left" | "right" | "both" = "both"): void {
    if (!this.audioContext) return

    // Stop any existing tone
    this.stopTone()

    // Create oscillator for pure tone
    this.oscillator = this.audioContext.createOscillator()
    this.gainNode = this.audioContext.createGain()
    this.pannerNode = this.audioContext.createStereoPanner()

    this.oscillator.type = "sine" // Pure sine wave for audiometry
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

    let adjustedVolume = volume
    if (frequency < 50) {
      adjustedVolume = Math.min(1, volume * 4.0) // Very significant boost for very low frequencies
    } else if (frequency < 100) {
      adjustedVolume = Math.min(1, volume * 3.0) // Significant boost for 50 Hz
    } else if (frequency <= 250) {
      adjustedVolume = Math.min(1, volume * 2.0) // Medium boost for low frequencies
    }

    // Set volume
    this.gainNode.gain.setValueAtTime(adjustedVolume, this.audioContext.currentTime)

    const panValue = ear === "left" ? -1 : ear === "right" ? 1 : 0
    this.pannerNode.pan.setValueAtTime(panValue, this.audioContext.currentTime)

    console.log(
      `[v0] Audio panning set to: ${panValue} for ${ear} ear, frequency: ${frequency}Hz, volume: ${adjustedVolume}`,
    )

    // Connect nodes with panner
    this.oscillator.connect(this.gainNode)
    this.gainNode.connect(this.pannerNode)
    this.pannerNode.connect(this.audioContext.destination)

    // Start tone (will loop indefinitely)
    this.oscillator.start()

    // Store current settings
    this.currentFrequency = frequency
    this.currentVolume = volume
    this.currentEar = ear
    this.isLooping = true
  }

  async playTone(
    frequency: number,
    volume: number,
    duration = 2000,
    ear: "left" | "right" | "both" = "both",
  ): Promise<void> {
    if (!this.audioContext) return

    // Stop any existing tone
    this.stopTone()

    // Create oscillator for pure tone
    this.oscillator = this.audioContext.createOscillator()
    this.gainNode = this.audioContext.createGain()
    this.pannerNode = this.audioContext.createStereoPanner()

    this.oscillator.type = "sine" // Pure sine wave for audiometry
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

    let adjustedVolume = volume
    if (frequency < 50) {
      adjustedVolume = Math.min(1, volume * 4.0) // Very significant boost for very low frequencies
    } else if (frequency < 100) {
      adjustedVolume = Math.min(1, volume * 3.0) // Significant boost for 50 Hz
    } else if (frequency <= 250) {
      adjustedVolume = Math.min(1, volume * 2.0) // Medium boost for low frequencies
    }

    // Set volume
    this.gainNode.gain.setValueAtTime(adjustedVolume, this.audioContext.currentTime)

    const panValue = ear === "left" ? -1 : ear === "right" ? 1 : 0
    this.pannerNode.pan.setValueAtTime(panValue, this.audioContext.currentTime)

    console.log(
      `[v0] Audio panning set to: ${panValue} for ${ear} ear, frequency: ${frequency}Hz, volume: ${adjustedVolume}`,
    )

    // Connect nodes with panner
    this.oscillator.connect(this.gainNode)
    this.gainNode.connect(this.pannerNode)
    this.pannerNode.connect(this.audioContext.destination)

    // Start tone
    this.oscillator.start()

    // Store current settings
    this.currentFrequency = frequency
    this.currentVolume = volume
    this.currentEar = ear

    // Auto-stop after duration
    return new Promise((resolve) => {
      setTimeout(() => {
        this.stopTone()
        resolve()
      }, duration)
    })
  }

  stopTone(): void {
    this.isLooping = false
    if (this.oscillator) {
      try {
        this.oscillator.stop()
        this.oscillator.disconnect()
      } catch (e) {
        // Oscillator may already be stopped
      }
      this.oscillator = null
    }
    if (this.gainNode) {
      this.gainNode.disconnect()
      this.gainNode = null
    }
    if (this.pannerNode) {
      this.pannerNode.disconnect()
      this.pannerNode = null
    }
  }

  setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume))
    if (this.gainNode && this.audioContext) {
      const currentTime = this.audioContext.currentTime
      let adjustedVolume = this.currentVolume
      if (this.currentFrequency < 50) {
        adjustedVolume = Math.min(1, this.currentVolume * 4.0) // Very significant boost for very low frequencies
      } else if (this.currentFrequency < 100) {
        adjustedVolume = Math.min(1, this.currentVolume * 3.0) // Significant boost for 50 Hz
      } else if (this.currentFrequency <= 250) {
        adjustedVolume = Math.min(1, this.currentVolume * 2.0) // Medium boost for low frequencies
      }
      // Ensure we never set volume to exactly 0 (causes issues with exponential ramp)
      const targetVolume = Math.max(0.001, adjustedVolume)
      this.gainNode.gain.exponentialRampToValueAtTime(targetVolume, currentTime + 0.05)
    }
  }

  getVolume(): number {
    return this.currentVolume
  }

  getIsLooping(): boolean {
    return this.isLooping
  }

  cleanup(): void {
    this.stopTone()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}
