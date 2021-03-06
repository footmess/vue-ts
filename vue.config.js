const path = require('path');
const sourceMap = process.env.NODE_ENV === 'development';

module.exports = {
	//基本路径
	publicPath: './',
	//输出文件目录
	outputDir: 'dist',
	//eslint-loader是否在保存的时候检查
	lintOnSave: false,
	//webpack配置
	// see https://github.com/vuejs/vue-cli/blob/dev/docs/guide/webpack.md
	chainWebpack: (config) => {
		config.plugins.delete('prefetch');
		config.module.rule('pug').test(/\.pug/).use('pug-html-loader').loader('pug-html-loader').end();
		// config.resolve.alias.set('@assets', 'src/assets');
	},
	configureWebpack: (config) => {
		if (process.env.NODE_ENV === 'production') {
			//为生成环境修改配置
			config.mode = 'production';
		} else {
			//为开发环境修改配置
			config.mode = 'development';
		}
		// 开启分离js
		config.optimization = {
			runtimeChunk: 'single',
			splitChunks: {
				chunks: 'all',
				maxInitialRequests: Infinity,
				minSize: 20000,
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name(module) {
							// get the name. E.g. node_modules/packageName/not/this/part.js
							// or node_modules/packageName
							const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
							// npm package names are URL-safe, but some servers don't like @ symbols
							return `npm.${packageName.replace('@', '')}`;
						}
					}
				}
			}
		};
		Object.assign(config, {
			//开发和生产环境共同配置
			resolve: {
				extensions: [ '.js', '.vue', '.json', '.ts', '.tsx' ],
				//别名
				alias: {
					//__dirname获取当前项目的绝对路径
					'@': path.resolve(__dirname, './src'),
					'@assets': path.resolve(__dirname, './src/assets'),
					vue$: 'vue/dist/vue.js'
				}
			}
		});
	},
	//生产环境是否生产sourceMap文件
	productionSourceMap: sourceMap,
	//css相关配置
	css: {
		//是否使用css分离插件ExtractTextPlugin
		extract: true,
		//是否开启css source maps
		sourceMap: false,
		//css预设器配置项
		loaderOptions: {
			sass: {
				prependData: `@import "@/assets/styles/variable.scss";`
			}
		},
		//是否启用css module for all css/pre-processor files
		modules: false
	},
	//是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
	parallel: require('os').cpus().length > 1,
	//PWA插件配置
	//see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
	pwa: {},
	//webpack-dev-server配置
	devServer: {
		// open: true,
		// host: 'localhost',
		// port: 3001,
		// https: false,
		// hotOnly: false,
		// proxy: {
		// 	//设置代理
		// 	'/api': {
		// 		target: 'http://localhost:3000/',
		// 		changeOrigin: true,
		// 		ws: true,
		// 		pathRewrite: {
		// 			'^/api': ''
		// 		}
		// 	}
		// },
		// before: (app) => {}
	},
	//第三方插件配置
	pluginOptions: {
		//...
	}
};
