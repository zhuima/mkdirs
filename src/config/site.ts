import type { SiteConfig } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "AffDirs",
  tagline: "The Ultimate Affiliate Directory - Discover the Best Affiliate Programs and Tools",
  description:
    "AffDirs is your go-to directory for finding and comparing the best affiliate programs, marketing tools, and resources. We help affiliate marketers make informed decisions with comprehensive listings, detailed reviews, and up-to-date commission information.",
  keywords: [
    "Affiliate Programs",
    "Affiliate Marketing",
    "Affiliate Directory",
    "Marketing Tools",
    "Commission Rates",
    "Affiliate Reviews",
    "Marketing Resources",
    "Affiliate Networks",
    "Monetization Tools",
    "Passive Income",
    "Digital Marketing",
  ],
  author: "Zhuima",
  url: SITE_URL,
  // please increase the version number when you update the image
  image: `${SITE_URL}/og.png?v=1`,
  mail: "support@affdirs.com",
  utm: {
    source: "affdirs.com",
    medium: "referral",
    campaign: "navigation",
  },
  links: {
    // leave it blank if you don't want to show the link (don't delete)
    twitter: "https://x.com/ilovek8s",
    github: "https://github.com/zhuima",
    // youtube: "https://www.youtube.com/@MkdirsHQ",
  },
};
