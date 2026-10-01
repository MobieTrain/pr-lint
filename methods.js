const JIRA_KEY_PATTERN = /\[(\w+-\d+)\]/;
const GITHUB_ISSUE_PATTERN = /\(#(\d+)\)/;
const GITHUB_BRANCH_PATTERN = /^(?:GH-)?(\d+)(?:-|$)/;

function extractTitleReference(title) {
  const jiraMatch = title.match(JIRA_KEY_PATTERN);
  if (jiraMatch) {
    return { kind: "jira", key: jiraMatch[1] };
  }

  const githubMatch = title.match(GITHUB_ISSUE_PATTERN);
  if (githubMatch) {
    return { kind: "github", key: githubMatch[1] };
  }

  return null;
}

function branchMatchesJiraKey(branch, key) {
  return branch === key || branch.startsWith(key + "-");
}

function branchMatchesGithubIssue(branch, number) {
  const githubKey = "GH-" + number;
  if (branch.startsWith(githubKey)) {
    return branchMatchesJiraKey(branch, githubKey);
  }

  const branchMatch = branch.match(GITHUB_BRANCH_PATTERN);
  return branchMatch !== null && branchMatch[1] === number;
}

function isBranchConsistent(branch, reference) {
  if (reference.kind === "jira") {
    const githubNumber = reference.key.match(/^GH-(\d+)$/);
    if (githubNumber) {
      return branchMatchesGithubIssue(branch, githubNumber[1]);
    }
    return branchMatchesJiraKey(branch, reference.key);
  }

  return branchMatchesGithubIssue(branch, reference.key);
}

function validateTitleAndBranch({ branch, branchRegex, title, titleRegex }) {
  try {
    if (branchRegex.test(branch) === false) {
      return "Branch doesn't match given regex.";
    }

    if (titleRegex.test(title) === false) {
      return "Title doesn't match given regex.";
    }

    const reference = extractTitleReference(title);

    if (!reference || !isBranchConsistent(branch, reference)) {
      return "Title and branch are inconsistent";
    }
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  validateTitleAndBranch,
};
