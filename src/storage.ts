let optNames = ["access_token", "branch", "file_name"];

export async function get_options() {
    return chrome.storage.sync.get(optNames);
}