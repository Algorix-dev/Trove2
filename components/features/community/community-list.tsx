"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, MessageCircle, Search } from "lucide-react"
import { CommunityInviteModal } from "./community-invite-modal"

const communities = [
    {
        id: "1",
        name: "Science Fiction Lovers",
        description: "Discussing the best sci-fi novels, from classics to modern masterpieces.",
        members: 1234,
        activeUsers: 89,
    },
    {
        id: "2",
        name: "Mystery & Thriller Club",
        description: "For those who love a good whodunit and edge-of-your-seat suspense.",
        members: 892,
        activeUsers: 45,
    },
    {
        id: "3",
        name: "Fantasy Realm",
        description: "Epic adventures, magical worlds, and unforgettable characters.",
        members: 2156,
        activeUsers: 123,
    },
    {
        id: "4",
        name: "Non-Fiction Enthusiasts",
        description: "Real stories, biographies, and knowledge-expanding reads.",
        members: 567,
        activeUsers: 34,
    },
    {
        id: "5",
        name: "Classic Literature",
        description: "Timeless works that have shaped literature as we know it.",
        members: 445,
        activeUsers: 28,
    },
    {
        id: "6",
        name: "Young Adult Readers",
        description: "Coming-of-age stories and YA fiction that resonates with all ages.",
        members: 1678,
        activeUsers: 92,
    },
]

export function CommunityList() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredCommunities = communities.filter(community =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search communities..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Communities Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCommunities.length > 0 ? (
                    filteredCommunities.map((community) => (
                        <Card key={community.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-start justify-between">
                                    <span>{community.name}</span>
                                </CardTitle>
                                <CardDescription>{community.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{community.members.toLocaleString()} members</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="h-4 w-4" />
                                        <span>{community.activeUsers} active</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button className="flex-1">Join Discussion</Button>
                                    <CommunityInviteModal
                                        communityId={community.id}
                                        communityName={community.name}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">No communities found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    )
}
