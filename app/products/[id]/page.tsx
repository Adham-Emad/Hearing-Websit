import { MainNavigation } from "@/components/main-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Check, Phone, Calendar } from "lucide-react"
import { products, brands } from "@/lib/hearing-data"
import { getStoredProducts } from "@/lib/content-store"
import { notFound } from "next/navigation"
import { ProductImageViewer } from "@/components/product-image-viewer"

// FIX: Force dynamic rendering to prevent SSR issues related to data or environment
export const dynamic = "force-dynamic"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const storedProducts = getStoredProducts()
  const allProducts = [...products, ...storedProducts]
  const product = allProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const brand = brands.find((b) => b.id === product.brand)

  return (
    <div className="min-h-screen">
      <MainNavigation />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="overflow-hidden rounded-lg">
            <ProductImageViewer src={product.image || "/placeholder.svg"} alt={product.name} />
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary" className="text-base">
                {brand?.name || "Unknown Brand"}
              </Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <h1 className="mb-4 text-4xl font-bold">{product.name}</h1>
            <p className="mb-6 text-lg text-muted-foreground">{product.description}</p>

            <div className="mb-6">
              <p className="text-2xl font-semibold text-primary">{product.price}</p>
            </div>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="flex-1">
                <Link href="/booking">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Consultation
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="flex-1 bg-transparent">
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
            </div>

            {product.features && product.features.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-semibold">Key Features</h2>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {product.specifications && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="mb-4 text-2xl font-semibold">Specifications</h2>
                  <dl className="space-y-3">
                    {product.specifications.batteryLife && (
                      <div className="flex justify-between">
                        <dt className="font-medium">Battery Life:</dt>
                        <dd className="text-muted-foreground">{product.specifications.batteryLife}</dd>
                      </div>
                    )}
                    {product.specifications.connectivity && (
                      <div className="flex justify-between">
                        <dt className="font-medium">Connectivity:</dt>
                        <dd className="text-muted-foreground">{product.specifications.connectivity}</dd>
                      </div>
                    )}
                    {product.specifications.waterResistance && (
                      <div className="flex justify-between">
                        <dt className="font-medium">Water Resistance:</dt>
                        <dd className="text-muted-foreground">{product.specifications.waterResistance}</dd>
                      </div>
                    )}
                    {product.specifications.colors && product.specifications.colors.length > 0 && (
                      <div className="flex justify-between">
                        <dt className="font-medium">Available Colors:</dt>
                        <dd className="text-muted-foreground">{product.specifications.colors.join(", ")}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h4 className="mb-4 text-xl font-bold">Al-Barakat</h4>
              <p className="text-sm text-muted-foreground">Advanced Hearing Solutions</p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-muted-foreground hover:text-foreground">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/hearing-test" className="text-muted-foreground hover:text-foreground">
                    Hearing Test
                  </Link>
                </li>
                <li>
                  <Link href="/hearing-health" className="text-muted-foreground hover:text-foreground">
                    Hearing Health
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
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