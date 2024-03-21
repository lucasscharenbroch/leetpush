# Leetpush
A Chrome Extension for committing to Github directly from Leetcode.

<image src="screenshot.png">

## Features
- User-supplied format strings for default commit message and file names
- File-name collision check

## Usage
- Install the extension
- Make a [fine-grained access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#fine-grained-personal-access-tokens) that can only access the target repo.
  - Go to: account settings > developer settings > personal access tokens > fine-grained tokens > generate new token
  - Enable access to the desired repository and allow permission to read and write its Contents
- Go to the extension options (right click icon > options), populate the fields
  - Access token
  - Repository Owner (Github Username)
  - Repository Name
  - Branch
  - File Name Pattern (e.g. "{number\_padded}\_{Title\_}.{ext}")
  - Commit Message Pattern (e.g. "Create {file\_name}")

## The New Leetcode Editor
Leetpush currently only supports the old Leetcode editor, because that's the only one I use.
If anyone besides me actually uses this and wants support for the new editor, please create an issue, and I'll gladly look into it.
