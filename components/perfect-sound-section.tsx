"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Volume2, VolumeX } from "lucide-react"
import { useRef, useState } from "react"

export function PerfectSoundSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!videoRef.current.muted === false) // React state opposite of muted
    }
  }

  return (
    <section className="relative bg-gradient-to-b from-background to-muted/30 py-20 md:py-28">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
          {/* Left Column - Text and Buttons */}
          <div className="space-y-8">
            {/* Title with highlight */}
            <div className="space-y-3">
              <h2 className="text-4xl font-bold md:text-5xl">
                Experience Life in <span className="text-primary">Perfect Sound</span>
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
              Advanced hearing solutions tailored to your lifestyle. Rediscover the joy of clear conversations and the
              sounds you love.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Link href="/hearing-test">
                  Take Free Hearing Test
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg bg-transparent"
              >
                <Link href="/contact">Book Appointment</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Video with Controls */}
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            {/* Video Container */}
            <video ref={videoRef} className="w-full h-auto rounded-lg" autoPlay loop muted playsInline>
              <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HearingLife%20-%20Life-changing%20hearing%20care-h3aQVYoZ6JtJklhNIjUYY81E9WeMPi.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
