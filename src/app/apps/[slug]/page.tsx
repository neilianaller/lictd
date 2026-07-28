import apps from "@/data/apps.json";
import stats from "@/data/stats.json";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import AppStatsClient from "./AppStatsClient";

type Metric = {
  label: string;
  value: string | number | null;
  type: "currency" | "number" | "string" | "date";
  icon: string;
  color: string;
};

type AppStatsData = {
  lastUpdated: string;
  metrics: Metric[];
};

type StatsRecord = Record<string, AppStatsData>;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const app = apps.find((a) => a.slug === params.slug);
  if (!app) return { title: "App Not Found" };
  return {
    title: `${app.name} - LICTD Systems Hub`,
    description: `Statistics and information for ${app.name} developed by ${app.developer}.`,
  };
}

export default function AppStatsPage({ params }: { params: { slug: string } }) {
  const app = apps.find((a) => a.slug === params.slug);

  if (!app) {
    notFound();
  }

  const appStats = (stats as StatsRecord)[params.slug] || null;

  return <AppStatsClient app={app} appStats={appStats} />;
}
