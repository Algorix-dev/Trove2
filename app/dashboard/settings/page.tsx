import { SettingsForm } from "@/components/features/settings/settings-form"

export default function SettingsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>
            <SettingsForm />
        </div>
    )
}
