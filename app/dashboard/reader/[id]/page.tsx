import { ReaderLayout } from "@/components/features/reader/reader-layout"
import { PDFViewer } from "@/components/features/reader/pdf-viewer"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: book } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()

    if (!book) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Book not found</h1>
                <p className="text-muted-foreground">The book you're looking for doesn't exist or you don't have access to it.</p>
            </div>
        </div>
    }

    // Get signed URL for the file
    const { data } = await supabase.storage
        .from('books')
        .createSignedUrl(book.file_url, 3600) // 1 hour expiry

    return (
        <ReaderLayout title={book.title}>
            <PDFViewer fileUrl={data?.signedUrl || ""} />
        </ReaderLayout>
    )
}
