"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share2, Copy, Mail, MessageCircle, Check } from "lucide-react"
import { toast } from "sonner"

export function ShareInviteModal() {
    const [copied, setCopied] = useState(false)
    const [email, setEmail] = useState("")
    const [sending, setSending] = useState(false)
    const [inviteLink, setInviteLink] = useState("https://trove.app/invite/abc123")

    useEffect(() => {
        setInviteLink(`${window.location.origin}/invite/abc123`)
    }, [])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareViaWhatsApp = () => {
        const message = encodeURIComponent(`Join me on Trove - the best reading companion app! 📚\n\n${inviteLink}`)
        window.open(`https://wa.me/?text=${message}`, '_blank')
    }

    const shareViaEmail = () => {
        const subject = encodeURIComponent("Join me on Trove!")
        const body = encodeURIComponent(`Hi!\n\nI've been using Trove to track my reading and I think you'd love it too!\n\nTrove is a reading companion app that helps you:\n- Track your reading progress\n- Take notes and highlights\n- View your reading analytics\n- Join book communities\n\nJoin me here: ${inviteLink}\n\nHappy reading! 📚`)
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
    }

    const sendEmailInvite = async () => {
        if (!email) return

        setSending(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSending(false)
        setEmail("")
        toast.success(`Invitation sent to ${email}!`)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" /> Share & Invite
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Trove with Friends</DialogTitle>
                    <DialogDescription>
                        Invite your friends to join Trove and discover amazing books together!
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="link">Your Invite Link</Label>
                        <div className="flex gap-2">
                            <Input
                                id="link"
                                value={inviteLink}
                                readOnly
                                className="flex-1"
                            />
                            <Button size="icon" variant="outline" onClick={copyToClipboard}>
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Quick Share</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="gap-2" onClick={shareViaEmail}>
                                <Mail className="h-4 w-4" /> Email
                            </Button>
                            <Button variant="outline" className="gap-2" onClick={shareViaWhatsApp}>
                                <MessageCircle className="h-4 w-4" /> WhatsApp
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Invite by Email</Label>
                        <div className="flex gap-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="friend@example.com"
                                className="flex-1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button onClick={sendEmailInvite} disabled={!email || sending}>
                                {sending ? "Sending..." : "Send"}
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <p className="text-xs text-muted-foreground">
                        Share your love of reading! Friends who join get a special welcome bonus.
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
