"use client";

import dynamic from "next/dynamic";

const PerformanceChart = dynamic(
  () => import("./performance-chart"),
  {
    ssr: false,
  }
);

export default function PerformanceChartWrapper({ assessments }) {
  return <PerformanceChart assessments={assessments} />;
}