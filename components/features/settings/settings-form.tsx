"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Bell, Mail, Upload, X } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRef } from "react"

export function SettingsForm() {
    const [fullName, setFullName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [dailyGoal, setDailyGoal] = useState(30)
    const [loading, setLoading] = useState(false)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [inAppNotifications, setInAppNotifications] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { user } = useAuth()
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        if (user) {
            setEmail(user.email || "")
            // Fetch profile data
            const fetchProfile = async () => {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('full_name, username, daily_goal_minutes')
                        .eq('id', user.id)
                        .single()

                    if (error) {
                        console.error('Error fetching profile:', error)
                        toast.error('Failed to load profile data')
                        return
                    }

                    if (data) {
                        setFullName(data.full_name || user.user_metadata?.full_name || "")
                        setUsername(data.username || "")
                        setDailyGoal(data.daily_goal_minutes || 30)
                        setAvatarUrl(data.avatar_url || user.user_metadata?.avatar_url || null)
                    }
                } catch (error) {
                    console.error('Unexpected error fetching profile:', error)
                    toast.error('An unexpected error occurred')
                }
            }
            fetchProfile()
        }
    }, [user, supabase])

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !event.target.files || event.target.files.length === 0) return

        const file = event.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Math.random()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        // Validate file
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB")
            return
        }

        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
            toast.error("Please upload an image file (JPEG, PNG, WebP, or GIF)")
            return
        }

        setUploading(true)
        try {
            // Delete old avatar if exists
            if (avatarUrl) {
                const oldPath = avatarUrl.split('/').pop()
                if (oldPath) {
                    await supabase.storage.from('avatars').remove([oldPath])
                }
            }

            // Upload new avatar
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id)

            if (updateError) throw updateError

            setAvatarUrl(publicUrl)
            toast.success("Profile picture updated!")
            router.refresh()
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Failed to upload avatar")
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveAvatar = async () => {
        if (!user || !avatarUrl) return

        setUploading(true)
        try {
            const oldPath = avatarUrl.split('/').pop()
            if (oldPath) {
                await supabase.storage.from('avatars').remove([oldPath])
            }

            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('id', user.id)

            if (error) throw error

            setAvatarUrl(null)
            toast.success("Profile picture removed")
            router.refresh()
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Failed to remove avatar")
        } finally {
            setUploading(false)
        }
    }

    const handleSaveProfile = async () => {
        if (!user) return

        setLoading(true)
        try {
            // Update profile in profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    username: username || null,
                    daily_goal_minutes: dailyGoal
                })
                .eq('id', user.id)

            if (profileError) throw profileError

            // Update email in auth if changed
            if (email !== user.email) {
                const { error: authError } = await supabase.auth.updateUser({
                    email: email
                })
                if (authError) throw authError
            }

            router.refresh()
            toast.success("Profile updated successfully!")
        } catch (error: any) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <Label>Profile Picture</Label>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={avatarUrl || undefined} alt={fullName || "User"} />
                                <AvatarFallback className="text-lg">
                                    {fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploading ? "Uploading..." : "Upload"}
                                </Button>
                                {avatarUrl && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRemoveAvatar}
                                        disabled={uploading}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Upload a profile picture (max 5MB). JPG, PNG, WebP, or GIF.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter a unique username"
                        />
                        <p className="text-xs text-muted-foreground">
                            This will be displayed on your dashboard greeting.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        <p className="text-xs text-muted-foreground">
                            Changing your email will require verification
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveProfile} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Reading Goals</CardTitle>
                    <CardDescription>Set your daily reading targets.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Daily Goal</Label>
                            <span className="font-medium">{dailyGoal} minutes</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">15m</span>
                            <input
                                type="range"
                                min="15"
                                max="120"
                                step="5"
                                value={dailyGoal}
                                onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                aria-label="Daily reading goal in minutes"
                                aria-valuemin={15}
                                aria-valuemax={120}
                                aria-valuenow={dailyGoal}
                            />
                            <span className="text-xs text-muted-foreground">120m</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Aim to read for at least {dailyGoal} minutes every day to build your streak.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive updates and reminders.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5 flex-1">
                            <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-muted-foreground" />
                                <Label>In-App Notifications</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Get notified about streaks, achievements, and reading milestones
                            </p>
                        </div>
                        <Switch
                            checked={inAppNotifications}
                            onCheckedChange={setInAppNotifications}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5 flex-1">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <Label>Email Updates (Coming Soon)</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Receive weekly reading summaries and motivational messages
                            </p>
                        </div>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                            disabled
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
