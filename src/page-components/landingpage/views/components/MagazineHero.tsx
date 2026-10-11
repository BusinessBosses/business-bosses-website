"use client";
import React from "react";
import Box from "@mui/material/Box";
import AppAppBar from "./AppAppBar";
import Footer from "./Footer";
import { useRouter } from "../../../../common/hooks/useAppNavigation";
import RoutesPath from "../../../../constants/Routes";
import MagazineHeader from "./magazine/MagazineHeader";
import MagazineSectionsHighlight from "./magazine/MagazineSectionsHighlight";
import MagazineSpotlight from "./magazine/MagazineSpotlight";
import MagazineArchive from "./magazine/MagazineArchive";
import MagazineCtaBanner from "./magazine/MagazineCtaBanner";

interface MagazineIssue {
  id: string;
  title: string;
  issue_number?: string;
  description?: string;
  cover_image_url?: string;
  pdf_url: string;
  publish_date: string;
}

export default function MagazineHero() {
  const router = useRouter();
  const [magazines, setMagazines] = React.useState<MagazineIssue[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://orca-app-5dg8w.ondigitalocean.app/api/v1";
    fetch(`${apiUrl}/magazines`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          setMagazines(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching magazines:", err);
        setLoading(false);
      });
  }, []);

  const latestIssue = magazines.length > 0 ? magazines[0] : null;

  return (
    <Box sx={{ width: "100%", backgroundColor: "#FFFFFF", color: "#0F172A", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppAppBar mode="light" toggleColorMode={() => {}} />

      {/* 1. Header Section */}
      <MagazineHeader
        onReadLatest={() => {
          if (latestIssue?.pdf_url) {
            window.open(latestIssue.pdf_url, "_blank");
          }
        }}
        onGetFeatured={() => router.push(RoutesPath.applyFeatured)}
      />

      {/* 2. Five Sections Highlight */}
      <MagazineSectionsHighlight />

      {/* 3. Featured Spotlight */}
      <MagazineSpotlight latestIssue={latestIssue} />

      {/* 4. Issue Archive Grid */}
      <MagazineArchive magazines={magazines} />

      {/* 5. Bottom Dark CTA Banner */}
      <MagazineCtaBanner onGetFeatured={() => router.push(RoutesPath.applyFeatured)} />

      {/* Footer */}
      <Footer />
    </Box>
  );
}
