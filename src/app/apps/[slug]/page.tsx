import apps from "@/data/apps.json";
import stats from "@/data/stats.json";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import AppStatsClient from "./AppStatsClient";

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

  // Type assertion for our generic JSON to allow indexing by string
  const appStats = (stats as Record<string, any>)[params.slug] || null;

  return <AppStatsClient app={app} appStats={appStats} />;
}
