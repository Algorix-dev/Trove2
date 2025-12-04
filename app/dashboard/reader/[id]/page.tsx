import { ReaderLayout } from "@/components/features/reader/reader-layout"
import { PDFViewer } from "@/components/features/reader/pdf-viewer"

export default function ReaderPage({ params }: { params: { id: string } }) {
    // In a real app, fetch book details by ID
    // For now, assume it's a PDF
    return (
        <ReaderLayout title="The Great Gatsby">
            <PDFViewer fileUrl="/sample.pdf" />
        </ReaderLayout>
    )
}
