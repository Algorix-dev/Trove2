import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        try {
            const supabase = await createClient()

            // Exchange code for session
            const { data, error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error('Auth callback error:', error)
                return NextResponse.redirect(`${origin}/login?error=auth_failed`)
            }

            if (data.session) {
                // Session is automatically set in cookies by the Supabase client
                console.log('Session established successfully')
                return NextResponse.redirect(`${origin}/dashboard`)
            }
        } catch (error) {
            console.error('Auth callback exception:', error)
            return NextResponse.redirect(`${origin}/login?error=callback_failed`)
        }
    }

    // No code present, redirect to login
    return NextResponse.redirect(`${origin}/login`)
}
