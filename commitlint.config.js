// commitlint.config.js
// Enforces Conventional Commits: https://www.conventionalcommits.org/
// Format: <type>(<scope>): <subject>
// Example: feat(auth): add Google OAuth login
//          fix(bookmarks): handle empty tag list
//          docs: update README setup steps

/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed commit types
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only
        'style',    // Formatting, missing semi-colons, etc (no logic change)
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf',     // Performance improvement
        'test',     // Adding or fixing tests
        'chore',    // Build process, dependency updates, tooling
        'ci',       // CI/CD configuration
        'build',    // Build system changes
        'revert',   // Reverts a previous commit
      ],
    ],
    // Subject must not be sentence-case, start-case, pascal-case, upper-case
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    // Subject must not end with a period
    'subject-full-stop': [2, 'never', '.'],
    // Type must not be empty
    'type-empty': [2, 'never'],
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Header max length
    'header-max-length': [2, 'always', 100],
    // Body must have a blank line before it
    'body-leading-blank': [1, 'always'],
    // Footer must have a blank line before it
    'footer-leading-blank': [1, 'always'],
  },
};

module.exports = config;
