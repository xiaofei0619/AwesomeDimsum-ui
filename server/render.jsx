import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';

import Page from '../src/Page.jsx';
import template from './template.js';
import store from '../src/store.js';
import routes from '../src/routes.js';
import fetchMenu from './fetchMenu.js';

export default async function render(req, res) {
  const menuData = await fetchMenu();
  store.menuData = menuData.menuList;

  const activeRoute = routes.find(
    route => matchPath(req.path, route),
  );
  console.log('what is active route??');
  console.log(activeRoute);
  console.log(activeRoute.component);

  let initialData;

  if (activeRoute && activeRoute.component.fetchData) {
    console.log('In render.jsx logging initial Data');
    const match = matchPath(req.path, activeRoute);
    const index = req.url.indexOf('?');
    const search = index !== -1 ? req.url.substr(index) : null;
    console.log('match: ', match);
    console.log('index: ', index);
    console.log('search: ', search);
    initialData = await activeRoute.component.fetchData(match, search, req.headers.cookie);
    console.log(initialData);
  }

  const userData = await Page.fetchData(req.headers.cookie);

  store.initialData = initialData;
  store.userData = userData;

  const context = {};
  const element = (
    <StaticRouter location={req.url} context={context}>
      <Page />
    </StaticRouter>
  );
  const body = ReactDOMServer.renderToString(element);

  if (context.url) {
    res.redirect(301, context.url);
  } else {
    res.send(template(body, initialData, userData, menuData));
  }
}
