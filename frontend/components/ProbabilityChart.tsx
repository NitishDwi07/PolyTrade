"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProbabilityPoint } from "@/lib/mockData";

type ProbabilityChartProps = {
  data: ProbabilityPoint[];
};

export function ProbabilityChart({ data }: ProbabilityChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -20, right: 8, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="yesGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#73FBD3" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#73FBD3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis dataKey="time" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={12} />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
            stroke="#94a3b8"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              background: "#101521",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
              color: "#f8fafc",
            }}
            formatter={(value) => [`${value}%`, "YES probability"]}
          />
          <Area
            type="monotone"
            dataKey="yes"
            stroke="#73FBD3"
            strokeWidth={3}
            fill="url(#yesGradient)"
            dot={{ r: 3, fill: "#73FBD3", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
