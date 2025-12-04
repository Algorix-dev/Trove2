"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function LandingHero() {
    return (
        <section className="py-20 md:py-32 px-6 flex flex-col items-center text-center overflow-hidden relative">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl space-y-6"
            >
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    Your Personal <span className="text-primary">Reading Companion</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Track your reading progress, take insightful notes, and build a lasting reading habit.
                    Upload your own e-books and read anywhere.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href="/signup">
                        <Button size="lg" className="gap-2">
                            Start Reading Now <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="outline" size="lg">
                            Learn More
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </section>
    )
}
