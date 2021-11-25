# remix-postcss

Use your [PostCSS](https://postcss.org/) Config in [Remix](https://remix.run)

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

## Informations

This Package will read out all PostCSS-Config file types from your Remix-App Root dirctory. (!!! Currently only `plugins` are used !!!)

Since we're reprocessing the Files again and again there will be duplicate rules because they have been reprocessed. Due to this we've added [postcss-discard-duplicates](https://www.npmjs.com/package/postcss-discard-duplicates) as a default Plugin. If this conflicts with your PostCSS-Config read further down about configuring remix-postcss.

---

## Usage

### - Global processing

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

### - Options

```ts
remixPostcss(remixContext, {
  /**
   * Disables the "postcss-discard-duplicates" PostCSS Plugin
   */
  disableDiscardDuplicates: false, // default: false
});
```

And you're finished!

---

## How it works

- Reads all Modules from the Remix Context
- Takes their exported `links`
- Runs those Files through PostCSS and saves them again
