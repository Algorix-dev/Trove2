"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts"

const dailyData = [
    { name: "Mon", minutes: 45 },
    { name: "Tue", minutes: 30 },
    { name: "Wed", minutes: 60 },
    { name: "Thu", minutes: 25 },
    { name: "Fri", minutes: 45 },
    { name: "Sat", minutes: 90 },
    { name: "Sun", minutes: 60 },
]

const formatData = [
    { name: "PDF", value: 400 },
    { name: "EPUB", value: 300 },
    { name: "TXT", value: 100 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const trendData = [
    { name: "Week 1", minutes: 200 },
    { name: "Week 2", minutes: 250 },
    { name: "Week 3", minutes: 180 },
    { name: "Week 4", minutes: 300 },
]

export function AnalyticsCharts() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Daily Reading Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dailyData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}m`} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="minutes" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Reading Formats</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={formatData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {formatData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 text-sm text-muted-foreground mt-4">
                        {formatData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle>Monthly Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}m`} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="minutes" stroke="currentColor" strokeWidth={2} className="stroke-primary" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
