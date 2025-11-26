"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { branches } from "@/lib/branches-data"
import { MapPin, Map, ArrowRight, Ear } from "lucide-react"
import { Card } from "@/components/ui/card"

export interface CustomerData {
  name: string
  age: string
  gender: string
  mobile: string
  email: string
  address: string
  branchId: string
  selectedBranch?: (typeof branches)[0]
}

interface CustomerDataModalProps {
  open: boolean
  onComplete: (data: CustomerData) => void
}

export function CustomerDataModal({ open, onComplete }: CustomerDataModalProps) {
  const [step, setStep] = useState<"form" | "branch-map">("form")
  const [formData, setFormData] = useState<CustomerData>({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    email: "",
    address: "",
    branchId: "",
  })

  const [selectedBranch, setSelectedBranch] = useState<string>("")

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContinueToMap = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, age, gender, mobile, email } = formData

    if (!name || !age || !gender || !mobile || !email) {
      alert("Please fill in all required fields")
      return
    }

    setStep("branch-map")
  }

  const handleSelectBranch = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId)
    if (branch) {
      setFormData((prev) => ({
        ...prev,
        branchId,
        address: `${branch.name}, ${branch.address}`,
        selectedBranch: branch,
      }))
      setSelectedBranch(branchId)
    }
  }

  const handleViewMap = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId)
    if (branch) {
      const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(branch.address)}+${encodeURIComponent(branch.city)}`
      window.open(googleMapsUrl, "_blank")
    }
  }

  const handleComplete = () => {
    if (!selectedBranch) {
      alert("Please select a branch")
      return
    }
    onComplete(formData)
  }

  const handleBackToForm = () => {
    setStep("form")
  }

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl p-0 border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10">
          {step === "form" ? (
            <>
              {/* Header with icon */}
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-8 py-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Ear className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Hearing Test</h2>
                </div>
                <p className="text-blue-100 text-sm">Help us personalize your experience</p>
              </div>

              {/* Form content */}
              <form onSubmit={handleContinueToMap} className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Name field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300 font-semibold text-sm">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Age field */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-slate-300 font-semibold text-sm">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      required
                      placeholder="30"
                      min="1"
                      max="150"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Gender field */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-slate-300 font-semibold text-sm">
                      Gender
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger
                        id="gender"
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20"
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="male" className="text-white focus:bg-blue-600">
                          Male
                        </SelectItem>
                        <SelectItem value="female" className="text-white focus:bg-blue-600">
                          Female
                        </SelectItem>
                        <SelectItem value="other" className="text-white focus:bg-blue-600">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mobile field */}
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-slate-300 font-semibold text-sm">
                      Mobile Number
                    </Label>
                    <Input
                      id="mobile"
                      type="tel"
                      required
                      placeholder="+966 XX XXX XXXX"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 font-semibold text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                {/* Continue button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold py-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Continue to Branch Selection
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-xs text-slate-400 text-center">* All fields are required</p>
              </form>
            </>
          ) : (
            <>
              {/* Branch selection header */}
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-8 py-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Select Your Branch</h2>
                <p className="text-blue-100 text-sm">Choose the location nearest to you</p>
              </div>

              {/* Branch cards */}
              <div className="p-8 space-y-4 max-h-96 overflow-y-auto">
                {branches.map((branch) => (
                  <Card
                    key={branch.id}
                    onClick={() => handleSelectBranch(branch.id)}
                    className={`cursor-pointer transition-all duration-300 border-0 overflow-hidden group ${
                      selectedBranch === branch.id
                        ? "bg-gradient-to-r from-blue-600/20 to-teal-500/20 ring-2 ring-blue-500 scale-105"
                        : "bg-slate-700/30 hover:bg-slate-700/50 hover:scale-102"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                            {branch.city}
                          </h3>
                          <p className="text-sm text-slate-300">{branch.name}</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewMap(branch.id)
                          }}
                          className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10"
                        >
                          <Map className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm text-slate-300">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-teal-400" />
                          <span>{branch.address}</span>
                        </div>
                        <p className="text-xs text-slate-400">📞 {branch.phone}</p>
                        <p className="text-xs text-slate-400">🕐 {branch.hours}</p>
                      </div>

                      {selectedBranch === branch.id && (
                        <div className="mt-3 p-2 bg-blue-500/20 rounded-lg text-xs font-semibold text-blue-300 flex items-center gap-2">
                          ✓ Selected
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Action buttons */}
              <div className="border-t border-slate-700 px-8 py-6 flex gap-3 bg-slate-900/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToForm}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!selectedBranch}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold transition-all duration-300"
                >
                  Start Hearing Test
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
