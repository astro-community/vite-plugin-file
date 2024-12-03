# Vite-Plugin-File <img src="https://jonneal.dev/vite-logo.svg" alt="" width="90" height="90" align="right">

**vite-plugin-file** enables seamless access to file information and data in **[Vite](https://vite.dev)** projects.

[![NPM Version][npm-img]][npm-url]
[![NPM Downloads][dl-img]][dl-url]

- **Efficient File Handling**: Stream large files without consuming excess memory.
- **Convenient File Formats**: Work seamlessly with modern Web APIs.
  - Work with large files efficiently via `ReadableStream`.
  - Access the entire file as `ArrayBuffer`, `Blob`, or `File`.
- **Simple Metadata Access**: Retrieve critical file information with minimal effort.
  - Retrieve file name, type, size, and last modified time.
  - Access metadata as HTTP-style headers and preconfigured responses.
- **Vite Integration**: Built specifically for Vite, ensuring seamless integration.
  - Includes automatic TypeScript typings for `?file` imports.

## Installation

Install the plugin:

```shell
npm install @astropub/vite-plugin-file
```

Add the plugin to your Vite configuration file:

```js
// vite.config.js
import vitePluginFile from "@astropub/vite-plugin-file"

export default {
  plugins: [vitePluginFile()]
}
```

## Usage

Add the `?file` suffix to any file import to access its metadata and contents.

```js
import FaviconIco from "./assets/favicon.ico?file"
```

#### File Metadata

Retrieve basic metadata about any file.

```js
import FaviconIco from "./assets/favicon.ico?file"

console.log(FaviconIco.name)         // "favicon.ico"
console.log(FaviconIco.type)         // "image/x-icon"
console.log(FaviconIco.size)         // 9608
console.log(FaviconIco.lastModified) // 1735689600000
```

#### File Stream

Stream any file efficiently without loading it into memory.

```js
import FaviconIco from "./assets/favicon.ico?file"

const stream = FaviconIco.stream() // ReadableStream

const response = FaviconIco.response() // Response (with pre-configured headers)
```

#### Full File Access

Access the file as `ArrayBuffer`, `Blob`, or `File`.

```js
import FaviconIco from "./assets/favicon.ico?file"

const buffer = await FaviconIco.arrayBuffer()
console.log(buffer.byteLength) // 9608

const blob = await FaviconIco.blob()
console.log(blob.type)         // "image/x-icon"

const file = await FaviconIco.file()
console.log(file.name)         // "favicon.ico"
console.log(file.lastModified) // 1735689600000
```

#### File Metadata as Headers

Retrieve the file metadata as HTTP-style headers.

```js
import FaviconIco from "./assets/favicon.ico?file"

const headers = FaviconIco.headers()
console.log(headers.get("content-type"))   // "image/x-icon"
console.log(headers.get("content-length")) // "9608"
console.log(headers.get("last-modified"))  // "Wed, 01 Jan 2025 00:00:00 GMT"
```

## License

Licensed under the [MIT-0 License](https://opensource.org/license/mit-0).

<br />

Enjoy!

[npm-img]: https://img.shields.io/npm/v/@astropub/vite-plugin-file?color=%23444&label=&labelColor=%23CB0000&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjE1MCAxNTAgNDAwIDQwMCIgZmlsbD0iI0ZGRiI+PHBhdGggZD0iTTE1MCA1NTBoMjAwVjI1MGgxMDB2MzAwaDEwMFYxNTBIMTUweiIvPjwvc3ZnPg==&style=for-the-badge
[npm-url]: https://www.npmjs.com/package/@astropub/vite-plugin-file
[dl-url]: https://www.npmjs.com/package/@astropub/vite-plugin-file
[dl-img]: https://img.shields.io/badge/dynamic/json?url=https://api.npmjs.org/downloads/point/last-week/@astropub/vite-plugin-file&query=downloads&label=⇓+week&color=%23444&labelColor=%23EEd100&style=for-the-badge
