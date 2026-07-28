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

function getTodayManila(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function getAicsStats(): Promise<AppStatsData> {
  const today = getTodayManila();
  try {
    const [amountRes, entriesRes] = await Promise.all([
      fetch("https://mswdo.lantapan.gov.ph/api/total-amount", { next: { revalidate: 3600 } }),
      fetch("https://mswdo.lantapan.gov.ph/api/total-entries", { next: { revalidate: 3600 } }),
    ]);

    const amountData = await amountRes.json() as { status: string; total_amount: number };
    const entriesData = await entriesRes.json() as { status: string; total_entries: number };

    return {
      lastUpdated: today,
      metrics: [
        {
          label: "Total Funding Disbursed",
          value: amountData.total_amount ?? null,
          type: "currency",
          icon: "₱",
          color: "gold",
        },
        {
          label: "Total Beneficiaries",
          value: entriesData.total_entries ?? null,
          type: "number",
          icon: "👥",
          color: "cyan",
        },
      ],
    };
  } catch {
    // Fallback to static data on error
    return (stats as StatsRecord)["aics"] ?? { lastUpdated: today, metrics: [] };
  }
}

export default async function AppStatsPage({ params }: { params: { slug: string } }) {
  const app = apps.find((a) => a.slug === params.slug);

  if (!app) {
    notFound();
  }

  let appStats: AppStatsData | null = null;

  if (params.slug === "aics") {
    appStats = await getAicsStats();
  } else {
    appStats = (stats as StatsRecord)[params.slug] ?? null;
  }

  return <AppStatsClient app={app} appStats={appStats} />;
}
