const core = require("@actions/core");
const assert = require("node:assert");
const { describe, it } = require("node:test");

const { validateTitleAndBranch } = require("./methods");

describe("validateTitleAndBranch", () => {
  process.env["INPUT_TITLE-REGEX"] =
    "^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test|deps){1}(\\([\\w\\.-]+\\))?(!)?:\\ ([\\w\\ ])+([\\s\\S]*)\\[(MT|MI|INT|CT|HF|DB|RI|MN|MP|PD)-\\d+\\]";
  process.env["INPUT_BRANCH-REGEX"] =
    "^(?:MT|MI|INT|CT|HF|DB|RI|MN|MP|PD)-\\d+(?:-\\d+)?$";

  const titleRegexString = core.getInput("title-regex", { required: true });
  const branchRegexString = core.getInput("branch-regex", { required: true });
  const titleRegex = new RegExp(titleRegexString);
  const branchRegex = new RegExp(branchRegexString);

  describe("invalid title", () => {
    [
      "invalid title",
      "feat(): description [PD-200]",
      "feat(test): description [PD-200-0001]",
      "feat(test): description",
      "feat(test): description PD-200",
    ].forEach((title) => {
      it(`should return error when the title does not match the regex pattern: ${title}`, () => {
        const result = validateTitleAndBranch({
          branch: "PD-200",
          branchRegex,
          title,
          titleRegex,
        });

        assert.strictEqual(result, "Title doesn't match given regex.");
      });
    });
  });

  describe("invalid branch", () => {
    ["invalid-branch", "PD-200-", "PD-200PD", "PD200", "200"].forEach(
      (branch) => {
        it(`should return error when the branch does not match the regex pattern: ${branch}`, () => {
          const result = validateTitleAndBranch({
            branch,
            branchRegex,
            title: "feat(test): description [PD-200]",
            titleRegex,
          });

          assert.strictEqual(result, "Branch doesn't match given regex.");
        });
      }
    );
  });

  describe("branch / title inconsistencies", () => {
    [
      ["PD-200", "feat(test): description [PD-201]"],
      ["PD-200-200", "feat(test): description [PD-201]"],
      ["PD-200-200", "feat(test): description [PD-201]"],
    ].forEach(([branch, title]) => {
      it(`should return error when the title and branch are inconsistent`, () => {
        const result = validateTitleAndBranch({
          branch,
          branchRegex,
          title,
          titleRegex,
        });

        assert.strictEqual(result, "Title and branch are inconsistent");
      });
    });
  });

  it("should not return error when the title and branch are consistent", () => {
    const result = validateTitleAndBranch({
      branch: "PD-200-001",
      branchRegex,
      title: "feat(test): description xpto 123 [PD-200]",
      titleRegex,
    });

    assert.strictEqual(result, undefined);
  });
});
