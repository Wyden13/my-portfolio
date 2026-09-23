"use client";
import MusicBarDivider from "@/components/ui/MusicBarDivider";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

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
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-row items-center gap-4">
        <h1 className="text-6xl whitespace-nowrap">Blogs</h1>
        <MusicBarDivider />
      </div>
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
