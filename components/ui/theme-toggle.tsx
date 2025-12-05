"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const isDark = resolvedTheme === "dark"

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
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
