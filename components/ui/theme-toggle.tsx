"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            setCurrentTheme(resolvedTheme)
        }
    }, [mounted, resolvedTheme])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="relative">
                <Moon className="h-5 w-5" />
            </Button>
        )
    }

    const isDark = currentTheme === "dark"

    const toggleTheme = () => {
        // Use View Transition API for smooth animated theme change
        if ('startViewTransition' in document) {
            (document as any).startViewTransition(() => {
                setTheme(isDark ? "light" : "dark")
            })
        } else {
            // Fallback for browsers without View Transition API
            setTheme(isDark ? "light" : "dark")
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative"
        >
            {isDark ? (
                <Sun className="h-5 w-5 transition-transform duration-200 hover:rotate-12" />
            ) : (
                <Moon className="h-5 w-5 transition-transform duration-200 hover:-rotate-12" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
