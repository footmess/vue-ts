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
	// see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
	chainWebpack: () => {},
	configureWebpack: (config) => {
		if (process.env.NODE_ENV === 'production') {
			//为生成环境修改配置
			config.mode = 'production';
		} else {
			//为开发环境修改配置
			config.mode = 'development';
		}
		Object.assign(config, {
			//开发和生产环境共同配置
			resolve: {
				extensions: [ '.js', '.vue', '.json', '.ts', '.tsx' ],
				//别名
				alias: {
					//__dirname获取当前项目的绝对路径
					'@': path.resolve(__dirname, './src'),
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
		loaderOptions: {},
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
