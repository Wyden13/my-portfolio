import MusicBarDivider from "@/components/ui/MusicBarDivider";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectGallery from "@/components/ProjectGallery";

export default function ProjectPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <img
        src="/minecraft2.webp"
        alt="Projects banner"
        className="w-full aspect-[7/2] object-cover"
      />
      <div className="flex flex-row items-center gap-4">
        <h1 className="text-6xl whitespace-nowrap">Latest Projects</h1>
        <MusicBarDivider />
      </div>
      <ProjectGallery username="Wyden13" />
    </div>
  );
}
