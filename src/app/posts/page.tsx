"use client";
import MusicBarDivider from "@/components/ui/MusicBarDivider";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { withBasePath } from "@/lib/base-path";

const BLOG_POSTS = [
  {
    title: "Understanding Physics",
    slug: "docs-math",
    date: "2024-01-15",
    excerpt:
      "Calculating Force - In classical mechanics, the relationship between mass and acceleration is defined by Newton's Second Law.",
  },
  {
    title: "Feature Update",
    slug: "feature-update",
    date: "2024-01-10",
    excerpt: "Latest features and improvements to the platform.",
  },
  {
    title: "Travel Blog",
    slug: "travel-blog",
    date: "2024-01-05",
    excerpt: "Exploring new places and experiences around the world.",
  },
  {
    title: "A test post",
    slug: "markdown-test",
    date: "2025-03-17",
    excerpt: "A post to test various markdown formatting",
  },
];

export default function BlogsPage() {
  return (
    <div className="page-typography mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[7/2]">
        <img
          src={withBasePath("/minecraft_wp.jpg")}
          alt="Projects banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <h1 className="absolute bottom-6 left-6 text-4xl font-bold text-white md:text-6xl">
          My Posts
        </h1>
      </div>
      {/* Introduction */}
      <section className="mt-12 mb-8">
        <div className="flex items-center gap-4">
          <h2 className="shrink-0 text-3xl font-semibold md:text-5xl">
            Latest Projects
          </h2>
          <MusicBarDivider />
        </div>
        {/* <p className="mt-4 max-w-2xl text-neutral-400">
          A collection of things I’ve built and explored.
        </p> */}
      </section>
      {/* Search bar */}
      <SearchBar />
      {/* Blogs List */}
      <div className="grid grid-cols-1 gap-6 mt-8">
        {BLOG_POSTS.map((post) => (
          <Link
            href={`/posts/${post.slug}`}
            key={post.slug}
            className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--accent)] hover:bg-[var(--surface-hover)] hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 hover:text-[var(--accent)]">
              {post.title}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-3">{post.date}</p>
            <p className="text-[var(--text-secondary)]">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
