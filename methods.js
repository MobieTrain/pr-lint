function validateTitleAndBranch({ branch, branchRegex, title, titleRegex }) {
  try {
    if (branchRegex.test(branch) === false) {
      return "Branch doesn't match given regex.";
    }

    if (titleRegex.test(title) === false) {
      return "Title doesn't match given regex.";
    }

    const issueNumberMatches = title.match(/\[(\w+-\d+)\]/);
    const issueNumber = issueNumberMatches ? issueNumberMatches[1] : null;

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
