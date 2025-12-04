"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Bookmark, Highlighter, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ReaderSettings } from "@/components/features/reader/reader-settings"

interface ReaderLayoutProps {
    children: React.ReactNode
    title: string
}

export function ReaderLayout({ children, title }: ReaderLayoutProps) {
    const [showSettings, setShowSettings] = useState(false)

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <header className="h-14 border-b flex items-center justify-between px-4 bg-background z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/library">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="font-semibold truncate max-w-[200px] md:max-w-md">{title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Bookmark className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Highlighter className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative">
                {children}
                {showSettings && (
                    <div className="absolute top-4 right-4 z-50">
                        <ReaderSettings />
                    </div>
                )}
            </main>
        </div>
    )
}
