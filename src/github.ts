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
  let opts = await get_options();

  let repo = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: opts.owner,
    repo: opts.repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  let branch = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
    owner: opts.owner,
    repo: opts.repo,
    branch: opts.branch,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  let last_commit_hash = branch.data.commit.sha;
  let tree_hash = branch.data.commit.commit.tree.sha;
  let file_name = "test_file.txt";
  let contents = "contents of the test file";

  let _new_tree = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
    owner: opts.owner,
    repo: opts.repo,
    base_tree: tree_hash,
    tree: [
      {
        path: file_name,
        mode: '100644', // normal file
        type: 'blob',
        content: contents,
      }
    ],
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  let new_tree_hash = _new_tree.data.sha;
  let commit_mesg = "Test Commit Message";

  let new_commit = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
    owner: opts.owner,
    repo: opts.repo,
    message: commit_mesg,
    parents: [last_commit_hash],
    tree: new_tree_hash,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
    owner: opts.owner,
    repo: opts.repo,
    ref: 'heads' + opts.branch,
    sha: new_commit.data.sha,
    force: true,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  return new_commit.data.sha;
}
