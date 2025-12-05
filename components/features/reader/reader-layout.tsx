"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Bookmark, Highlighter, MessageSquare } from "lucide-react"
import Link from "next/link"
import React, { useState, useEffect, ReactElement } from "react"
import { ReaderSettings } from "@/components/features/reader/reader-settings"
import { createBrowserClient } from "@supabase/ssr"

interface ReaderLayoutProps {
    children: ReactElement;
    title: string;
    bookId: string;
    userId: string;
}

export function ReaderLayout({ children, title, bookId, userId }: ReaderLayoutProps) {
    const [showSettings, setShowSettings] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [highlightMode, setHighlightMode] = useState(false)
    const [readerTheme, setReaderTheme] = useState<'light' | 'dark' | 'sepia'>('light')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Load bookmark status
    useEffect(() => {
        const loadBookmark = async () => {
            const { data } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('book_id', bookId)
                .eq('user_id', userId)
                .single();

            setIsBookmarked(!!data);
        };
        loadBookmark();
    }, [bookId, userId]);

    const handleBookmark = async () => {
        if (isBookmarked) {
            // Remove bookmark
            await supabase
                .from('bookmarks')
                .delete()
                .eq('book_id', bookId)
                .eq('user_id', userId);
            setIsBookmarked(false);
        } else {
            // Add bookmark
            await supabase
                .from('bookmarks')
                .insert({
                    book_id: bookId,
                    user_id: userId,
                    created_at: new Date().toISOString()
                });
            setIsBookmarked(true);
        }
    }

    const handleHighlight = () => {
        setHighlightMode(!highlightMode)
        console.log(highlightMode ? "Highlight mode off" : "Highlight mode on")
    }

    const handleNotes = () => {
        console.log("Open notes for this book")
    }

    const handleThemeChange = (theme: 'light' | 'dark' | 'sepia') => {
        setReaderTheme(theme);
    };

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
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBookmark}
                        className={isBookmarked ? "text-primary" : ""}
                    >
                        <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleHighlight}
                        className={highlightMode ? "text-primary bg-primary/10" : ""}
                    >
                        <Highlighter className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNotes}
                    >
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative">
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as ReactElement<any>, { readerTheme });
                    }
                    return child;
                })}
                {showSettings && (
                    <div className="absolute top-4 right-4 z-50">
                        <ReaderSettings onThemeChange={handleThemeChange} currentTheme={readerTheme} />
                    </div>
                )}
            </main>
        </div>
    )
}
