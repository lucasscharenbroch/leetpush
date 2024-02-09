let optNames = ["access_token", "owner", "repo", "branch", "file_name_pat", "commit_pat"];

export async function get_options(): Promise<{access_token: any,
                                              owner: any,
                                              repo: any,
                                              branch: any,
                                              file_name_pat: any,
                                              commit_pat: any}> {
    let opts = await chrome.storage.sync.get(optNames);

    if(!(opts.access_token && opts.owner && opts.repo && opts.branch && opts.file_name_pat && opts.commit_pat))
        throw Error("Incomplete options: " + JSON.stringify(opts));

    return {
        access_token: opts.access_token,
        owner: opts.owner,
        repo: opts.repo,
        branch: opts.branch,
        file_name_pat: opts.file_name_pat,
        commit_pat: opts.commit_pat,
    }
}
