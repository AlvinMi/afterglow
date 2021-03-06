// webpack.config.js
const webpack = require("webpack");
const path = require("path");

const pathOutput = path.resolve(__dirname, "dist");
const pathNodeModules = path.resolve(__dirname, "node_modules");
const env = process.env.NODE_ENV;
const isProd = env === "production";
console.log("Environment isProd :", isProd);

const plugins = [new webpack.HotModuleReplacementPlugin()];
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

if (isProd) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        drop_debugger: true,
        drop_console: true,
        screw_ie8: true
      },
      comments: false,
      mangle: false
    })
  );
  plugins.push(new ExtractTextPlugin("assets/css/main.css"));
}

const entry = isProd
  ? { app: "./src/js/app.js" }
  : { app: "./src/js/app.js", debug: "./src/js/debug.js" };

const output = isProd
  ? {
      filename: "assets/js/app.js",
      path: pathOutput
    }
  : {
      filename: "assets/js/[name].js",
      path: pathOutput
    };
const devtool = isProd ? "source-map" : "inline-source-map";

const config = {
  optimization: {
    minimize: false // Update this to true or false
  },
  entry: ["react-hot-loader/patch", "./src/js/app.js"],
  // entry,
  devtool,
  devServer: {
    contentBase: "./dist",
    // host: "0.0.0.0",
    port: "8082"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  // ----- webpack-bundle-analyzer 插件 ----- //
  // plugins: [
  //   new BundleAnalyzerPlugin({
  //     analyzerMode: "server",
  //     analyzerHost: "127.0.0.1",
  //     analyzerPort: 8888,
  //     reportFilename: "report.html",
  //     defaultSizes: "parsed",
  //     openAnalyzer: true,
  //     generateStatsFile: false,
  //     statsFilename: "stats.json",
  //     logLevel: "info"
  //   })
  // ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: pathNodeModules
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(glsl|vert|frag)$/,
        use: ["raw-loader", "glslify-loader"],
        exclude: pathNodeModules
      }
    ]
  },
  // resolve: {
  //   extensions: [".js", ".jsx"],
  //   alias: {
  //     "react-dom": "@hot-loader/react-dom"
  //   }
  // }
  resolve: {
    alias: {
      libs: path.resolve(__dirname, "src/js/libs"),
      shaders: path.resolve(__dirname, "src/shaders")
    }
  }
};
console.log(config, "\r\n");
module.exports = config;
