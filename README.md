# bnmofin-client

13520024 Hilya Fadhilah Imania

## Stack

- Svelte with SvelteKit (comes with Vite)
- Tailwind CSS

### Tools

- Axios
- Firebase Client
- `es-cookie`
- `javascript-time-ago`, `date-fns`

## Setup

### Environment

Working configurations are already present in `.env.example`. If the `bnmofin-api`
server is up, you can run this client without needing to start a local server
instance yourself.

#### API

- `VITE_API_URL`: URL of bnmofin-api server
- `VITE_API_TIMEOUT`: Optional. Timeout in milliseconds.

#### Firebase

There are two ways you can configure firebase through the environment.

You can put all the configuration in one variable called
`VITE_FIREBASE_CONFIG` as JSON. Working example is provided.

The other option is to manually put every relevant information in each
respective variables:

```
VITE_FIREBASE_APIKEY=...
VITE_FIREBASE_AUTHDOMAIN=...
VITE_FIREBASE_PROJECTID=...
VITE_FIREBASE_STORAGEBUCKET=...
VITE_FIREBASE_MESSAGINGID=...
VITE_FIREBASE_APPID=...
VITE_FIREBASE_MEASUREMENTID=...
```

> If there is a `VITE_FIREBASE_CONFIG` variable set, the app will use it
> instead of the individual variables.

### Build & run

```
$ yarn
$ yarn build
$ yarn preview
```

### Development

```
$ yarn dev
```
