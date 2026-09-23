import Link from "next/link";

type ProjectCardProps = {
  name: string;
  description: string;
  url: string;
  language: string;
  stargazers_count: number;
  updated_at?: Date | string;
};

export default function ProjectCard({
  name,
  description,
  url,
  language,
  stargazers_count,
  updated_at,
}: ProjectCardProps) {
  return (
    <Link
      href={url}
      className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-hover)]"
    >
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 truncate">
        {name}
      </h3>
      <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2">
        {description || "No description"}
      </p>
      <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
        {language ? (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
            {language}
          </span>
        ) : (
          <span className="text-xs text-[var(--text-muted)]">
            Unknown language
          </span>
        )}
        <span>⭐ {stargazers_count}</span>
        <span className="text-xs text-[var(--text-muted)]">
          Updated on {new Date(updated_at || "").toLocaleDateString()}
        </span>
      </div>
      {/* <Link
        href={url}
        className="text-sm text-blue-500 hover:underline mt-2 block"
      >
        View on GitHub
      </Link> */}
    </Link>
    // <Link href={url} className="border rounded-lg p-4 bg-white">
    //   <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 truncate">
    //     {name}
    //   </h3>
    //   <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2">
    //     {description || "No description"}
    //   </p>
    //   <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
    //     {language ? (
    //       <span className="flex items-center gap-1">
    //         <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
    //         {language}
    //       </span>
    //     ) : (
    //       <span className="text-xs text-[var(--text-muted)]">
    //         Unknown language
    //       </span>
    //     )}
    //     <span>⭐ {stargazers_count}</span>
    //     <span className="text-xs text-[var(--text-muted)]">
    //       Updated on {new Date(updated_at || "").toLocaleDateString()}
    //     </span>
    //   </div>
    // </Link>
  );
}
