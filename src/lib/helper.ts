function fetchGitHubRepos(username: string) {
  return fetch(`https://api.github.com/users/${username}`).then((response) => {
    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
    }
    return { response, data: response.json() };
  });
}
export { fetchGitHubRepos };
