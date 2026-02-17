const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = (env, argv) => {
  // Support both --env flag and NODE_ENV/mode
  const isProd =
    process.env.NODE_ENV === "production" ||
    argv.mode === "production" ||
    env === "production";

  return {
    mode: isProd ? "production" : "development",
    entry: "./src/main.tsx",
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "[name].[contenthash].js" : "[name].js",
      chunkFilename: isProd
        ? "[name].[contenthash].chunk.js"
        : "[name].chunk.js",
      publicPath: "/",
      clean: true,
    },

    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: { "@": path.resolve(__dirname, "src") },
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true, // ForkTsChecker handles type errors
                experimentalWatchApi: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
      ],
    },

    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          // Vendor chunk — React, ReactDOM
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
            priority: 10,
          },
          // TaskModal gets its own async chunk — loaded only when modal opens
          taskModal: {
            test: /[\\/]src[\\/]components[\\/]TaskModal[\\/]/,
            name: "task-modal",
            chunks: "async",
            priority: 20,
            enforce: true,
          },
        },
      },
      runtimeChunk: "single",
    },

    plugins: [
      new ForkTsCheckerWebpackPlugin(), // async type checking — no build slowdown

      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/icons/icon-192x192.png",
      }),

      ...(isProd
        ? [new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" })]
        : []),

      new WebpackPwaManifest({
        name: "FluxBoard",
        short_name: "FluxBoard",
        description: "Offline-first high-performance task board",
        background_color: "#FFFBFE",
        theme_color: "#6750A4",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: path.resolve("public/icons/icon-512x512.png"),
            sizes: [192, 512],
          },
        ],
      }),

      // Inject Workbox service worker in production only
      ...(isProd
        ? [
            new InjectManifest({
              swSrc: "./public/service-worker.js",
              swDest: "service-worker.js",
            }),
          ]
        : []),
    ],

    devServer: {
      static: { directory: path.join(__dirname, "public") },
      port: 3000,
      hot: true,
      historyApiFallback: true, // SPA routing
      open: true,
    },
  };
};
