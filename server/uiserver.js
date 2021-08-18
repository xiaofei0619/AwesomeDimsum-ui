import dotenv from 'dotenv';
import express from 'express';
import proxy from 'http-proxy-middleware';
import SourceMapSupport from 'source-map-support';

import render from './render.jsx';

const app = express();

SourceMapSupport.install();
dotenv.config();

// After importing rsuite
// Substitute all process.env to env for solving
// process.env.RUN_ENV - process is not defined error
const { env } = process;

console.log('environ');
console.log(JSON.stringify(env, null, 2));

// use Hot Module Replacement
const enableHMR = (env.ENABLE_HMR || 'true') === 'true';
if (enableHMR && (env.NODE_ENV !== 'production')) {
  console.log('Adding dev middleware, enabling HMR');

  /* eslint "global-require": "off" */
  /* eslint "import/no-extraneous-dependencies": "off" */
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');

  const config = require('../webpack.config.js')[0];
  console.log(config);
  config.entry.app.push('webpack-hot-middleware/client');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}

app.use(express.static('public'));

const apiProxyTarget = env.API_PROXY_TARGET;
if (apiProxyTarget) {
  app.use('/graphql', proxy({ target: apiProxyTarget }));
  app.use('/auth', proxy({ target: apiProxyTarget }));
}

if (!env.UI_API_ENDPOINT) {
  env.UI_API_ENDPOINT = 'http://localhost:3000/graphql';
}

if (!env.UI_SERVER_API_ENDPOINT) {
  env.UI_SERVER_API_ENDPOINT = env.UI_API_ENDPOINT;
}

if (!env.UI_AUTH_ENDPOINT) {
  env.UI_AUTH_ENDPOINT = 'http://localhost:3000/auth';
}

// change env to env2 for differentiating
app.get('/env.js', (req, res) => {
  const env2 = {
    UI_API_ENDPOINT: env.UI_API_ENDPOINT,
    UI_AUTH_ENDPOINT: env.UI_AUTH_ENDPOINT,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_MAP_KEY: env.GOOGLE_MAP_KEY,
  };
  res.send(`window.ENV = ${JSON.stringify(env2)}`);
});

app.get('*', (req, res, next) => {
  console.log('what is request url?');
  console.log(req.url);
  render(req, res, next);
});

const port = env.UI_SERVER_PORT || 8000;

app.listen(port, () => {
  console.log(`UI started on port ${port}`);
});

if (module.hot) {
  module.hot.accept('./render.jsx');
}
