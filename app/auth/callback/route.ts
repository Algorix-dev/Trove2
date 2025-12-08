import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    },
                },
            }
        )

        try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error('Auth callback error:', error)
                return NextResponse.redirect(`${origin}/login?error=auth_failed`)
            }

            if (data.session) {
                console.log('Session established successfully')

                // Create response with redirect
                const response = NextResponse.redirect(`${origin}/dashboard`)

                // Manually set session cookies in response
                const sessionCookies = [
                    {
                        name: `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL!.split('//')[1].split('.')[0]}-auth-token`,
                        value: JSON.stringify({
                            access_token: data.session.access_token,
                            refresh_token: data.session.refresh_token,
                            expires_at: data.session.expires_at,
                            expires_in: data.session.expires_in,
                            token_type: data.session.token_type,
                            user: data.session.user
                        }),
                        options: {
                            path: '/',
                            maxAge: 60 * 60 * 24 * 7, // 7 days
                            sameSite: 'lax' as const,
                            secure: process.env.NODE_ENV === 'production'
                        }
                    }
                ]

                sessionCookies.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options)
                })

                return response
            }
        } catch (error) {
            console.error('Auth callback exception:', error)
            return NextResponse.redirect(`${origin}/login?error=callback_failed`)
        }
    }

    return NextResponse.redirect(`${origin}/login`)
}
