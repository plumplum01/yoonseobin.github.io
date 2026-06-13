import { isRouteErrorResponse } from 'react-router-dom'
import { isAppRouteError } from '@/app/errors/AppRouteError'

export type RouteErrorView = {
	title: string
	message: string
	backTo: string
	backLabel: string
}

const defaultErrorView: RouteErrorView = {
	title: 'Something went wrong',
	message: 'Please try again later.',
	backTo: '/',
	backLabel: 'Back to home',
}

export function getRouteErrorView(error: unknown): RouteErrorView {
	if (isAppRouteError(error)) {
		switch (error.kind) {
			case 'notFound':
				return {
					title: 'Article not found',
					message: 'The article may have been removed or is not published yet.',
					backTo: '/articles',
					backLabel: 'Back to articles',
				}
			case 'contentInvalid':
				return {
					title: 'Content is unavailable',
					message: 'This content cannot be displayed right now.',
					backTo: '/',
					backLabel: 'Back to home',
				}
			case 'contentUnavailable':
			case 'network':
				return {
					title: 'Content is unavailable',
					message: 'Please try again later.',
					backTo: '/',
					backLabel: 'Back to home',
				}
		}
	}

	if (isRouteErrorResponse(error) && error.status === 404) {
		return {
			title: 'Page not found',
			message: 'The page may have been moved or removed.',
			backTo: '/',
			backLabel: 'Back to home',
		}
	}

	return defaultErrorView
}
