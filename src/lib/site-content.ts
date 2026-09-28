/**
 * Website content schema & fallbacks for Business Bosses Website.
 *
 * Each section declares its editable defaults. Components read
 * `withDefaults('sectionKey', liveContent)` so the site renders cleanly
 * whether or not a CMS record exists yet.
 */

export interface WebsiteHeroContent {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
}

export interface HowItWorksStep {
  n: number;
  title: string;
  description: string;
}

export interface WebsiteHowItWorksContent {
  badge?: string;
  title?: string;
  steps: HowItWorksStep[];
}

export interface SolutionCardItem {
  badge: string;
  title: string;
  description: string;
}

export interface WebsiteSolutionsContent {
  badge?: string;
  title?: string;
  cards: SolutionCardItem[];
}

export interface WebsiteReviewsContent {
  title?: string;
  subtitle?: string;
  reviewText?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface WebsiteFaqContent {
  title?: string;
  items: FaqItem[];
}

export interface WebsiteFooterContent {
  tagline?: string;
  email?: string;
  copyrightText?: string;
}

export const BB_CONTENT_DEFAULTS: Record<string, any> = {
  bb_website_hero: {
    badge: "",
    title: "THE BUSINESS",
    titleHighlight: "DEMAND ENGINE",
    description: "One Reach Score. Rank higher and get matched to the right opportunities, everywhere.",
    primaryCtaText: "Check your Reach Ranking",
    secondaryCtaText: "Find a Match",
    stat1Value: "600,000+",
    stat1Label: "Businesses reached",
    stat2Value: "$50.7 Billion",
    stat2Label: "Fastest-growing digital category",
    stat3Value: "94%",
    stat3Label: "Audited identity issues fixed",
  },
  bb_website_how_it_works: {
    badge: "How It Works",
    title: "From Demand Signals to Growth Insights",
    steps: [
      {
        n: 1,
        title: "Demand Flows In",
        description: "We aggregate thousands of real-time requests and business opportunities globally",
      },
      {
        n: 2,
        title: "Get Ranked by Reach Score",
        description: "Every business is scored and ranked against that demand — the higher your Reach Score, the sooner you're seen.",
      },
      {
        n: 3,
        title: "Smart Matches Are Made",
        description: "Top-ranked businesses are matched directly to the opportunities and requests fit them best — no searching required.",
      },
      {
        n: 4,
        title: "Growth Compounds",
        description: "Every match raises your Reach Score, and a higher score brings the next match faster — the loop strengthens itself.",
      },
    ],
  },
  bb_website_solutions: {
    badge: "Our Unique Solution and Capabilities",
    title: "Everything you need to Succeed",
    cards: [
      {
        badge: "Core",
        title: "Reach Ranking™",
        description: "Track your business's visibility and demand ranking in real-time. See how buyers perceive your brand and discover opportunities to increase your reach.",
      },
      {
        badge: "Demand",
        title: "BizCenter",
        description: "Your digital business hub to manage partnerships, track deals, and showcase your brand to potential clients, and partners.",
      },
      {
        badge: "Visibility",
        title: "Featured Business Visibility",
        description: "Get featured prominently to attract more buyers. Stand out with enhanced visibility and showcase your offerings to a wider audience.",
      },
    ],
  },
  bb_website_reviews: {
    title: "Reviews",
    subtitle: "19k+ Satisfied Users",
    reviewText: "Business Bosses has revolutionized the way I network and collaborate with fellow entrepreneurs. As a fashion designer and startup owner, I've always been on the lookout for a platform that caters specifically to the unique needs of entrepreneurs, and Business Bosses has exceeded my expectations in every way.",
  },
  bb_website_faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "How do I contact customer support if I have a question or issue?",
        answer: "You can reach our customer support team by emailing support@businessbosses.org. We're here to assist you promptly.",
      },
      {
        question: "Can I return a product or cancel a service if I'm not satisfied?",
        answer: "Yes, you can initiate a return or request a cancellation within our specified policy guidelines.",
      },
      {
        question: "What makes your product/service stand out from others in the market?",
        answer: "Our product/service distinguishes itself through unmatched quality, innovative features, and exceptional customer support.",
      },
      {
        question: "Is there a warranty or guarantee on your products/services?",
        answer: "Yes, we stand behind the quality of our offerings with comprehensive coverage.",
      },
    ],
  },
  bb_website_footer: {
    tagline: "Join a vibrant community of entrepreneurs. Expand your network, share your expertise, and discover endless opportunities with Business Bosses.",
    email: "support@businessbosses.org",
    copyrightText: "Business Bosses",
  },
};

/**
 * Merge live CMS content over default content.
 */
export function withDefaults<T = any>(sectionKey: string, liveContent: any): T {
  const defaults = BB_CONTENT_DEFAULTS[sectionKey] || {};
  if (!liveContent || typeof liveContent !== "object") {
    return { ...defaults } as T;
  }

  const merged = { ...defaults };
  for (const [key, val] of Object.entries(liveContent)) {
    if (val === null || val === undefined) continue;
    if (typeof val === "string" && val.trim() === "") continue;
    if (Array.isArray(val) && val.length === 0) continue;
    merged[key] = val;
  }

  return merged as T;
}
