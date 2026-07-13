import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import HeroSection from "../home/HeroSection";
import MissionSection from "../home/MissionSection";
import StatsSection from "../home/StatsSection";
import ProblemSection from "../home/ProblemSection";
import SolutionSection from "../home/SolutionSection";
import ComparisonSection from "../home/ComparisonSection";
import ApplicationsSection from "../home/ApplicationsSection";
import ResearchSection from "../home/ResearchSection";
import TechnologySection from "../home/TechnologySection";
import ResourcesSection from "../home/ResourcesSection";
import DashboardPreview from "../home/DashboardPreview";
import ContactSection from "../home/ContactSection";
import Footer from "../layout/Footer";

function HomeScreen() {
  const location = useLocation();

  // Listen to hash transitions on landing
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = id === "home" ? document.getElementById("hero") : document.getElementById(id);
      if (el) {
        // Delay scroll slightly to allow React page layout render
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Mission */}
      <MissionSection />

      {/* Statistics */}
      <StatsSection />

      {/* Problem & Solution */}
      <ProblemSection />
      <SolutionSection />

      {/* Before vs After Split Compare */}
      <ComparisonSection />

      {/* Applications */}
      <ApplicationsSection />

      {/* Research & Tech */}
      <ResearchSection />
      <TechnologySection />

      {/* Resources & SDKs */}
      <ResourcesSection />

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Contact Operations */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default HomeScreen;