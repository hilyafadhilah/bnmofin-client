/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'airbnb-base',
		'airbnb-typescript/base',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	plugins: [
		'svelte3',
		'@typescript-eslint',
	],
	overrides: [{
		files: ['*.svelte'],
		processor: 'svelte3/svelte3',
		rules: {
			'import/no-mutable-exports': 'off',
			'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 2, maxEOF: 0 }],
			'import/first': 'off',
		},
	}],
	settings: {
		'svelte3/typescript': true,
		'import/resolver': {
			typescript: {
				project: ['./tsconfig.eslint.json'],
			},
		},
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.eslint.json'],
		extraFileExtensions: ['.svelte'],
	},
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	rules: {
		indent: 'off',
		'no-tabs': 'off',
		'@typescript-eslint/indent': ['error', 'tab'],
		'no-console': 'off',
		'import/prefer-default-export': 'off',
		'import/no-extraneous-dependencies': 'off',
	},
};
