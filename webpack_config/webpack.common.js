const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
    login: "./src/login.js",
  },
  output: {
    filename: "[name]-[contenthash].bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      // name this file main, so that it does not get automatically requested as a static file
      filename: "./index.html",
      template: path.resolve(__dirname, "..", "src", "index.html"),
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      // name this file main, so that it does not get automatically requested as a static file
      filename: "./login.html",
      template: path.resolve(__dirname, "..", "src", "login.html"),
      chunks: ["login"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(js|mjs|jsx)$/, // regex to see which files to run babel on
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              "@babel/preset-env",
              {
                plugins: ["@babel/plugin-transform-runtime"],
              },
            ],
          },
        },
      },
    ],
  },
};
