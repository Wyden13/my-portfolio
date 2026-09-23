export default function SearchBar() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-full border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)] p-2 text-[var(--background)] hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
