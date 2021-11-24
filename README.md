# postcss-remix

Use your PostCSS Config in Remix

---

## Install

```sh
# npm
npm install remix-postcss
npm install postcss --dev

# yarn
yarn add remix-postcss
yarn add -D postcss
```

---

# Usage

This Package is a bit special in how it works, but it's easy to setup

`/app/entry.server.tsx`

```ts
import { remixPostcss } from "remix-postcss";

...

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  remixPostcss(remixContext);
  ...
```

And you're finished!

---

## How it works

- Reads all Modules from the Remix Context
- Takes their exported `links`
- Runs those Files through PostCSS and saves them again
