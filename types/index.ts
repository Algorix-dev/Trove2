export interface User {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
}

export interface Book {
    id: string
    user_id: string
    title: string
    author: string
    cover_url?: string
    file_url: string
    format: 'pdf' | 'epub' | 'txt'
    total_pages?: number
    created_at: string
}

export interface ReadingProgress {
    id: string
    user_id: string
    book_id: string
    current_page: number
    progress_percentage: number
    last_read_at: string
}

export interface ReadingSession {
    id: string
    user_id: string
    book_id: string
    start_time: string
    end_time?: string
    duration_minutes: number
}

export interface Note {
    id: string
    user_id: string
    book_id: string
    highlight_id?: string
    content: string
    created_at: string
}

export interface Highlight {
    id: string
    user_id: string
    book_id: string
    cfi_range: string // For EPUB
    page_rect?: string // For PDF
    color: string
    text: string
    created_at: string
}

export interface Community {
    id: string
    name: string
    description: string
    created_at: string
}

export interface Post {
    id: string
    community_id: string
    user_id: string
    content: string
    created_at: string
}
