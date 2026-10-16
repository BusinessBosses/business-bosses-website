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

export default function NewsHero() {
  const [articles, setArticles] = React.useState<NewsArticle[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<string>("All");
  const [categoryCounts, setCategoryCounts] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState<boolean>(true);
  
  // Submit modal state
  const [openModal, setOpenModal] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const fetchNews = React.useCallback(async () => {
    try {
      const res = await fetch("https://orca-app-5dg8w.ondigitalocean.app/api/v1/news");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setArticles(json.data);
          setCategoryCounts(json.categoryCounts || {});
        }
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
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

  // Dynamic categories from loaded articles
  const availableCategories = React.useMemo(() => {
    const cats = new Set<string>();
    articles.forEach((a) => {
      if (a.category) cats.add(a.category);
    });
    return Array.from(cats);
  }, [articles]);

  const filteredLatest = latestArticles.filter((item) => {
    if (selectedFilter === "All") return true;
    return item.category?.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleMemberSubmit = async (data: { author: string; title: string; imageUrl: string; summary: string; content?: string }) => {
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
          content: data.content || data.summary,
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
