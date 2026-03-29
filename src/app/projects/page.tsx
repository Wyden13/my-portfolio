// "use client";
import MusicBarDivider from "@/components/MusicBarDivider";
import ProjectCard from "@/components/ProjectCard";
import { fetchGitHubRepos } from "@/lib/helper";
// import { useEffect, useState } from "react";
import ProjectGallery from "@/components/ProjectGallery";

export default function ProjectPage() {
  return <ProjectGallery username="Wyden13" />;
  //   const [projects, setProjects] = useState<any[]>([]);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState<Error | null>(null);

  //   async function loadRepos() {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const { response, data } = await fetchGitHubRepos("Wyden13");
  //       if (!response.ok) {
  //         throw new Error(
  //           `GitHub API error: ${response.status} ${response.statusText}`,
  //         );
  //       }
  //       setProjects(data || []);
  //     } catch (error: any) {
  //       setError(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   useEffect(() => {
  //     loadRepos();
  //   }, []);

  //   const errorMessage = error instanceof Error ? error.message : null;

  //   // Display loading state
  //   if (loading) {
  //     return (
  //       <div className="flex items-center justify-center py-6">
  //         <p className="text-gray-400 animate-pulse">Loading...</p>
  //       </div>
  //     );
  //   }
  //   if (errorMessage) {
  //     return (
  //       <div className="flex items-center justify-center py-6">
  //         <p className="text-red-500">Error: {errorMessage}</p>
  //       </div>
  //     );
  //   }
  //   return (
  //     <div className="flex flex-col bg-[var(--background)] px-4 py-12 gap-6">
  //       <div className="w-3/4 mx-auto flex flex-col gap-8">
  //         <div className="flex flex-row items-center gap-4 justify-center">
  //           <h1 className="text-6xl whitespace-nowrap text-[var(--text-primary)]">
  //             Projects
  //           </h1>
  //           <MusicBarDivider />
  //         </div>
  //         <div className="flex-1 overflow-auto">
  //           {/* your projects content */}
  //           {projects.length === 0 ? (
  //             <p className="text-var(--text-muted) mt-4">No projects found.</p>
  //           ) : (
  //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  //               {projects.map((project) => (
  //                 <ProjectCard
  //                   key={project.id}
  //                   name={project.name}
  //                   description={project.description}
  //                   url={project.html_url}
  //                   language={project.language}
  //                   stargazers_count={project.stargazers_count}
  //                   updated_at={project.updated_at}
  //                 />
  //               ))}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
}
