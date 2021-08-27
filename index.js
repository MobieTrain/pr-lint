const core = require('@actions/core');
const github = require('@actions/github');

try {
  const titleRegex = core.getInput('title-regex', { required: true });
  const titleRegexFlags = core.getInput('title-regex-flags') || 'g';
  const errorMessage = core.getInput('error-message') || `Please fix your PR title to match "${titleRegex}" with "${titleRegexFlags}"`;
  const title = github.context.payload.pull_request.title;

  core.info(`Branch name: ${github.context.payload.pull_request.head.ref}`);
  core.info(`Checking "${titleRegex}" with "${titleRegexFlags}" flags against the PR title: "${title}"`);

  const regex = new RegExp(titleRegex, titleRegexFlags)

  if (!regex.test(title)) {
    core.setFailed(errorMessage);
  }
} catch (error) {
  core.setFailed(error.message);
}