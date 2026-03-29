import Link from "next/link";

export default function Header() {
  return (
    <header className="text-[var(--text-primary)] bg-[var(--background)] py-8 p-12 flex flex-row justify-between items-center">
      <div className="flex-1">
        <Link href="/" className="text-2xl font-bold">
          My portfolio
        </Link>
      </div>
      <div className="flex-1">
        <nav className="flex flex-row gap-8 justify-end">
          <Link href="about" className="hover:text-[var(--text-secondary)]">
            About
          </Link>
          <Link href="projects" className="hover:text-[var(--text-secondary)]">
            Projects
          </Link>
          <Link
            href="inspiration"
            className="hover:text-[var(--text-secondary)]"
          >
            Inspiration
          </Link>
          <Link href="contact" className="hover:text-[var(--text-secondary)]">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
