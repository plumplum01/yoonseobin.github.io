/**
 * pageRoutes — 앱 페이지 모델 (매니페스트)
 *
 * 각 페이지의 선언적 메타(path, title, nav, smoothScroll)와 그 페이지를
 * 어떻게 그릴지(render)·어떤 데이터를 미리 불러올지(loader)를 한 항목으로
 * 묶어 선언한다. "무엇이 있는가"의 단일 출처(SSOT)이며, React Router로
 * "어떻게 구동하는가"는 router.tsx가 담당한다.
 *
 * 네비게이션 메뉴는 여기서 파생된 navRoutes를 소비하므로, 라우터 부트스트랩
 * (createBrowserRouter)에 의존하지 않는다.
 */

import type { ReactNode } from 'react'
import type { LoaderFunction } from 'react-router-dom'
import {
	postDetailLoader,
	postsLoader,
	profileLoader,
	reelsLoader,
} from '@/app/routes/routeLoaders'
import About from '@/pages/About'
import Home from '@/pages/Home'
import PostDetail from '@/pages/PostDetail'
import Posts from '@/pages/Posts'
import Reels from '@/pages/Reels'

type AppPageRoute = {
	id: string
	path: string
	title: string
	navLabel?: string
	navTone?: 'neutral' | 'accent'
	/** 전역 네비게이션 메뉴에 링크로 노출할지 여부 (동적 상세 라우트는 false) */
	nav: boolean
	smoothScroll: boolean
	loader?: LoaderFunction
	render: (options: { smoothScrollEnabled: boolean }) => ReactNode
}

export const PAGE_ROUTES = [
	{
		id: 'home',
		path: '/',
		title: 'Home',
		navLabel: 'Seobin',
		navTone: 'neutral',
		nav: true,
		smoothScroll: true,
		loader: undefined,
		render: ({ smoothScrollEnabled }) => <Home smoothScrollEnabled={smoothScrollEnabled} />,
	},
	{
		id: 'about',
		path: '/about',
		title: 'About',
		navTone: 'accent',
		nav: true,
		smoothScroll: false,
		loader: profileLoader,
		render: () => <About />,
	},
	{
		id: 'posts',
		path: '/posts',
		title: 'Posts',
		navLabel: 'Articles',
		navTone: 'neutral',
		nav: true,
		smoothScroll: false,
		loader: postsLoader,
		render: () => <Posts />,
	},
	{
		id: 'reels',
		path: '/reels',
		title: 'Reels',
		navLabel: 'Reels',
		navTone: 'neutral',
		nav: true,
		smoothScroll: false,
		loader: reelsLoader,
		render: () => <Reels />,
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

export type AppRoutePath = (typeof PAGE_ROUTES)[number]['path']

/** 전역 네비게이션 메뉴에 노출할 라우트 (선언 순서 = 메뉴 순서) */
export const NAVIGATION_ROUTES = PAGE_ROUTES.filter((route) => route.nav)
