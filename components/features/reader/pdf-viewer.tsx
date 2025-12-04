"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PDFViewer({ fileUrl }: { fileUrl: string }) {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const numPages = 180; // Placeholder

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto flex justify-center p-8 bg-muted/30">
                <div className="bg-white shadow-2xl rounded-lg p-12 max-w-2xl w-full">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">PDF Reader</h2>
                        <p className="text-gray-600">
                            This is a placeholder for the PDF viewer. In a production app, you would integrate
                            a PDF library like react-pdf or pdf.js here.
                        </p>
                        <div className="bg-gray-100 p-8 rounded-md text-center">
                            <p className="text-gray-500">Page {pageNumber} content would appear here</p>
                        </div>
                        <p className="text-sm text-gray-500">File: {fileUrl}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="h-16 border-t bg-background flex items-center justify-center gap-4 px-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                    Page {pageNumber} of {numPages}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                    disabled={pageNumber >= numPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
