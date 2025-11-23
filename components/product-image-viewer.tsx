"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ZoomIn, ZoomOut, Move } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductImageViewerProps {
  src: string
  alt: string
}

export function ProductImageViewer({ src, alt }: ProductImageViewerProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const MIN_SCALE = 1
  const MAX_SCALE = 3

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, MAX_SCALE))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, MIN_SCALE))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    // Calculate boundaries
    const container = containerRef.current
    const maxX = (container.offsetWidth * (scale - 1)) / 2
    const maxY = (container.offsetHeight * (scale - 1)) / 2

    setPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.2 : 0.2
    setScale((prev) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev + delta)))
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg bg-gray-100 cursor-move"
      style={{ aspectRatio: "1 / 1" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <img
        ref={imageRef}
        src={src || "/placeholder.svg"}
        alt={alt}
        className="h-full w-full object-contain transition-transform duration-200"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        draggable={false}
      />

      {/* Controls overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomOut}
          disabled={scale <= MIN_SCALE}
          className="h-10 w-10 p-0"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <Button size="sm" variant="secondary" onClick={handleReset} className="h-10 px-3" title="Reset View">
          Reset
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomIn}
          disabled={scale >= MAX_SCALE}
          className="h-10 w-10 p-0"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <div className="ml-2 flex items-center rounded bg-white px-2 py-1 text-xs font-medium shadow">
          {Math.round(scale * 100)}%
        </div>
      </div>

      {/* Drag hint when zoomed */}
      {scale > 1 && (
        <div className="absolute top-4 left-4 flex items-center gap-2 rounded bg-white px-3 py-1 text-xs shadow">
          <Move className="h-3 w-3" />
          <span>Drag to pan</span>
        </div>
      )}
    </div>
  )
}
