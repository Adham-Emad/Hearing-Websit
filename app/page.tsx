"use client"

import { MainNavigation } from "@/components/main-navigation"
import { HeroVideoSection } from "@/components/hero-video-section"
import { HearingCategoriesCarousel } from "@/components/hearing-categories-carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EditableText } from "@/components/editable-text"
import Link from "next/link"
import { Ear, Heart, Shield, Users, ArrowRight, CheckCircle2 } from "lucide-react"
import { productCategories, brands } from "@/lib/hearing-data"
import { getStoredProducts, getSiteContent, getStoredBrands, addBrand, deleteBrand } from "@/lib/content-store"
import { useEffect, useState } from "react"
import { useAdminMode } from "@/lib/admin-mode-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PerfectSoundSection } from "@/components/perfect-sound-section"

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [allBrands, setAllBrands] = useState<any[]>([])
  const [content, setContent] = useState(getSiteContent())
  const { isAdminMode } = useAdminMode()
  const [showAddBrandDialog, setShowAddBrandDialog] = useState(false)
  const [newBrand, setNewBrand] = useState({ name: "", description: "", logo: "" })

  useEffect(() => {
    const storedProducts = getStoredProducts()
    setAllProducts(storedProducts)

    const storedBrands = getStoredBrands()
    const mergedBrands = storedBrands.length > 0 ? storedBrands : brands
    setAllBrands(mergedBrands)

    setContent(getSiteContent())

    const handleStorageChange = () => {
      setContent(getSiteContent())
    }

    const handleContentUpdate = () => {
      window.location.reload()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("contentUpdated", handleContentUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("contentUpdated", handleContentUpdate)
    }
  }, [])

  const handleAddBrand = () => {
    if (newBrand.name && newBrand.description) {
      addBrand({
        id: Date.now().toString(),
        name: newBrand.name,
        description: newBrand.description,
        logo: newBrand.logo || "/placeholder.svg",
      })
      setNewBrand({ name: "", description: "", logo: "" })
      setShowAddBrandDialog(false)
      // Refresh brands
      const storedBrands = getStoredBrands()
      const mergedBrands = storedBrands.length > 0 ? storedBrands : brands
      setAllBrands(mergedBrands)
    }
  }

  const handleDeleteBrand = (brandId: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      deleteBrand(brandId)
      // Refresh brands
      const storedBrands = getStoredBrands()
      const mergedBrands = storedBrands.length > 0 ? storedBrands : brands
      setAllBrands(mergedBrands)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <MainNavigation />
      <HeroVideoSection />

      {/* Perfect Sound Section */}
      <PerfectSoundSection />

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl animate-fade-in-up">
              <EditableText contentKey="home.whyChoose.title" defaultValue="Why Choose Al-Barakat?" as="span" />
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in-up animation-delay-100">
              <EditableText
                contentKey="home.whyChoose.subtitle"
                defaultValue="Experience the difference with our comprehensive hearing care solutions"
                as="span"
                multiline
              />
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up cursor-pointer">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Ear className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  <EditableText contentKey="home.whyChoose.card1Title" defaultValue="Expert Audiologists" as="span" />
                </h3>
                <p className="text-muted-foreground">
                  <EditableText
                    contentKey="home.whyChoose.card1Description"
                    defaultValue="Certified professionals with years of experience in hearing care"
                    as="span"
                    multiline
                  />
                </p>
              </CardContent>
            </Card>
            <Card className="group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up animation-delay-100 cursor-pointer">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 transition-all duration-300 group-hover:bg-secondary/20 group-hover:scale-110">
                  <Shield className="h-6 w-6 text-secondary transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  <EditableText contentKey="home.whyChoose.card2Title" defaultValue="Trustworthy Solutions" as="span" />
                </h3>
                <p className="text-muted-foreground">
                  <EditableText
                    contentKey="home.whyChoose.card2Description"
                    defaultValue="We offer reliable and effective hearing solutions backed by scientific research."
                    as="span"
                    multiline
                  />
                </p>
              </CardContent>
            </Card>
            <Card className="group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up animation-delay-200 cursor-pointer">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                  <Heart className="h-6 w-6 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  <EditableText contentKey="home.whyChoose.card3Title" defaultValue="Customer Satisfaction" as="span" />
                </h3>
                <p className="text-muted-foreground">
                  <EditableText
                    contentKey="home.whyChoose.card3Description"
                    defaultValue="Our goal is to ensure you are completely satisfied with our services."
                    as="span"
                    multiline
                  />
                </p>
              </CardContent>
            </Card>
            <Card className="group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up animation-delay-300 cursor-pointer">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Users className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  <EditableText contentKey="home.whyChoose.card4Title" defaultValue="Community Support" as="span" />
                </h3>
                <p className="text-muted-foreground">
                  <EditableText
                    contentKey="home.whyChoose.card4Description"
                    defaultValue="Join our community of satisfied patients and share your hearing journey."
                    as="span"
                    multiline
                  />
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <EditableText contentKey="home.products.title" defaultValue="Our Products" as="span" />
            </h2>
            <p className="text-lg text-muted-foreground">
              <EditableText
                contentKey="home.products.subtitle"
                defaultValue="Discover a wide range of hearing aids and accessories designed to enhance your hearing experience."
                as="span"
                multiline
              />
            </p>
          </div>
          {allProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allProducts.slice(0, 6).map((product, index) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-xl font-semibold transition-colors duration-300 group-hover:text-primary">
                      {product.name}
                    </h3>
                    <p className="mb-4 text-muted-foreground line-clamp-2">{product.description}</p>
                    <Button asChild variant="link" className="p-0 text-primary hover:text-primary/80 group/btn">
                      <Link href={`/products/${product.id}`}>
                        <EditableText contentKey="home.products.learnMoreButton" defaultValue="Learn More" as="span" />{" "}
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {productCategories.slice(0, 6).map((category, index) => (
                <Card
                  key={category.id}
                  className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-xl font-semibold transition-colors duration-300 group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="mb-4 text-muted-foreground">{category.description}</p>
                    <Button asChild variant="link" className="p-0 text-primary hover:text-primary/80 group/btn">
                      <Link href={`/products/category/${category.id}`}>
                        <EditableText contentKey="home.products.learnMoreButton" defaultValue="Learn More" as="span" />{" "}
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg bg-transparent"
            >
              <Link href="/products">
                <EditableText contentKey="home.products.viewAllButton" defaultValue="View All Products" as="span" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Hearing Test Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <Card className="overflow-hidden bg-gradient-to-r from-primary to-secondary transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="mx-auto max-w-3xl text-center text-primary-foreground">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  <EditableText contentKey="home.hearingTest.title" defaultValue="Free Hearing Test" as="span" />
                </h2>
                <p className="mb-6 text-lg opacity-90">
                  <EditableText
                    contentKey="home.hearingTest.subtitle"
                    defaultValue="Assess your hearing health with our free, quick, and painless test."
                    as="span"
                    multiline
                  />
                </p>
                <ul className="mb-8 inline-flex flex-col gap-2 text-left">
                  <li className="flex items-center gap-2 animate-fade-in-up">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>
                      <EditableText contentKey="home.hearingTest.feature1" defaultValue="Accurate Results" as="span" />
                    </span>
                  </li>
                  <li className="flex items-center gap-2 animate-fade-in-up animation-delay-100">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>
                      <EditableText
                        contentKey="home.hearingTest.feature2"
                        defaultValue="Personalized Recommendations"
                        as="span"
                      />
                    </span>
                  </li>
                  <li className="flex items-center gap-2 animate-fade-in-up animation-delay-200">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>
                      <EditableText contentKey="home.hearingTest.feature3" defaultValue="No Obligation" as="span" />
                    </span>
                  </li>
                </ul>
                <div>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Link href="/hearing-test">
                      <EditableText contentKey="home.hearingTest.ctaButton" defaultValue="Take Test Now" as="span" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Hearing Categories Carousel */}
      <HearingCategoriesCarousel />

      <footer className="border-t bg-background py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                <EditableText contentKey="footer.companyName" defaultValue="Al-Barakat Hearing Care" as="span" />
              </h3>
              <p className="text-sm text-muted-foreground">
                <EditableText
                  contentKey="footer.companyDescription"
                  defaultValue="Your trusted partner in hearing health and wellness"
                  as="span"
                  multiline
                />
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">
                <EditableText contentKey="footer.quickLinksTitle" defaultValue="Quick Links" as="span" />
              </h4>
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
              <h4 className="mb-4 text-sm font-semibold">
                <EditableText contentKey="footer.resourcesTitle" defaultValue="Resources" as="span" />
              </h4>
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
              <h4 className="mb-4 text-sm font-semibold">
                <EditableText contentKey="footer.contactTitle" defaultValue="Contact" as="span" />
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{content.contact.phone}</li>
                <li>{content.contact.email}</li>
                <li>{content.contact.hours}</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              <EditableText
                contentKey="footer.copyright"
                defaultValue="© 2025 Al-Barakat Hearing Care Centers. All rights reserved."
                as="span"
              />
            </p>
          </div>
        </div>
      </footer>

      {/* Dialog for Adding Brand */}
      <Dialog open={showAddBrandDialog} onOpenChange={setShowAddBrandDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogDescription>Add a new trusted brand to your website</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                value={newBrand.name}
                onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                placeholder="Enter brand name"
              />
            </div>
            <div>
              <Label htmlFor="brandDescription">Description</Label>
              <Textarea
                id="brandDescription"
                value={newBrand.description}
                onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                placeholder="Enter brand description"
              />
            </div>
            <div>
              <Label htmlFor="brandLogo">Logo URL</Label>
              <Input
                id="brandLogo"
                value={newBrand.logo}
                onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })}
                placeholder="Enter logo URL (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBrandDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBrand}>Add Brand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}