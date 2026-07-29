import apps from "@/data/apps.json";
import stats from "@/data/stats.json";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import AppStatsClient from "./AppStatsClient";

type Metric = {
  label: string;
  value: string | number | null;
  type: "currency" | "number" | "string" | "date" | "bar-chart";
  icon: string;
  color: string;
  chartData?: Record<string, number>;
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
    const [entriesAllRes, entriesYearRes, entriesPerYearRes, amountAllRes, amountYearRes, amountMonthlyRes] = await Promise.all([
      fetch("https://mswdo.lantapan.gov.ph/api/total-entries", { next: { revalidate: 3600 } }),
      fetch("https://mswdo.lantapan.gov.ph/api/total-entries-year", { next: { revalidate: 3600 } }),
      fetch("https://mswdo.lantapan.gov.ph/api/total-entries-per-year", { next: { revalidate: 3600 } }),
      fetch("https://mswdo.lantapan.gov.ph/api/total-amount", { next: { revalidate: 3600 } }),
      fetch("https://mswdo.lantapan.gov.ph/api/total-amount-year", { next: { revalidate: 3600 } }),
      fetch("https://mswdo.lantapan.gov.ph/api/total-amount-year-monthly", { next: { revalidate: 3600 } }),
    ]);

    const entriesAll = await entriesAllRes.json() as { status: string; total_entries: number };
    const entriesYear = await entriesYearRes.json() as { status: string; year: number; total_entries: number };
    const entriesPerYear = await entriesPerYearRes.json() as { status: string; start_year: number; data: { year: string, total_entries: string }[] };
    const amountAll = await amountAllRes.json() as { status: string; total_amount: number };
    const amountYear = await amountYearRes.json() as { status: string; year: number; total_amount: number };
    const amountMonthly = await amountMonthlyRes.json() as { status: string; year: number; monthly: Record<string, number> };

    const yearlyEntriesChartData: Record<string, number> = {};
    if (entriesPerYear.data && Array.isArray(entriesPerYear.data)) {
      const dataToShow = entriesPerYear.data.slice(-10); // Show up to last 10 entries for UI breathing room
      dataToShow.forEach(d => {
        yearlyEntriesChartData[d.year] = parseInt(d.total_entries, 10);
      });
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyAmountChartData: Record<string, number> = {};
    if (amountMonthly.monthly) {
      for (let i = 1; i <= 12; i++) {
        monthlyAmountChartData[monthNames[i - 1]] = amountMonthly.monthly[i.toString()] || 0;
      }
    }

    return {
      lastUpdated: today,
      metrics: [
        {
          label: "Total Funding Disbursed (All Time)",
          value: amountAll.total_amount ?? null,
          type: "currency",
          icon: "₱",
          color: "gold",
        },
        {
          label: `Funding Disbursed (${amountYear.year || new Date().getFullYear()})`,
          value: amountYear.total_amount ?? null,
          type: "currency",
          icon: "💰",
          color: "green",
        },
        {
          label: "Total Beneficiaries (All Time)",
          value: entriesAll.total_entries ?? null,
          type: "number",
          icon: "👥",
          color: "cyan",
        },
        {
          label: `Total Beneficiaries (${entriesYear.year || new Date().getFullYear()})`,
          value: entriesYear.total_entries ?? null,
          type: "number",
          icon: "📅",
          color: "blue",
        },
        {
          label: `Monthly Funding Disbursed (${amountMonthly.year || new Date().getFullYear()})`,
          value: null,
          type: "bar-chart",
          icon: "📊",
          color: "gold",
          chartData: monthlyAmountChartData,
        },
        {
          label: "Yearly Beneficiaries",
          value: null,
          type: "bar-chart",
          icon: "📈",
          color: "cyan",
          chartData: yearlyEntriesChartData,
        }
      ],
    };
  } catch {
    return (stats as StatsRecord)["aics"] ?? { lastUpdated: today, metrics: [] };
  }
}

async function getConnectStats(): Promise<AppStatsData> {
  const today = getTodayManila();
  try {
    const [allTimeRes, yearRes, monthlyRes] = await Promise.all([
      fetch("https://connect.lantapan.gov.ph/api/total-clients", { next: { revalidate: 3600 } }),
      fetch("https://connect.lantapan.gov.ph/api/total-clients-year", { next: { revalidate: 3600 } }),
      fetch("https://connect.lantapan.gov.ph/api/total-clients-monthly", { next: { revalidate: 3600 } }),
    ]);

    const allTime = await allTimeRes.json() as { data: { total_clients: number } };
    const yearData = await yearRes.json() as { year: string, data: { total_clients_year: number } };
    const monthlyData = await monthlyRes.json() as { year: string, data: Record<string, number> };

    return {
      lastUpdated: today,
      metrics: [
        {
          label: "Clients Served (All Time)",
          value: allTime.data.total_clients ?? null,
          type: "number",
          icon: "👥",
          color: "cyan",
        },
        {
          label: `Clients Served (${yearData.year || new Date().getFullYear()})`,
          value: yearData.data.total_clients_year ?? null,
          type: "number",
          icon: "📅",
          color: "green",
        },
        {
          label: `Monthly Clients (${monthlyData.year || new Date().getFullYear()})`,
          value: null,
          type: "bar-chart",
          icon: "📊",
          color: "gold",
          chartData: monthlyData.data,
        }
      ],
    };
  } catch {
    return (stats as StatsRecord)["connectv2"] ?? { lastUpdated: today, metrics: [] };
  }
}

async function getBuksuStats(): Promise<AppStatsData> {
  const today = getTodayManila();
  try {
    const [allTimeRes, yearRes, perYearRes] = await Promise.all([
      fetch("https://buksu.lantapan.gov.ph/api/total-posts", { next: { revalidate: 3600 } }),
      fetch("https://buksu.lantapan.gov.ph/api/total-posts-year", { next: { revalidate: 3600 } }),
      fetch("https://buksu.lantapan.gov.ph/api/total-posts-per-year", { next: { revalidate: 3600 } }),
    ]);

    const allTime = await allTimeRes.json() as { status: string; total_posts: number };
    const yearData = await yearRes.json() as { status: string; year: number; total_posts: number };
    const perYear = await perYearRes.json() as { status: string; data: { year: string; total_posts: string }[] };

    const perYearChartData: Record<string, number> = {};
    if (perYear.data && Array.isArray(perYear.data)) {
      perYear.data.slice(-10).forEach(d => {
        perYearChartData[d.year] = parseInt(d.total_posts, 10);
      });
    }

    return {
      lastUpdated: today,
      metrics: [
        {
          label: "Total Posts (All Time)",
          value: allTime.total_posts ?? null,
          type: "number",
          icon: "📰",
          color: "cyan",
        },
        {
          label: `Total Posts (${yearData.year || new Date().getFullYear()})`,
          value: yearData.total_posts ?? null,
          type: "number",
          icon: "📅",
          color: "green",
        },
        {
          label: "Posts Per Year",
          value: null,
          type: "bar-chart",
          icon: "📊",
          color: "gold",
          chartData: perYearChartData,
        },
      ],
    };
  } catch {
    return (stats as StatsRecord)["buksu"] ?? { lastUpdated: today, metrics: [] };
  }
}

async function getPwdStats(): Promise<AppStatsData> {
  const today = getTodayManila();
  try {
    const res = await fetch("https://pwd.lantapan.gov.ph/api/public/stats", { next: { revalidate: 3600 } });
    const data = await res.json() as {
      totalRecords: number;
      totalActiveRegistrants: number;
      totalRegisteredCurrentYear: number;
      totalRegisteredPerYear: { year: number; count: number }[];
      totalRegisteredPerBarangay: { barangay: string; count: number }[];
    };

    const currentYear = new Date().getFullYear();

    const perYearChart: Record<string, number> = {};
    if (Array.isArray(data.totalRegisteredPerYear)) {
      data.totalRegisteredPerYear.slice(-10).forEach(d => {
        perYearChart[String(d.year)] = d.count;
      });
    }

    const perBarangayChart: Record<string, number> = {};
    if (Array.isArray(data.totalRegisteredPerBarangay)) {
      data.totalRegisteredPerBarangay.forEach(d => {
        perBarangayChart[d.barangay] = d.count;
      });
    }

    return {
      lastUpdated: today,
      metrics: [
        {
          label: "Total Records",
          value: data.totalRecords ?? null,
          type: "number",
          icon: "👥",
          color: "cyan",
        },
        {
          label: "Active Registrants",
          value: data.totalActiveRegistrants ?? null,
          type: "number",
          icon: "✅",
          color: "green",
        },
        {
          label: `Registered in ${currentYear}`,
          value: data.totalRegisteredCurrentYear ?? null,
          type: "number",
          icon: "📅",
          color: "gold",
        },
        {
          label: "Registered Per Year",
          value: null,
          type: "bar-chart",
          icon: "📊",
          color: "cyan",
          chartData: perYearChart,
        },
        {
          label: "Registered Per Barangay",
          value: null,
          type: "bar-chart",
          icon: "🏘️",
          color: "gold",
          chartData: perBarangayChart,
        },
      ],
    };
  } catch {
    return (stats as StatsRecord)["pwd"] ?? { lastUpdated: today, metrics: [] };
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
  } else if (params.slug === "connectv2") {
    appStats = await getConnectStats();
  } else if (params.slug === "buksu") {
    appStats = await getBuksuStats();
  } else if (params.slug === "pwd") {
    appStats = await getPwdStats();
  } else {
    appStats = (stats as StatsRecord)[params.slug] ?? null;
  }

  return <AppStatsClient app={app} appStats={appStats} />;
}
