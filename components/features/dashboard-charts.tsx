"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
    { name: "Mon", minutes: 45 },
    { name: "Tue", minutes: 30 },
    { name: "Wed", minutes: 60 },
    { name: "Thu", minutes: 25 },
    { name: "Fri", minutes: 45 },
    { name: "Sat", minutes: 90 },
    { name: "Sun", minutes: 60 },
]

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                <p className="text-sm font-medium">{payload[0].payload.name}</p>
                <p className="text-sm text-primary font-bold">{payload[0].value} minutes</p>
            </div>
        );
    }
    return null;
};

export function DashboardCharts() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Weekly Reading Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}m`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                        <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
