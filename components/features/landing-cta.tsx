"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LandingCTA() {
    return (
        <section className="py-20 px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Ready to transform your reading life?
                </h2>
                <p className="text-lg text-muted-foreground">
                    Join thousands of readers who are building better habits with Trove.
                </p>
                <Link href="/signup">
                    <Button size="lg" className="mt-4">
                        Get Started for Free
                    </Button>
                </Link>
            </div>
        </section>
    )
}
