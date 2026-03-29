import Link from "next/link";

interface InspirationCardProps {
  title: string;
  description: string;
  url: string;
  category: string;
  image?: string;
}

export default function InspirationCard({
  title,
  description,
  url,
  category,
  image,
}: InspirationCardProps) {
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
        {image && (
          <div className="mb-3 h-32 bg-gray-200 rounded-md overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="mb-2 inline-block px-2 py-1 bg-[var(--accent)] bg-opacity-10 rounded text-xs font-semibold text-[var(--accent)]">
          {category}
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-muted)] line-clamp-3">
          {description}
        </p>
      </div>
    </Link>
  );
}
