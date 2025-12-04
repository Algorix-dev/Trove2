"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, MoreVertical } from "lucide-react"
import Link from "next/link"

const books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", progress: 25, cover: null },
    { id: 2, title: "1984", author: "George Orwell", progress: 0, cover: null },
    { id: 3, title: "Pride and Prejudice", author: "Jane Austen", progress: 100, cover: null },
    { id: 4, title: "To Kill a Mockingbird", author: "Harper Lee", progress: 10, cover: null },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", progress: 0, cover: null },
]

export function BookGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
                <Link href={`/dashboard/reader/${book.id}`} key={book.id}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                        <CardContent className="p-4">
                            <div className="aspect-[2/3] bg-muted rounded-md mb-4 flex items-center justify-center relative overflow-hidden">
                                {/* Placeholder for cover */}
                                <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                                    Read Now
                                </div>
                            </div>
                            <h3 className="font-semibold truncate" title={book.title}>{book.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 block">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>{book.progress}%</span>
                            </div>
                            <Progress value={book.progress} className="h-1" />
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
