function validateTitleAndBranch({ branch, branchRegex, title, titleRegex }) {
  try {
    if (branchRegex.test(branch) === false) {
      return "Branch doesn't match given regex.";
    }

    if (titleRegex.test(title) === false) {
      return "Title doesn't match given regex.";
    }

    // Extract the issue number from the title using regex
    const issueNumberMatches = title.match(/\[(\w+-\d+)\]/);
    const issueNumber = issueNumberMatches ? issueNumberMatches[1] : null;

    // Check if the branch is a substring of the title and it matches the issue number format
    if (
      !issueNumber ||
      (branch !== issueNumber && !branch.startsWith(issueNumber + "-"))
    ) {
      return "Title and branch are inconsistent";
    }
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  validateTitleAndBranch,
};
