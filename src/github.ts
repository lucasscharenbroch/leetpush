import { Octokit } from "octokit";
import { get_options } from "./storage";

async function mk_octokit(opts): Promise<Octokit> {
  let tok = opts.access_token;
  console.log("tok", tok)
  return new Octokit({
    auth: tok
  });
}


export async function make_commit(file_name: string, contents: string, commit_message: string): Promise<string> {
  let opts = await get_options();
  let octokit = await mk_octokit(opts);

  const boilerplate = {
    owner: opts.owner,
    repo: opts.repo,
    branch: opts.branch,
    ref: opts.branch,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  };

  let branch_json = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', { ...boilerplate });

  let last_commit_hash = branch_json.data.commit.sha;
  let tree_hash = branch_json.data.commit.commit.tree.sha;

  let new_tree_json = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
    ...boilerplate,
    base_tree: tree_hash,
    tree: [
      {
        path: file_name,
        mode: '100644', // normal file
        type: 'blob',
        content: contents,
      }
    ]
  })

  let new_tree_hash = new_tree_json.data.sha;

  let new_commit = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
    ...boilerplate,
    message: commit_message,
    parents: [last_commit_hash],
    tree: new_tree_hash,
  })

  await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/heads/{ref}', {
    ...boilerplate,
    sha: new_commit.data.sha,
    force: true,
  })

  return new_commit.data.sha;
}

export async function hello_github(): Promise<string> {
  return make_commit("test_file2", "contents of\nfile 2", "commit message for file 2");
}
