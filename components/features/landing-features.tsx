"use client"

import { motion } from "framer-motion"
import { Upload, BarChart3, Highlighter, Users, BookOpen, Clock } from "lucide-react"

const features = [
    {
        icon: Upload,
        title: "Upload Your Library",
        description: "Bring your own books. Support for PDF, EPUB, and TXT formats.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: BarChart3,
        title: "Detailed Analytics",
        description: "Visualize your reading habits with daily, weekly, and monthly charts.",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: Highlighter,
        title: "Notes & Highlights",
        description: "Mark important passages and keep your thoughts organized per book.",
        gradient: "from-amber-500 to-orange-500",
    },
    {
        icon: Clock,
        title: "Track Progress",
        description: "Automatically track reading time, pages read, and build your streak.",
        gradient: "from-green-500 to-emerald-500",
    },
    {
        icon: Users,
        title: "Join Communities",
        description: "Discuss books with like-minded readers in focused groups.",
        gradient: "from-rose-500 to-red-500",
    },
    {
        icon: BookOpen,
        title: "Distraction-Free Reader",
        description: "A clean, customizable reading experience designed for focus.",
        gradient: "from-indigo-500 to-purple-500",
    },
]

export function LandingFeatures() {
    return (
        <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to read better</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Trove gives you the tools to manage your library, track your habits, and engage with your books.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="group relative bg-card p-6 rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Gradient background on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                            {/* Icon with gradient */}
                            <div className={`relative mb-4 w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} p-2.5 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="h-full w-full text-white" />
                            </div>

                            <h3 className="text-xl font-semibold mb-2 relative">{feature.title}</h3>
                            <p className="text-muted-foreground relative">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
