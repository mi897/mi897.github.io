import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";
import { getCollection } from "astro:content";

export async function get(context) {
  const writs = await getCollection("writs");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: import.meta.env.SITE,
    items: writs.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/writs/${post.slug}/`,
    })),
  });
}
