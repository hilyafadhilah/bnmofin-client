module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'airbnb-base',
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
	}],
	settings: {
		'svelte3/typescript': true,
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
		indent: ['error', 'tab'],
		'no-tabs': 'off',
		'import/prefer-default-export': 'off',
		'import/no-mutable-exports': 'off',
	},
};
