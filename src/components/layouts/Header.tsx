import Link from "next/link";
import ThemeToggle from "../ui/ThemeToggle";

export default function Header() {
  return (
    <header className="site-header relative z-10 flex flex-col items-start gap-5 px-4 py-6 text-[var(--text-primary)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
      <Link href="/" className="shrink-0 text-2xl font-bold">
        My portfolio
      </Link>
      <nav
        className="flex w-full items-center justify-between gap-3 text-sm sm:w-auto sm:justify-end sm:gap-8 sm:text-base"
        aria-label="Main navigation"
      >
        <Link href="/projects" className="hover:text-[var(--text-secondary)]">
          Projects
        </Link>
        <Link href="/posts" className="hover:text-[var(--text-secondary)]">
          Posts
        </Link>
        <Link href="/contact" className="hover:text-[var(--text-secondary)]">
          Contact
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
