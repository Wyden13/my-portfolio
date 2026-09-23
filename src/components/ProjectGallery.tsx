"use client";
import MusicBarDivider from "./ui/MusicBarDivider";
import { useState, useEffect } from "react";
import ProjectCard from "./ui/ProjectCard";
import { fetchGitHubRepos } from "@/lib/helper";

export default function ProjectGallery({ username }: { username: string }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function loadRepos() {
    setLoading(true);
    setError(null);
    try {
      const { response, data } = await fetchGitHubRepos(username);
      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }
      setProjects(await data);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRepos();
  }, [username]);

  const errorMessage = error instanceof Error ? error.message : null;

  // Display loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </div>
    );
  }
  if (errorMessage) {
    return (
      <div className="flex items-center justify-center py-6">
        <p className="text-red-500">Error: {errorMessage}</p>
      </div>
    );
  }
  return (
    <div>
      {loading && <p className="text-gray-700 mt-4">Loading projects...</p>}
      {errorMessage && (
        <p className="text-red-500 mt-4">Error: {errorMessage}</p>
      )}
      {!loading && !errorMessage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                description={project.description}
                url={project.html_url}
                language={project.language}
                stargazers_count={project.stargazers_count}
                updated_at={project.updated_at}
              />
            ))
          ) : (
            <p className="text-gray-700 mt-4">No projects found</p>
          )}
        </div>
      )}
    </div>
  );
}
