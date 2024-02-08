import { Octokit } from "octokit";
import { get_options } from "./storage";

async function mk_octokit(): Promise<Octokit> {
  let tok = await get_options().then(x => x.access_token);
  console.log("tok", tok)
  return new Octokit({
    auth: tok
  });
}

export async function hello_github(): Promise<string> {
  let octokit = await mk_octokit();

  return octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: "octocat",
    repo: "Spoon-Knife",
  }).then(x => JSON.stringify(x));
}
