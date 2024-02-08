import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: "Access Token",
});

export function hello_github() {
    return octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: "octocat",
    repo: "Spoon-Knife",
    }).then(x => JSON.stringify(x));
}
