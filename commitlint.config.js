module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [1, 'always', 100]
  },
  helpUrl: `
  Commit messages must follow conventional commit format:
  https://www.conventionalcommits.org/en/v1.0.0/#summary
      type(optional-scope): subject

      [optional body]
  * To bypass pre-commit hooks run 'git commit --no-verify'
  >>> Use "npm run commit" for interactive prompt. <<<
  `
}
