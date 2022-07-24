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
					// '@controllers': './src/controllers',
					'@communicators': './src/communicators',
					'@services': './src/services',
					'@interfaces': './src/interfaces',
					'@utils': './src/utils',
				},
			},
		],
	],
	ignore: ['**/*.spec.ts'],
};
