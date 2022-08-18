module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current',
				},
			},
		],
		'@babel/preset-typescript',
	],
	plugins: [
		[
			'module-resolver',
			{
				alias: {
					'@controllers': './src/controllers',
					'@dtos': './src/dtos',
					'@communicators': './src/communicators',
					'@services': './src/services',
					'@interfaces': './src/interfaces',
					'@utils': './src/utils',
					'@repositories': './src/repositories',
					'@middlewares': './src/middlewares',
				},
			},
		],
		['@babel/plugin-proposal-decorators', { legacy: true }],
	],
	ignore: ['**/*.spec.ts'],
};
