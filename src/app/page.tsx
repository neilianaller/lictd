import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AppDashboard from "@/components/scroll-experience/AppDashboard";
import TeamSection from "@/components/scroll-experience/TeamSection";
import HeritageSection from "@/components/scroll-experience/HeritageSection";
import CertificationsSection from "@/components/scroll-experience/CertificationsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-void">
      <Navbar />
      <HeroSection />
      <AppDashboard />
      <TeamSection />
      <HeritageSection />
      <CertificationsSection />
    </main>
  );
}
