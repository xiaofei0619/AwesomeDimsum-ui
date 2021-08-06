/*
  eslint-disable import/no-extraneous-dependencies
*/
const webpack = require('webpack');
const merge = require('webpack-merge');
const serverConfig = require('./webpack.config')[1];

module.exports = merge.merge(serverConfig, {
  entry: { server: ['./node_modules/webpack/hot/poll?1000'] },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});