import serialize from 'serialize-javascript';

export default function template(body, initialData, userData, menuData) {
  return `<!DOCTYPE HTML>
  <html>

  <head>
    <meta charset="utf-8">
    <title>Awesome Dimsum</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" >
    <link href="/rsuite-default.min.css" rel="stylesheet">

    <script src="https://apis.google.com/js/api:client.js"></script>
    
    <style>
      body {
        font-family: 'Ubuntu', sans-serif;
        font-size: 16px;
      }
      table.table-hover tr {cursor: pointer;}
      .panel-title a {display: block; width: 100%; cursor: pointer;}
    </style>
  </head>

  <body>
    <!-- Page generated from template. -->
    <div id="content">${body}</div>
    <script>
      window.__INITIAL_DATA__ = ${serialize(initialData)}
      window.__USER_DATA__ = ${serialize(userData)}
      window.__MENU_DATA__ = ${serialize(menuData)}
    </script>

    <script src="/env.js"></script>
    <script src="/vendor.bundle.js"></script>
    <script src="/app.bundle.js"></script>
  </body>

  </html>
  `;
}
