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
import { pageRoutes } from '@/app/routes/pageRoutes'

export const routes: RouteObject[] = [
	{
		element: <RootLayout />,
		errorElement: <PageError />,
		children: pageRoutes.map(({ path, smoothScroll, loader, render }) => ({
			path,
			loader,
			errorElement: <PageError />,
			element: render({ smoothScrollEnabled: smoothScroll }),
		})),
	},
]

export const router = createBrowserRouter(routes, {
	basename: '/',
})
