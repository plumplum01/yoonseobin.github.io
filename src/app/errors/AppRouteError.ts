export type AppRouteErrorKind = 'notFound' | 'contentInvalid' | 'contentUnavailable' | 'network'

type AppRouteErrorOptions = {
	cause?: unknown
	status?: number
}

export class AppRouteError extends Error {
	readonly kind: AppRouteErrorKind
	readonly status: number

	constructor(kind: AppRouteErrorKind, message: string, options: AppRouteErrorOptions = {}) {
		super(message, { cause: options.cause })
		this.name = 'AppRouteError'
		this.kind = kind
		this.status = options.status ?? (kind === 'notFound' ? 404 : 500)
	}
}

export function isAppRouteError(error: unknown): error is AppRouteError {
	return error instanceof AppRouteError
}
