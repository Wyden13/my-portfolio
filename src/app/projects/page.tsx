import MusicBarDivider from "@/components/ui/MusicBarDivider";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectGallery from "@/components/ProjectGallery";
import { withBasePath } from "@/lib/base-path";

export default function ProjectPage() {
  return (
    <main className="page-typography mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[7/2]">
        <img
          src={withBasePath("/wallpaper.jpg")}
          alt="Projects banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <h1 className="absolute bottom-6 left-6 text-4xl font-bold text-white md:text-6xl">
          My Projects
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
        <p className="mt-4 max-w-2xl text-neutral-400">
          A collection of things I’ve built and explored.
        </p>
      </section>

      {/* Gallery */}
      <ProjectGallery username="your-github-username" />
    </main>
  );
}
