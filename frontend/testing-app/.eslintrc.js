module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'plugin:react/recommended',
        'standard'
    ],
    overrides: [
        {
            files: ['**/*.js'],
            rules: {
                'no-undef': 'off'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [
        'react'
    ],
    rules: {
        semi: [2, 'always'],
        indent: ['error', 4],
        'space-before-function-paren': ['error', 'never']
    }
};
