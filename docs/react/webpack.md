<!--
 * @Prd: 
 * @Link: 
 * @Author: xjl
 * @Email: xujl@weipaitang.com
 * @Date: 2020-04-13 19:39:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-13 19:46:21
 -->
# create-react-app中集成webpack

CRA中默认webpack的相关配置都是已经隐藏的，可以通过命令`npm run enject`反编译出来配置文件，但这个操作是不可逆的。这里推荐的是使用社区的一个[`react-app-rewrite`]('https://github.com/arackaf/customize-cra')插件。

```js
yarn add customize-cra react-app-rewired --dev
npm i customize-cra react-app-rewired --dev
```

安装完成后再项目根目录新建一个`config-overrides.js`.


```js
// config-overides.js
const path = require('path');
const Merge = require('webpack-merge');
const { override, fixBabelImports, addLessLoader, useEslintRc } = require('customize-cra');

// 拓展插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const FileManagerPlugin = require('filemanager-webpack-plugin');

// const date = new Date();
// const dateText = `${date.getFullYear()}年${date.getMonth() +
// 	1}月${date.getDate()}日 ${date.getHours()}点${date.getMinutes()}分${date.getSeconds()}秒`;

const env = process.env.NODE_ENV;

const defaultOptions = { libraryDirectory: 'es', style: true };

const addImport = (libraryName, options = defaultOptions) =>
	fixBabelImports(libraryName, {
		libraryName,
		...options,
	});

module.exports = override(
	// 按需加载
	addImport('antd'),
	addImport('antd-mobile'),
	addImport('lodash', {
		libraryDirectory: '',
	}),
	// 添加 less-loader
	addLessLoader({
		javascriptEnabled: true,
		modifyVars: {}, // 覆盖 less 变量
	}),
	// 允许二次配置 eslint
	useEslintRc(),
	// 自定义更改
	config => {
		// 添加ts代码审查
		const forkTsCheckerWebpackPlugin = config.plugins[config.plugins.length - 1];
		forkTsCheckerWebpackPlugin.tslint = './tslint.json';
		forkTsCheckerWebpackPlugin.tslintVersion = require('tslint').Linter.VERSION;

		if (env === 'production') {
			config = Merge(config, {
				devtool: false,
				optimization: {
					minimizer: [
						// 压缩代码
						new UglifyJsPlugin({
							cache: true, // 启用文件缓存
							parallel: true, // 使用多线程
							uglifyOptions: {
								compress: {
									warnings: false, // 删除无用代码时不输出警告
									drop_console: true, // 删除console语句
									collapse_vars: true, // 内嵌定义了但是只有用到一次的变量
									reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
								},
							},
						}),
						// 打包视图
						// new BundleAnalyzerPlugin(),
						// 输出ZIP压缩包
						// new FileManagerPlugin({
						// 	onEnd: [
						// 		{
						// 			delete: [path.join(__dirname, '*.zip')],
						// 			archive: [
						// 				{
						// 					source: path.join(__dirname, 'build'),
						// 					destination: path.join(__dirname, `build at ${dateText}.zip`),
						// 				},
						// 			],
						// 		},
						// 	],
						// }),
					],
				},
			});
		}

		return config;
	}
);
```