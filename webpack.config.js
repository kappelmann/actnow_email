const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: { path: path.join(__dirname, "dist"), filename: "index.bundle.js" },
  mode: "production",
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "bufer": require.resolve("buffer/"),
      "fs": false,
      "stream": require.resolve("stream-browserify")
    },
    extensions: [".tsx", ".ts", ".jsx", ".js"]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public")
    },
    historyApiFallback: true,
    port: 1234
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader"],
      },
    ]
  },
  performance: {
    maxEntrypointSize: 2048000,
    maxAssetSize: 2048000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html")
    }),
    new CopyPlugin({
      patterns: [
        { from: "databases", to: "databases" }
      ],
    }),
  ]
};

