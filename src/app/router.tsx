import type { ReactNode } from 'react'
import { createBrowserRouter, type LoaderFunction, type RouteObject } from 'react-router-dom'
import PageError from '@/app/boundaries/PageError'
import RootLayout from '@/app/layouts/RootLayout'
import { postDetailLoader, postsLoader, profileLoader } from '@/app/routes/routeLoaders'
import About from '@/pages/About'
import Home from '@/pages/Home'
import PostDetail from '@/pages/PostDetail'
import Posts from '@/pages/Posts'

type AppPageRoute = {
	id: string
	path: string
	title: string
	/** 전역 네비게이션 메뉴에 링크로 노출할지 여부 (동적 상세 라우트는 false) */
	nav: boolean
	smoothScroll: boolean
	loader?: LoaderFunction
	render: (options: { smoothScrollEnabled: boolean }) => ReactNode
}

export const pageRoutes = [
	{
		id: 'home',
		path: '/',
		title: 'Home',
		nav: true,
		smoothScroll: true,
		loader: undefined,
		render: ({ smoothScrollEnabled }) => <Home smoothScrollEnabled={smoothScrollEnabled} />,
	},
	{
		id: 'about',
		path: '/about',
		title: 'About',
		nav: true,
		smoothScroll: false,
		loader: profileLoader,
		render: () => <About />,
	},
	{
		id: 'posts',
		path: '/posts',
		title: 'Posts',
		nav: true,
		smoothScroll: false,
		loader: postsLoader,
		render: () => <Posts />,
	},
	{
		id: 'post-detail',
		path: '/posts/:slug',
		title: 'Post',
		nav: false,
		smoothScroll: false,
		loader: postDetailLoader,
		render: () => <PostDetail />,
	},
] as const satisfies readonly AppPageRoute[]

export type AppRoutePath = (typeof pageRoutes)[number]['path']

/** 전역 네비게이션 메뉴에 노출할 라우트 (선언 순서 = 메뉴 순서) */
export const navRoutes = pageRoutes.filter((route) => route.nav)

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
