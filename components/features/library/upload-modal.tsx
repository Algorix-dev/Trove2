"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Upload } from "lucide-react"

export function UploadModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Upload className="h-4 w-4" /> Upload Book
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Book</DialogTitle>
                    <DialogDescription>
                        Drag and drop your PDF, EPUB, or TXT file here.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground">Click to select or drag file here</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
