const core = require("@actions/core");
const github = require("@actions/github");

const { validateTitleAndBranch } = require("./methods");

function main() {
  const titleRegexString = core.getInput("title-regex", { required: true });
  const branchRegexString = core.getInput("branch-regex", { required: true });

  const title = String(github.context.payload.pull_request.title);
  const branch = String(github.context.payload.pull_request.head.ref);
  const titleRegex = new RegExp(titleRegexString);
  const branchRegex = new RegExp(branchRegexString);

  core.info(`Title: ${title}`);
  core.info(`Title Regex: ${titleRegex}`);
  core.info(`Branch: ${branch}`);
  core.info(`Branch Regex: ${branchRegex}`);

  const error = validateTitleAndBranch({
    branch,
    branchRegex,
    title,
    titleRegex,
  });

  if (error) {
    core.setFailed(error);
  }
}

main();
