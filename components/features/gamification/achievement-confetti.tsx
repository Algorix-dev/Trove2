"use client"

import { useEffect, useState } from "react"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"
import { createBrowserClient } from "@supabase/ssr"

interface AchievementConfettiProps {
    duration?: number
}

export function AchievementConfetti({ duration = 5000 }: AchievementConfettiProps) {
    const { width, height } = useWindowSize()
    const [show, setShow] = useState(false)
    const [achievements, setAchievements] = useState<string[]>([])

    // Check for unnotified achievements
    useEffect(() => {
        const checkAchievements = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get session storage key for this user
            const sessionKey = `confetti_shown_${user.id}`
            const shownAchievements = JSON.parse(sessionStorage.getItem(sessionKey) || '[]')

            // 1. Get unnotified achievements
            const { data: newAchievements } = await supabase
                .from('user_achievements')
                .select('id, achievement_id, achievements(name)')
                .eq('user_id', user.id)
                .eq('notified', false)

            if (newAchievements && newAchievements.length > 0) {
                // Filter out achievements that have already been shown in this session
                const achievementsToShow = newAchievements.filter(
                    ua => !shownAchievements.includes(ua.id)
                )

                if (achievementsToShow.length > 0) {
                    setShow(true)
                    const names = achievementsToShow.map((ua: any) => ua.achievements?.name || "New Achievement")
                    setAchievements(names)

                    // 2. Mark as notified in database
                    const ids = achievementsToShow.map(ua => ua.id)
                    await supabase
                        .from('user_achievements')
                        .update({ notified: true })
                        .in('id', ids)

                    // 3. Store in session storage to prevent re-showing
                    const updatedShown = [...shownAchievements, ...ids]
                    sessionStorage.setItem(sessionKey, JSON.stringify(updatedShown))
                }
            }
        }

        checkAchievements()
        // Check every 30 seconds for new achievements (optional - can be removed if not needed)
        const interval = setInterval(checkAchievements, 30000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => setShow(false), duration)
            return () => clearTimeout(timer)
        }
    }, [show, duration])

    if (!show) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            <Confetti
                width={width}
                height={height}
                numberOfPieces={200}
                recycle={false}
                gravity={0.2}
            />
            {/* Optional: Toast or popup for specific achievement names could go here or handled by global toaster */}
        </div>
    )
}
