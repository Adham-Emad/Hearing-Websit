"use client"

import { MainNavigation } from "@/components/main-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { products as staticProducts, productCategories, brands } from "@/lib/hearing-data"
import { getStoredProducts } from "@/lib/content-store"
import { useEffect, useState } from "react"

export default function CategoryPage({ params }: { params: { categoryId: string } }) {
  const [allProducts, setAllProducts] = useState<any[]>(staticProducts)

  useEffect(() => {
    const storedProducts = getStoredProducts()
    setAllProducts([...staticProducts, ...storedProducts])
  }, [])

  const category = productCategories.find((c) => c.id === params.categoryId)
  const categoryProducts = allProducts.filter((p) => p.category === params.categoryId)

  if (!category) {
    return (
      <div className="min-h-screen">
        <MainNavigation />
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <h1 className="text-3xl font-bold text-center">Category not found</h1>
          <div className="text-center mt-4">
            <Button asChild>
              <Link href="/products">Back to Products</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <MainNavigation />

      {/* Hero Section */}
      <section className="border-b bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl animate-fade-in-up">{category.name}</h1>
            <p className="text-lg text-muted-foreground animate-fade-in-up animation-delay-100">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          {categoryProducts.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-muted-foreground">
                  Showing {categoryProducts.length} product{categoryProducts.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryProducts.map((product, index) => (
                  <Card
                    key={product.id}
                    className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="secondary" className="transition-all duration-300 group-hover:scale-105">
                          {brands.find((b) => b.id === product.brand)?.name || product.brand}
                        </Badge>
                        <Badge variant="outline" className="transition-all duration-300 group-hover:scale-105">
                          {product.category}
                        </Badge>
                      </div>
                      <h3 className="mb-2 text-xl font-semibold transition-colors duration-300 group-hover:text-primary">
                        {product.name}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">{product.price}</span>
                        <Button asChild variant="link" className="p-0 text-primary hover:text-primary/80 group/btn">
                          <Link href={`/products/${product.id}`}>
                            Learn More{" "}
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No products found in this category.</p>
              <Button asChild>
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

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
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/hearing-test"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    Hearing Test
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hearing-health"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    Hearing Health
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+20 1021454545</li>
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
