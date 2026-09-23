// src/app/posts/[slug]/page.tsx
import Link from "next/link";
import MusicBarDivider from "@/components/ui/MusicBarDivider";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

type BlogPostMetadata = {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  section?: string;
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params; // Await the params promise to get the slug
  const post = await import(`@/data/posts/${slug}.mdx`);
  const MDXContent: any = post.default || (() => <p>Content not available.</p>);

  const metadata: BlogPostMetadata = post.metadata || {
    title: "Untitled Post",
    description: "No description available.",
    date: new Date().toISOString(),
    tags: [],
  };
  const title = metadata.title || "Untitled Post";
  const description = metadata.description || "No description available.";
  const date = metadata.date || new Date().toISOString();
  const tags = metadata.tags || [];
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Main wrapper for styling */}
      <div className="mx-auto w-full max-w-[768px] px-4">
        {/* Back button */}
        <Link
          href="/posts"
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-[var(--accent)] hover:opacity-75 transition-opacity"
        >
          ← Back to Blogs
        </Link>

        <article className="w-full">
          {/* Title section with metadata */}
          <div className="mb-8">
            <h1 className="mb-4 text-5xl font-bold text-[var(--text-primary)]">
              {title}
            </h1>
            <div className="flex items-center gap-4 pb-4 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--text-muted)]">
                {formattedDate}
              </span>
              {tags && tags.length > 0 && (
                <div className="flex gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--accent)] rounded-full px-3 py-1 text-xs text-[var(--accent)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* The markdown content */}
          <div className="prose max-w-none text-[var(--text-secondary)]">
            <MDXContent />
          </div>
        </article>
      </div>
    </div>
  );
}
export function generateStaticParams() {
  // Return all available blog posts
  return [
    { slug: "docs-math" },
    { slug: "feature-update" },
    { slug: "travel-blog" },
    { slug: "markdown-test" },
  ];
}
export const dynamicParams = false;
