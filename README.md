# Cogsworth Embed App Client SDK

The Cogsworth Embed App SDK allows Cogsworth partners to embed the Cogsworth Embed application in their own sites with minimal configuration.

## Installation

```bash
npm install @cogsworth4/embed-sdk-js
# or
yarn add @cogsworth4/embed-sdk-js
```

## Usage

One you have set up your secure payload endpoint in your backend, the client SDK can consume it and render the Cogsworth embed application in your site.

```javascript
const client = new CogsworthClient({
  payloadEndpoint: {
    url: `http://partner.com/api/cogsworth-payload?userId=${userId}&clinicId=${clinicId}`,
    // Headers can be used to authenticate the request to the payload endpoint
    headers: {},
  },
});
```

Once instantiated, you can call the `init()` method to render the Cogsworth embed application. It is required that you indicate the ID of the element where you want the app to be rendered.

```javascript
client.init("cogsworth-container");
```

## Full example

```html
<html>
  <head>
    <script type="text/javascript" src="http://embed-app.cogsworth.com/client.js"></script>
  </head>
  <body>
    <div id="cogsworth-container">
    <script type="text/javascript">
      // 1. Instantiate the Cogsworth Client by indicating the payload endpoint url and optional headers.
      const client = new CogsworthClient({
        payloadEndpoint: {
          url: `http://partner.com/api/cogsworth-payload?userId=${userId}&clinicId=${clinicId}`,
          headers: {},
        },
      });

      // 2. Initialize the cogsworth embed application
      client.init('cogsworth-container')
    </script>
  </body>
</html>
```
