const prefix = "\x00file:"
const suffix = "?file"

export default function viteFilePlugin() {
	/** @type {import('vite').Plugin} */
	const plugin = {
		name: "vite-plugin-file",
		enforce: "pre",
		async resolveId(source, importer, options) {
			if (source.endsWith(suffix)) {
				/** @type {{ id: string | null | undefined }} */
				const { id } = Object(
					await this.resolve(source.slice(0, -suffix.length), importer, {
						skipSelf: true,
						...Object(options),
					}),
				)

				if (id) {
					return prefix + id + suffix
				}
			}
		},
		load(id) {
			if (id.startsWith(prefix) && id.endsWith(suffix)) {
				const path = id.slice(prefix.length, -suffix.length)
				const name = path.split("/").pop()
				const extn = path.replace(/.*(\.[^.]+)$/, "$1").toLowerCase()
				const type = contentTypes[extn] || null

				const code = [
					`import { createReadStream, promises } from "node:fs"`,
					`import { Readable } from "node:stream"`,

					// internal properties
					`const path = ${JSON.stringify(path)}`,

					// properties
					`export const name = ${JSON.stringify(name)}`,
					`export const type = ${JSON.stringify(type)}`,
					`export const { mtimeMs: lastModified, size } = await promises.stat(path).catch(() => ({ mtimeMs: Date.now(), size: 0 })) // ""`,

					// computed properties
					`export const headers = new Headers({ "content-type": type, "content-length": size.toString(), "last-modified": new Date(lastModified).toUTCString() })`,

					// methods
					`export const arrayBuffer = () => promises.readFile(path).then(buffer => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)) // ""`,
					`export const blob = () => arrayBuffer().then(arrayBuffer => new Blob([arrayBuffer], { type })) // ""`,
					`export const file = () => arrayBuffer().then(arrayBuffer => new File([arrayBuffer], name, { type, lastModified })) // ""`,
					`export const json = () => text().then(JSON.parse) // ""`,
					`export const response = () => new Response(stream(), { headers }) // ""`,
					`export const stream = () => Readable.toWeb(createReadStream(path)) // ""`,
					`export const text = () => promises.readFile(path, "utf-8")`,

					// default export
					`export default { name, type, size, lastModified, headers, arrayBuffer, blob, file, json, response, stream, text } // ""`,
				].join("\n")

				return {
					code,
				}
			}
		},
	}

	return plugin
}

/** @type {Record<string, string>} */
const contentTypes = {
	// text
	".css": "text/css",
	".csv": "text/csv",
	".html": "text/html",
	".js": "text/javascript",
	".md": "text/markdown",
	".txt": "text/plain",
	".xml": "text/xml",
	".yaml": "text/yaml",
	".yml": "text/yaml",

	// images
	".avif": "image/avif",
	".gif": "image/gif",
	".heic": "image/heic",
	".ico": "image/x-icon",
	".jpeg": "image/jpeg",
	".jpg": "image/jpeg",
	".jxl": "image/jxl",
	".png": "image/png",
	".svg": "image/svg+xml",
	".tif": "image/tiff",
	".tiff": "image/tiff",
	".webp": "image/webp",

	// video
	".mkv": "video/x-matroska",
	".mov": "video/quicktime",
	".mp4": "video/mp4",
	".webm": "video/webm",

	// audio
	".aac": "audio/aac",
	".flac": "audio/flac",
	".m4a": "audio/x-m4a",
	".mp3": "audio/mpeg",
	".ogg": "audio/ogg",
	".opus": "audio/opus",
	".wav": "audio/wav",
	".weba": "audio/webm",

	// model
	".glb": "model/gltf-binary",
	".gltf": "model/gltf+json",
	".stl": "model/stl",

	// fonts
	".otf": "font/otf",
	".ttf": "font/ttf",
	".woff": "font/woff",
	".woff2": "font/woff2",

	// application data
	".7z": "application/x-7z-compressed",
	".apk": "application/vnd.android.package-archive",
	".br": "application/x-brotli",
	".deb": "application/vnd.debian.binary-package",
	".gz": "application/gzip",
	".json": "application/json",
	".jsonld": "application/ld+json",
	".pdf": "application/pdf",
	".rpm": "application/x-rpm",
	".tar": "application/x-tar",
	".wasm": "application/wasm",
	".zip": "application/zip",
	".zst": "application/zstd",
}
