import { CommunityList } from "@/components/features/community/community-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CommunityPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Community</h2>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Create Group
                </Button>
            </div>
            <CommunityList />
        </div>
    )
}
