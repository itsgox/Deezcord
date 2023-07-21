module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	},
	'parserOptions': {
		'sourceType': 'module',
		'ecmaFeatures': {
			'jsx': true
		}
	}
};