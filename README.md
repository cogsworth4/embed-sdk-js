# Cogsworth Embed App Client SDK

The Cogsworth Embed App SDK allows Cogsworth partners to embed the Cogsworth Embed application in their own sites with minimal configuration.

## Installation

```bash
npm install @cogsworthdev/embed-sdk-js
# or
yarn add @cogsworthdev/embed-sdk-js
```

## Usage

One you have set up your secure payload endpoint in your backend, the client SDK can consume it and render the Cogsworth embed application in your site.

In addition to the payload endpoint, you'll need to provide a query selector for the element you wish to render the application in, and your partner ID.

```javascript
const client = new CogsworthClient({
  partnerId: 'xxxxxxxxx',
  payloadEndpoint: {
    url: `http://partner.com/api/cogsworth-payload?userId=${userId}&clinicId=${clinicId}`,
    // Headers can be used to authenticate the request to the payload endpoint
    headers: {},
  }
  containerSelector: '#cogsworth-widget',
})
```

Once instantiated, you can call the `init()` method to render the Cogsworth embed application.

```javascript
client.init()
```

## Full example (React)

```javascript
import CogsworthClient from '@cogsworth4/embed-sdk-js'

const App = () => {
  useEffect(() => {
    // 1. Instantiate the Cogsworth Client by indicating your partner ID, the payload endpoint url and optional headers.
    const client = new CogsworthClient({
      partnerId: 'xxxxxxxxx',
      payloadEndpoint: {
        url: `http://partner.com/api/cogsworth-payload?userId=${userId}&clinicId=${clinicId}`,
        headers: {},
      },
      containerSelector: '#cogsworth-widget',
    })

    // 2. Initialize the cogsworth embed application
    client.init()
  }, [])

  return <div id='cogsworth-widget' />
}
```
