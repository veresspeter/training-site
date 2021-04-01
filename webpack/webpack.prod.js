const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const utils = require('./utils.js');
const commonConfig = require('./webpack.common.js');

const ENV = 'production';
const sass = require('sass');

module.exports = webpackMerge(commonConfig({env: ENV}), {
  // Enable source maps. Please note that this will slow down the build.
  // You have to enable it in Terser config below and in tsconfig.json as well
  // devtool: 'source-map',
  entry: {
    global: './src/main/webapp/content/scss/global.scss',
    main: './src/main/webapp/app/app.main'
  },
  output: {
    path: utils.root('target/classes/static/'),
    filename: 'app/[name].[hash].bundle.js',
    chunkFilename: 'app/[id].[hash].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'postcss-loader', {
          loader: 'sass-loader',
          options: { implementation: sass }
        }],
        exclude: /(vendor\.scss|global\.scss)/
      },
      {
        test: /(vendor\.scss|global\.scss)/,
        use: ['style-loader', 'css-loader', 'postcss-loader', {
          loader: 'sass-loader',
          options: { implementation: sass }
        }]
      }]
  },
  plugins: [
    new MomentLocalesPlugin({
      localesToKeep: [
        // jhipster-needle-i18n-language-moment-webpack - JHipster will add/remove languages in this array
      ]
    })
  ],
  mode: 'production'
});
