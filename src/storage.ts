let optNames = ["access_token", "owner", "repo", "branch", "file_name_pat", "commit_pat"];

export async function get_options() {
    return chrome.storage.sync.get(optNames);
}