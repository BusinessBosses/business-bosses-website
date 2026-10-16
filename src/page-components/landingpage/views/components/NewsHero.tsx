"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import AppAppBar from "./AppAppBar";
import Footer from "./Footer";
import NewsHeader from "./news/NewsHeader";
import NewsFeed, { NewsArticle } from "./news/NewsFeed";
import MemberNewsSection from "./news/MemberNewsSection";
import PressAndNewsletterSection from "./news/PressAndNewsletterSection";
import SubmitNewsModal from "./news/SubmitNewsModal";

// Default mock articles matching design specification
const DESIGN_ARTICLES: NewsArticle[] = [
  {
    id: "featured-1",
    title: "Get verified free with Prodatar",
    summary: "Verified businesses get a ✓ badge, appear first in the marketplace and can be featured across Business Bosses. Here’s how it works and how to get verified in minutes.",
    content: "Trust is the new shop window. Before a customer buys, or a supplier says yes, they want to know your business is real. Today we’re making that easier for every Business Boss.\n\nBusiness Bosses members can now verify their business with Prodatar, the trusted record of your business identity. It’s free for members.\n\nWhat you get:\n• A ✓ Verified badge on your profile, listings and posts\n• Priority placement: verified businesses appear first in the marketplace and in buyer requests\n• Access to features: verification unlocks Marketplace and Homepage features, and a chance to appear in Business Bosses Magazine\n• More trust from buyers: customers can see you’ve been checked against official records",
    category: "App update",
    image_url: "",
    is_featured: true,
    is_member_news: false,
    author_name: "Business Bosses Editorial",
    author_verified: true,
    publish_date: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "latest-1",
    title: "A simpler Business Bosses app is on the way",
    summary: "A new Home, Selling and Looking for, and a Post button that takes seconds.",
    content: "We're redesigning the core Business Bosses experience to make discovering partners, posting requests, and trading faster and more intuitive than ever.",
    category: "App update",
    image_url: "",
    is_featured: false,
    is_member_news: false,
    author_name: "Product Team",
    author_verified: true,
    publish_date: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "latest-2",
    title: "This week’s Boss Up Challenge",
    summary: "Share one thing that doubled your sales this year. The best answer is featured in the magazine.",
    content: "Join hundreds of entrepreneurs sharing their breakthrough sales tactics. Each week, our editorial team reviews top responses for inclusion in our global print and digital issues.",
    category: "Community",
    image_url: "",
    is_featured: false,
    is_member_news: false,
    author_name: "Community Leads",
    author_verified: true,
    publish_date: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "latest-3",
    title: "Partner with Business Bosses",
    summary: "Banks, Fintechs and software brands can now reach members through magazine features and in-app programmes.",
    content: "Our B2B partnership tier lets ecosystem leaders bring real value, credits, and tools to verified African and diaspora founders worldwide.",
    category: "Partnership",
    image_url: "",
    is_featured: false,
    is_member_news: false,
    author_name: "Partnerships Team",
    author_verified: true,
    publish_date: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "member-1",
    title: "Adaeze Textiles opens wholesale orders to UK boutiques",
    summary: "The Lagos fabric brand now ships wholesale bundles to retailers in the UK, starting with 40-bundle orders.",
    content: "Following record demand across the Business Bosses marketplace, Adaeze Textiles has expanded international logistics to support boutique retailers with verified wholesale sourcing.",
    category: "Member news",
    image_url: "",
    is_featured: false,
    is_member_news: true,
    author_name: "Adaeze Textiles",
    author_verified: true,
    publish_date: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "member-2",
    title: "Mama T’s Kitchen passes 100 catered events",
    summary: "The London caterer marks its 100th event and adds a corporate lunch menu for teams of 10 to 150.",
    content: "Mama T's Kitchen announces a major operational milestone alongside the rollout of corporate bespoke catering packages across greater London.",
    category: "Member news",
    image_url: "",
    is_featured: false,
    is_member_news: true,
    author_name: "Mama T’s Kitchen",
    author_verified: true,
    publish_date: "2026-10-01T00:00:00.000Z",
  },
];

export default function NewsHero() {
  const [articles, setArticles] = React.useState<NewsArticle[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<string>("All");
  const [loading, setLoading] = React.useState<boolean>(true);
  
  // Submit modal state
  const [openModal, setOpenModal] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const fetchNews = React.useCallback(async () => {
    try {
      const res = await fetch("https://orca-app-5dg8w.ondigitalocean.app/api/v1/news");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          // Merge API articles with design mock articles so the page is fully populated
          const apiIds = new Set(json.data.map((a: any) => a.id));
          const combined = [
            ...json.data,
            ...DESIGN_ARTICLES.filter((da) => !apiIds.has(da.id)),
          ];
          setArticles(combined);
        } else {
          setArticles(DESIGN_ARTICLES);
        }
      } else {
        setArticles(DESIGN_ARTICLES);
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setArticles(DESIGN_ARTICLES);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Featured article: Prioritize featured or first
  const featuredArticle = articles.find((a) => a.is_featured) || articles[0];

  // Latest non-featured articles
  const latestArticles = articles.filter((a) => a.id !== featuredArticle?.id && !a.is_member_news);
  
  // Member news articles
  const memberNewsArticles = articles.filter((a) => a.is_member_news);

  // Available categories for filter pills matching design
  const availableCategories = ["App updates", "Community", "Partnerships", "Member news"];

  const filteredLatest = latestArticles.filter((item) => {
    if (selectedFilter === "All") return true;
    return item.category?.toLowerCase() === selectedFilter.toLowerCase() ||
           (selectedFilter === "App updates" && item.category?.toLowerCase() === "app update") ||
           (selectedFilter === "Partnerships" && item.category?.toLowerCase() === "partnership");
  });

  const handleMemberSubmit = async (data: { author: string; title: string; imageUrl: string; summary: string }) => {
    setSubmitting(true);
    try {
      const res = await fetch("https://orca-app-5dg8w.ondigitalocean.app/api/v1/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          author_name: data.author || "Verified Member",
          image_url: data.imageUrl,
          summary: data.summary,
          category: "Member news",
          is_member_news: true,
          author_verified: true,
        }),
      });

      if (res.ok) {
        alert("Member news post submitted successfully and is pending admin review!");
        setOpenModal(false);
        fetchNews();
      } else {
        const errJson = await res.json();
        alert("Failed to submit news: " + (errJson.message || "Unknown error"));
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      alert("Error submitting news article");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <AppAppBar mode="light" toggleColorMode={() => {}} />

      {/* 1. Header with dynamic filter buttons */}
      <NewsHeader
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        availableCategories={availableCategories}
      />

      {/* 2. Featured Article & Latest News Feed */}
      <Box id="news-feed-section">
        <NewsFeed
          featuredArticle={featuredArticle}
          latestArticles={filteredLatest}
          loading={loading}
        />
      </Box>

      {/* 3. Member News Section */}
      <MemberNewsSection
        memberArticles={memberNewsArticles}
        onSubmitModalOpen={() => setOpenModal(true)}
        loading={loading}
      />

      {/* 4. Press & Media + Newsletter Banner */}
      <PressAndNewsletterSection />

      {/* 5. Member News Submission Modal */}
      <SubmitNewsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleMemberSubmit}
        submitting={submitting}
      />

      {/* Footer */}
      <Footer />
    </Box>
  );
}
