/**
 * router — React Router 부트스트랩 (조립)
 *
 * pageRoutes 매니페스트를 받아 RouteObject 트리로 변환하고
 * createBrowserRouter로 구동한다. "무엇이 있는가"는 pageRoutes가 소유하고,
 * 이 파일은 "어떻게 구동하는가"만 책임진다.
 */

import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import PageError from '@/app/boundaries/PageError'
import RootLayout from '@/app/layouts/RootLayout'
import { PAGE_ROUTES } from '@/app/routes/pageRoutes'

function AppHydrateFallback() {
	return <div className="min-h-screen bg-background" aria-hidden="true" />
}

export const routes: RouteObject[] = [
	{
		element: <RootLayout />,
		errorElement: <PageError />,
		hydrateFallbackElement: <AppHydrateFallback />,
		children: PAGE_ROUTES.map(({ path, loader, render }) => ({
			path,
			loader,
			errorElement: <PageError />,
			element: render(),
		})),
	},
]

export const router = createBrowserRouter(routes, {
	basename: '/',
})
