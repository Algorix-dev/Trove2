"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function LandingNavbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold tracking-tight">Trove</span>
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                    <Button>Get Started</Button>
                </Link>
            </div>
        </nav>
    )
}
