"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sun, Moon, Monitor } from "lucide-react"
import { useState } from "react"

export function ReaderSettings() {
    const [fontSize, setFontSize] = useState([100])
    const [readerTheme, setReaderTheme] = useState<'light' | 'dark' | 'sepia'>('light')

    const handleFontSizeChange = (value: number[]) => {
        setFontSize(value)
        // TODO: Apply font size to reader
        console.log(`Font size: ${value[0]}%`)
    }

    const handleThemeChange = (theme: 'light' | 'dark' | 'sepia') => {
        setReaderTheme(theme)
        // TODO: Apply theme to reader
        console.log(`Reader theme: ${theme}`)
    }

    return (
        <Card className="w-72 shadow-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm">Reader Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium">Font Size: {fontSize[0]}%</label>
                    <Slider
                        value={fontSize}
                        onValueChange={handleFontSizeChange}
                        max={200}
                        min={50}
                        step={10}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium">Theme</label>
                    <div className="flex gap-2">
                        <Button
                            variant={readerTheme === 'light' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1"
                            onClick={() => handleThemeChange('light')}
                        >
                            <Sun className="h-4 w-4 mr-2" /> Light
                        </Button>
                        <Button
                            variant={readerTheme === 'dark' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1"
                            onClick={() => handleThemeChange('dark')}
                        >
                            <Moon className="h-4 w-4 mr-2" /> Dark
                        </Button>
                        <Button
                            variant={readerTheme === 'sepia' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1"
                            onClick={() => handleThemeChange('sepia')}
                        >
                            <Monitor className="h-4 w-4" /> Sepia
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
