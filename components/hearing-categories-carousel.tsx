"use client"

import type React from "react"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Category {
  id: string
  title: string
  description: string
  image: string
  href: string
  icon?: React.ReactNode
}

const categories: Category[] = [
  {
    id: "phonak",
    title: "Phonak Hearing Aids",
    description:
      "Discover Phonak's advanced hearing aids engineered to support every level of hearing loss and enhance your listening experience with cutting-edge technology.",
    image: "/images/ph-packshot-virto-titanium-iic-f22-su0-right-pb-1440x1440.avif",
    href: "/products",
  },
  {
    id: "hearing-test",
    title: "Online Hearing Test",
    description:
      "Take our quick online hearing assessment to get a snapshot of your hearing health from home. Receive professional recommendations based on your results in minutes.",
    image: "/images/packshot-sky-m-sp-hook-q7-050-0756-m7-1920x1920.avif",
    href: "/hearing-test",
  },
  {
    id: "hearing-provider",
    title: "Find a Hearing Care Provider",
    description:
      "Connect with our network of certified audiologists and hearing care specialists who will evaluate your hearing and help you choose the right solution for your needs.",
    image: "/images/pandahearingaidselite-2.webp",
    href: "/services",
  },
  {
    id: "slim-design",
    title: "Slim & Discrete Design",
    description:
      "Experience nearly invisible hearing aids with our slim design collection. Enjoy powerful performance without the visible bulk, perfect for those seeking discretion.",
    image: "/images/ph-packshot-slim-l-r-050-0851-6-a-1920x1920.avif",
    href: "/products/category/slim",
  },
  {
    id: "custom-fit",
    title: "Custom Fit Solutions",
    description:
      "Our custom-fit hearing aids are molded specifically to your ear for optimal comfort and performance. Personalized hearing care at its best.",
    image: "/images/cq5dam.jpeg",
    href: "/products/category/custom",
  },
  {
    id: "rechargeables",
    title: "Rechargeable Hearing Aids",
    description:
      "Say goodbye to battery changes. Our rechargeable hearing aids provide all-day power with convenient charging solutions for modern lifestyles.",
    image: "/images/ph-packshot-charger-combi-bte-with-sky-m-pr-075-0062.avif",
    href: "/products/category/rechargeable",
  },
  {
    id: "wireless",
    title: "Wireless Connectivity",
    description:
      "Stream directly from your smartphone, TV, and other devices. Experience seamless wireless connectivity with our latest hearing aid technology.",
    image: "/images/rs-rt-custom-line-up-scaled.jpg",
    href: "/products",
  },
  {
    id: "support",
    title: "Lifetime Support",
    description:
      "Enjoy comprehensive support throughout your hearing journey. From fitting and adjustments to maintenance, we're here for you every step of the way.",
    image: "/images/bte-2-main-prod-2-2000x2000.jpg",
    href: "/contact",
  },
]

export function HearingCategoriesCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleCategoryClick = (href: string) => {
    router.push(href)
  }

  return (
    <section className="bg-gradient-to-b from-background via-muted/30 to-background py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Our Hearing Solutions</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore our comprehensive range of hearing care services and cutting-edge hearing aid technologies designed
            to enhance your quality of life.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Scroll Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/80 shadow-lg transition-all hover:bg-white hover:scale-110 backdrop-blur"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Scrollable Container */}
          <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide" style={{ scrollBehavior: "smooth" }}>
            <div className="flex gap-6 pb-4">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex-shrink-0 w-80 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border border-muted hover:border-primary/50">
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden bg-muted">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    {/* Content Container */}
                    <CardContent className="flex flex-col p-6">
                      <button
                        onClick={() => handleCategoryClick(category.href)}
                        className="mb-3 text-left text-xl font-semibold transition-colors duration-300 hover:text-primary group-hover:text-primary cursor-pointer"
                      >
                        {category.title}
                      </button>
                      <p className="line-clamp-3 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground flex-grow">
                        {category.description}
                      </p>
                      <button
                        onClick={() => handleCategoryClick(category.href)}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-3"
                      >
                        Learn More
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Right Scroll Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/80 shadow-lg transition-all hover:bg-white hover:scale-110 backdrop-blur"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
