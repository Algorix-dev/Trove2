"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuth } from "@/components/providers/auth-provider"

export function LandingNavbar() {
    const { user, loading } = useAuth()

    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50" role="navigation" aria-label="Main navigation">
            <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
                <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="text-xl font-bold tracking-tight">Trove</span>
            </Link>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                {loading ? (
                    <Button variant="ghost" disabled>
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </Button>
                ) : user ? (
                    <Link href="/dashboard" aria-label="Go to dashboard">
                        <Button>Dashboard</Button>
                    </Link>
                ) : (
                    <>
                        <Link href="/login" aria-label="Sign in to your account">
                            <Button variant="ghost">Sign In</Button>
                        </Link>
                        <Link href="/signup" aria-label="Create a new account">
                            <Button>Get Started</Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
