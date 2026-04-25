// commitlint.config.js — Monorepo root
// Enforces Conventional Commits: https://www.conventionalcommits.org/
// Format: <type>(<scope>): <subject>
// Scopes map to monorepo packages: web, api, db, shared, ci, etc.
// Examples:
//   feat(api): add bookmark search endpoint
//   fix(web): handle empty tag list
//   chore(db): add index on bookmarks.userId

/** @type {import('@commitlint/types').UserConfig} */
const config = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'build', 'revert'],
        ],
        'scope-enum': [
            1,
            'always',
            ['web', 'api', 'db', 'shared', 'ci', 'docker', 'deps', 'release'],
        ],
        'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-empty': [2, 'never'],
        'type-case': [2, 'always', 'lower-case'],
        'header-max-length': [2, 'always', 100],
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always'],
    },
};

module.exports = config;
