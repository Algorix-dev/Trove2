"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlayCircle } from "lucide-react"

export function ContinueReading() {
    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Continue Reading</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
                <div className="h-32 w-24 bg-muted rounded-md flex-shrink-0" /> {/* Placeholder for book cover */}
                <div className="flex flex-col justify-between flex-1">
                    <div>
                        <h3 className="text-lg font-semibold">The Great Gatsby</h3>
                        <p className="text-sm text-muted-foreground">F. Scott Fitzgerald</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Page 45 of 180</span>
                            <span>25%</span>
                        </div>
                        <Progress value={25} className="h-2" />
                        <Button size="sm" className="w-fit gap-2 mt-2">
                            <PlayCircle className="h-4 w-4" /> Continue
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
