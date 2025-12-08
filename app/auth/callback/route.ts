import { createBrowserClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error('Auth callback error:', error)
                return NextResponse.redirect(`${origin}/login?error=auth_failed`)
            }

            // Session is now stored client-side automatically
            console.log('Session established successfully')
            return NextResponse.redirect(`${origin}/dashboard`)
        } catch (error) {
            console.error('Auth callback exception:', error)
            return NextResponse.redirect(`${origin}/login?error=callback_failed`)
        }
    }

    return NextResponse.redirect(`${origin}/login`)
}
