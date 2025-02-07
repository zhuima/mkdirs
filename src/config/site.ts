import type { SiteConfig } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Directory",
  tagline: "This is a demo site for Mkdirs, the best directory website template",
  description:
    "This is a demo site for Mkdirs template. Mkdirs is the ultimate directory website template. With Mkdirs, you can build any trending and profitable directory website in minutes, packed with Listings, Newsletter, Payment, CMS, Blog, Authentication, SEO, Themes and more",
  keywords: [
    "Directory",
    "Template",
    "Boilerplate",
    "Next.js",
    "Auth.js",
    "Tailwindcss",
    "Shadcn/ui",
    "Resend",
    "Sanity",
    "Stripe",
    "Vercel",
  ],
  author: "Mkdirs",
  url: SITE_URL,
  // please increase the version number when you update the image
  image: `${SITE_URL}/og.png?v=1`,
  mail: "support@mkdirs.com",
  utm: {
    source: "mkdirs.com",
    medium: "referral",
    campaign: "navigation",
  },
  links: {
    // leave it blank if you don't want to show the link (don't delete)
    twitter: "https://x.com/MkdirsHQ",
    github: "https://github.com/MkdirsHQ",
    youtube: "https://www.youtube.com/@MkdirsHQ",
  },
};
