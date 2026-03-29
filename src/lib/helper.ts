export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
//   commit_count: number;
  stargazers_count: number;
  language: string | null;
}

function fetchGitHubRepos(Username: string):Promise<{ response: Response; data: GitHubRepo[] }> {
  return fetch(`https://api.github.com/users/${Username}/repos`).then((response) => {
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    return response.json().then((data) => ({ response, data }));
  });
}
export { fetchGitHubRepos };