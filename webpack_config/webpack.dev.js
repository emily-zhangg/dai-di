const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = merge(common, {
  entry: {
    index: "./src/index.js",
    login: "./src/login.js",
  },
  mode: "development",
  devtool: "inline-source-map",
  watch: true,
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx)$/, // regex to see which files to run babel on
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
});
