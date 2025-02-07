import { slugify } from "@/lib/utils";
import type { Category, Tag } from "@/sanity.types";
import { google } from "@ai-sdk/google";
import mql from "@microlink/mql";
import { createClient } from "@sanity/client";
import { generateObject } from "ai";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { z } from "zod";
dotenv.config();

// make sure you have set the environment variables in .env file
const client = createClient({
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-08-01",
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_TOKEN,
});

/**
 * AI-Powered Item Management System
 * 
 * An automated script for managing content items in Sanity CMS using AI SDK
 * and Microlink for data enrichment.
 * 
 * Core Functions:
 * 1. Content Scraping: Extract data from URLs using Microlink
 * 2. AI Analysis: Process content using Google's Gemini AI
 * 3. Asset Management: Handle images and icons
 * 4. Database Operations: CRUD operations in Sanity
 * 
 * Data Processing Flow:
 * 1. URL → Microlink (metadata) + AI SDK (content analysis)
 * 2. Data Enrichment → Categories & Tags mapping
 * 3. Asset Processing → Icon & Image handling
 * 4. Sanity Import → Structured content creation
 * 
 * Content Structure:
 * - name: Title of the item
 * - slug: Auto-generated URL-friendly identifier
 * - description: AI-generated short description (160 chars)
 * - introduction: AI-generated detailed markdown content
 * - link: Source URL
 * - categories: Auto-mapped category references
 * - tags: Auto-mapped tag references
 * - image: Screenshot or main image
 * - icon: Favicon or logo
 * 
 * Key Features:
 * - AI-powered content analysis
 * - Automated metadata extraction
 * - Smart category/tag mapping
 * - Automated asset management
 * - Bulk processing support
 * 
 * Requirements:
 * - Sanity CMS credentials
 * - Google AI SDK access
 * - Microlink API access
 * - Environment variables configured
 * 
 * Usage:
 * 1. pnpm run item remove
 * remove all items
 * 2. pnpm run item import
 * import all items defined in links array
 * 3. pnpm run item update
 * update all items
 * 4. pnpm run item fetch <url>
 * fetch item info for the specified url
 */
const links = [
  "https://mkdirs.com",
  "https://achromatic.dev",
];

export const removeItems = async () => {
  const data = await client.delete({
    query: "*[_type == 'item']",
  });
  console.log("removeItems:", data);
};

/**
 * fetch item info for the specified url with Microlink and AI SDK
 */
export const fetchItem = async (url: string) => {
  // step 1: fetch item info with Microlink
  const microlinkData = await fetchItemWithMicrolink(url);
  console.log("fetchItem, url:", url, "microlinkData:", microlinkData);

  // step 2: fetch item info with AI SDK
  const aisdkData = await fetchItemWithAISdk(url);
  console.log("fetchItem, url:", url, "aisdkData:", aisdkData);

  // step 3: merge the data
  const mergedData = {
    link: url,
    name: aisdkData.object.title,
    description: aisdkData.object.description,
    introduction: aisdkData.object.introduction,
    categories: aisdkData.object.categories,
    tags: aisdkData.object.tags,
    image: microlinkData?.image?.url, // or get a new screenshot
    icon: `https://s2.googleusercontent.com/s2/favicons?domain=${url}&sz=128`, // or microlinkData?.logo?.url
  };
  console.log("fetchItem, url:", url, "mergedData:", mergedData);
  return mergedData;
};

/**
 * fetch item info for the specified url with Microlink
 */
export const fetchItemWithMicrolink = async (url: string) => {
  try {
    const { data } = await mql(url, {
      // information included:
      // - title: page title
      // - description: page description
      // - lang: page language
      // - author: author information
      // - publisher: publisher information
      // - image: main image
      // - logo: website logo
      // - url: normalized URL
    });
    // console.log("fetchItemWithMicrolink, url:", url, "data:", data);
    return data;
  } catch (error) {
    console.error(
      `fetchItemWithMicrolink, Error processing url for ${url}:`,
      error,
    );
    return null;
  } 
};

/**
 * fetch item info for the specified url with AI SDK
 */
export const fetchItemWithAISdk = async (url: string) => {
  try {
    // get all categories and tags
    const categories = await client.fetch<Category[]>(`*[_type == "category"]`);
    const tags = await client.fetch<Tag[]>(`*[_type == "tag"]`);
    const availableCategories = categories.map((cat) => cat.name);
    const availableTags = tags.map((tag) => tag.name);

    const schema = z.object({
      title: z.string().describe("A short, concise name without description"),
      description: z
        .string()
        .max(160)
        .describe("One sentence summary, max 160 characters"),
      introduction: z
        .string()
        .describe("Detailed introduction in markdown format"),
      categories: z
        .array(z.string())
        .describe("Array of category names that best match the content"),
      tags: z
        .array(z.string())
        .describe("Array of tag names that best match the content")
    });

    const response = await fetch(url);
    const htmlContent = await response.text();
    const result = await generateObject({
      model: google("gemini-2.0-flash-exp", {
        structuredOutputs: true,
      }),
      schema,
      prompt: `Analyze the following webpage content and provide structured information:
      
      Content to analyze:
      ${htmlContent}
      
      Available Categories:
      ${availableCategories.join(", ")}
      
      Available Tags:
      ${availableTags.join(", ")}
      
      Please analyze the content and provide:
      1. A concise title (just the name, no description)
      2. A brief description (one sentence, max 160 characters)
      3. A detailed introduction in markdown format (include key features and use cases)
      4. Select appropriate categories from the available categories list (return array of names)
      5. Select relevant tags from the available tags list (return array of names)
      
      Focus on technical aspects and practical applications. If the content is a tool or service, 
      emphasize its main features, target users, and unique selling points.`,
    });

    // console.log("fetchItemWithAISdk, url:", url, "result:", result);
    return result;
  } catch (error) {
    console.error(
      `fetchItemWithAISdk, Error processing url for ${url}:`,
      error,
    );
    return null;
  }
};

export const importItems = async () => {
  try {
    console.log("importItems start");

    // get all categories and tags
    const categories = await client.fetch<Category[]>(`*[_type == "category"]`);
    const tags = await client.fetch<Tag[]>(`*[_type == "tag"]`);

    for (let i = 0; i < links.length; i++) {
      const item = await fetchItem(links[i]);
      console.log("index: ", i, ", url: ", links[i], ", item:", item.name);

      const itemCategories = findCategory(categories, item.categories);
      const itemTags = findTag(tags, item.tags);

      // Fetch icon and image
      const [iconResponse, imageResponse] = await Promise.all([
        fetch(item.icon),
        fetch(item.image),
      ]);
      const [iconArrayBuffer, imageArrayBuffer] = await Promise.all([
        iconResponse.arrayBuffer(),
        imageResponse.arrayBuffer(),
      ]);

      // Convert ArrayBuffer to Buffer for Sanity upload
      const [iconBuffer, imageBuffer] = [
        Buffer.from(iconArrayBuffer),
        Buffer.from(imageArrayBuffer),
      ];

      // Upload icon and image to sanity
      const [iconAsset, imageAsset] = await Promise.all([
        client.assets.upload("image", iconBuffer, {
          filename: `${slugify(item.name)}_logo.png`,
        }),
        client.assets.upload("image", imageBuffer, {
          filename: `${slugify(item.name)}_image.png`,
        }),
      ]);

      await client.create({
        // _id: item._id,
        // _createdAt: item._createdAt,
        // _updatedAt: item._updatedAt,
        _type: "item",
        name: item.name,
        slug: {
          _type: "slug",
          current: slugify(item.name),
        },
        link: item.link,
        description: item.description,
        publishDate: new Date(),
        pricePlan: "free",
        freePlanStatus: "approved",

        introduction: item.introduction,

        // set submitter if you need, change the _ref to your user id
        // submitter: {
        //   _type: "reference",
        //   _ref: "",
        // },

        // set categories and tags
        categories: itemCategories.map((category, index) => ({
          _type: "reference",
          _ref: category._id,
          _key: index.toString(),
        })),
        tags: itemTags.map((tag, index) => ({
          _type: "reference",
          _ref: tag._id,
          _key: index.toString(),
        })),

        // set icon and image
        icon: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: iconAsset._id,
          },
          alt: `Logo of ${item.name}`,
        },
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
          alt: `Screenshot of ${item.name}`,
        },
      });
    }

    console.log("importItems success");
  } catch (error) {
    console.error(error);
  }
};

const findCategory = (categories: Category[], names: string[]) => {
  return categories.filter((category: Category) =>
    names.includes(category.name),
  );
};

const findTag = (tags: Tag[], names: string[]) => {
  return tags.filter((tag: Tag) => names.includes(tag.name));
};

export const updateItems = async () => {
  const items = await client.fetch(`*[_type == "item"]`);

  for (const item of items) {
    const result = await client
      .patch(item._id)
      .set({
        // do what you want to update here
      })
      .commit();

    console.log(`Updated item ${item.name}:`, result);
  }

  console.log(`Updated ${items.length} items`);
};

// get operation from command line
const operation = process.argv[2];
// get url from command line
const url = process.argv[3];

// run operation based on command line argument
const runOperation = async () => {
  switch (operation) {
    case "remove":
      await removeItems();
      break;
    case "import":
      await importItems();
      break;
    case "update":
      await updateItems();
      break;
    case "fetch":
      await fetchItem(url);
      break;
    default:
      console.log(`
Available commands:
- remove: Remove all items
- import: Import all items
- update: Update all items
- fetch<url>: Fetch item info for the specified url with AI SDK and Microlink and return structured data
      `);
  }
};

// run operation
runOperation().catch(console.error);
