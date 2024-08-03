"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Sample data for the statistics
const totalUsers = 1000;
const paidSubscribers = 250;
const premiumPercentage = ((paidSubscribers / totalUsers) * 100).toFixed(2);

// Data for the bar chart
const chartData = [
  { name: "Total Users", value: totalUsers },
  { name: "Paid Subscribers", value: paidSubscribers },
  { name: "Premium Percentage", value: premiumPercentage },
];

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function StatisticsChart() {
  return (
    <Card className="bg-[#f9fafb] text-black w-full">
      <CardHeader className="bg-[#003654] text-white p-4 rounded-t-lg">
        <CardTitle className="text-base font-semibold">User Statistics</CardTitle>
        <CardDescription className="text-sm">Statistics for the user base</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#4a5568" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#4a5568" }} />
            <ChartTooltip
              cursor={{ fill: '#edf2f7' }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="#0080C7" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xs p-4">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-gray-500">
          Showing user statistics
        </div>
      </CardFooter>
    </Card>
  )
}

export default StatisticsChart;
