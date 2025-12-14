import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user preferences
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("favorite_genres, news_preferences")
      .eq("user_id", user.id)
      .single()

    // Fetch news from database (populated by a cron job or scheduled function)
    let query = supabase
      .from("book_news")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(20)

    // Filter by user preferences if available
    if (preferences?.favorite_genres && preferences.favorite_genres.length > 0) {
      // Filter by tags that match user's favorite genres
      query = query.contains("tags", preferences.favorite_genres)
    }

    const { data: news, error } = await query

    if (error) throw error

    return NextResponse.json({
      news: news || [],
      preferences: preferences?.favorite_genres || []
    })
  } catch (error: any) {
    console.error("Error fetching news:", error)
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    )
  }
}

