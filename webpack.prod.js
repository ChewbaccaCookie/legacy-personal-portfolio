const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const selectedPreprocessor = {
	fileRegexp: /\.(sass|scss|css)$/,
	loaderName: "sass-loader",
};

module.exports = {
	entry: "./src/index.ts",
	resolve: {
		extensions: [".ts", ".js"],
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].[chunkhash].js",
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: selectedPreprocessor.fileRegexp,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: "",
						},
					},
					{
						loader: "css-loader",
						options: {
							modules: false,
							sourceMap: true,
						},
					},
					{
						loader: "postcss-loader",
						options: {
							sourceMap: true,
						},
					},
					{
						loader: selectedPreprocessor.loaderName,
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "fonts/",
						},
					},
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: "style.[contenthash].css",
		}),
		new HtmlWebpackPlugin({
			hash: false,
			template: "./src/index.html",
			filename: "index.html",
		}),
	],
};
