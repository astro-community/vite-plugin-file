import type { Plugin } from "vite"

global {
	declare module "*?file" {
		// properties
		export const name: string
		export const type: string
		export const size: number
		export const lastModified: number

		// computed properties
		export const headers: Headers

		// methods
		export const arrayBuffer: () => Promise<ArrayBuffer>
		export const blob: () => Promise<Blob>
		export const file: () => Promise<File>
		export const json: <T>() => Promise<T>
		export const response: () => Response
		export const stream: () => ReadableStream
		export const text: () => Promise<string>

		export default {
			name,
			type,
			size,
			lastModified,
			headers,
			arrayBuffer,
			blob,
			file,
			json,
			response,
			stream,
			text,
		}
	}
}

declare const plugin: () => Plugin

export default plugin
