const core = require('@actions/core');
const github = require('@actions/github');

try {
  const titleRegexString = core.getInput('title-regex', { required: true });
  const titleRegexFlagsString = core.getInput('title-regex-flags') || 'g';
  const branchRegexString = core.getInput('branch-regex', { required: true });
  const branchRegexFlagsString = core.getInput('branch-regex-flags') || 'g';

  const title = String(github.context.payload.pull_request.title);
  const branch = String(github.context.payload.pull_request.head.ref);
  const titleRegex = new RegExp(titleRegexString, titleRegexFlagsString)
  const branchRegex = new RegExp(branchRegexString, branchRegexFlagsString)

  core.info(`Title: ${title}`);
  core.info(`Title Regex: ${titleRegex}`);

  core.info(`Branch: ${branch}`);
  core.info(`Branch Regex: ${branchRegex}`);


  if (!branchRegex.test(branch)) {
    core.setFailed('Branch doesn\'t match given regex.');
  }

  if (!titleRegex.test(title)) {
    core.setFailed('Title doesn\'t match given regex.');
  }

  if (!title.includes(branch)) {
    core.setFailed('Title and branch are inconsistent');
  }


} catch (error) {
  core.setFailed(error.message);
}