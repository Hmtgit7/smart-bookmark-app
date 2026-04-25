/** @type {import("prettier").Config} */
const config = {
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    tabWidth: 4,
    printWidth: 100,
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
    plugins: [],
    overrides: [
        {
            files: ['*.json', '*.yaml', '*.yml'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};

module.exports = config;
