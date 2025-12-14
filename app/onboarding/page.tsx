"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { BookOpen, ArrowRight, ArrowLeft, Sparkles, Heart, Star, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

const GENRES = [
  "Fiction", "Non-Fiction", "Mystery", "Romance", "Science Fiction",
  "Fantasy", "Biography", "History", "Self-Help", "Business",
  "Philosophy", "Poetry", "Horror", "Thriller", "Young Adult",
  "Manga", "Comics", "Anime", "Educational", "Technical"
]

const STEPS = [
  { id: 1, title: "Welcome", description: "Let's personalize your Trove experience" },
  { id: 2, title: "Your Name", description: "What should we call you?" },
  { id: 3, title: "Your Interests", description: "What genres do you love?" },
  { id: 4, title: "Favorite Books", description: "Tell us about books you've enjoyed" },
  { id: 5, title: "All Set!", description: "Ready to start your reading journey" }
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [nickname, setNickname] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([])
  const [bookInput, setBookInput] = useState("")

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single()

    if (profile?.onboarding_completed) {
      router.push("/dashboard")
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const addFavoriteBook = () => {
    if (bookInput.trim() && !favoriteBooks.includes(bookInput.trim())) {
      setFavoriteBooks([...favoriteBooks, bookInput.trim()])
      setBookInput("")
    }
  }

  const removeFavoriteBook = (book: string) => {
    setFavoriteBooks(favoriteBooks.filter(b => b !== book))
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Update profile with nickname and onboarding status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          nickname,
          onboarding_completed: true,
          username: nickname.toLowerCase().replace(/\s+/g, "_") || user.email?.split("@")[0]
        })
        .eq("id", user.id)

      if (profileError) throw profileError

      // Save preferences
      const { error: prefsError } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          favorite_genres: selectedGenres,
          favorite_books: favoriteBooks,
          updated_at: new Date().toISOString()
        })

      if (prefsError) throw prefsError

      toast.success("Welcome to Trove! 🎉")
      router.push("/dashboard/tutorial")
    } catch (error: any) {
      toast.error(error.message || "Failed to complete onboarding")
    } finally {
      setLoading(false)
    }
  }

  const progress = (currentStep / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <BookOpen className="w-8 h-8 text-primary" />
            </motion.div>
            <div>
              <CardTitle className="text-3xl mb-2">
                {STEPS[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-base">
                {STEPS[currentStep - 1].description}
              </CardDescription>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {STEPS.length}
            </p>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold">Welcome to Trove!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your personal library awaits. Let's set up your profile so we can recommend
                    the perfect books and keep you updated on what matters to you.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-primary" />
                      <span>Personalized Recommendations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-primary" />
                      <span>Track Your Progress</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span>Discover New Books</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="nickname"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="nickname" className="text-base">
                      What should we call you?
                    </Label>
                    <Input
                      id="nickname"
                      placeholder="Enter your nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="mt-2"
                      autoFocus
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      This will be displayed on your dashboard
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="genres"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <Label className="text-base">Select genres you love (select multiple)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
                    {GENRES.map((genre) => (
                      <motion.button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedGenres.includes(genre)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-muted hover:border-primary/50"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {genre}
                      </motion.button>
                    ))}
                  </div>
                  {selectedGenres.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {selectedGenres.length} genre{selectedGenres.length !== 1 ? "s" : ""} selected
                    </p>
                  )}
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="books"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <Label className="text-base">Tell us about books you've enjoyed</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter book title (optional)"
                      value={bookInput}
                      onChange={(e) => setBookInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addFavoriteBook()}
                    />
                    <Button onClick={addFavoriteBook} type="button" variant="outline">
                      Add
                    </Button>
                  </div>
                  {favoriteBooks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {favoriteBooks.map((book) => (
                        <motion.div
                          key={book}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          <span>{book}</span>
                          <button
                            onClick={() => removeFavoriteBook(book)}
                            className="hover:text-destructive"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    This helps us recommend similar books. You can skip this step.
                  </p>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6 text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-semibold">You're All Set!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your Trove is ready. Let's take a quick tour to show you around.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || loading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {currentStep < STEPS.length ? (
                <Button onClick={handleNext} disabled={loading}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={loading || !nickname.trim()}>
                  {loading ? "Setting up..." : "Complete Setup"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

