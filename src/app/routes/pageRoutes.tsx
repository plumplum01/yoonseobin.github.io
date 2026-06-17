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

import { lazy, Suspense, type ReactNode } from 'react'
import type { LoaderFunction } from 'react-router-dom'
import {
	articleDetailLoader,
	articlesLoader,
	profileLoader,
	projectDetailLoader,
	projectsLoader,
	reelsLoader,
} from '@/app/routes/routeLoaders'
import type { Surface } from '@/context/SurfaceProvider'

const Home = lazy(() => import('@/pages/Home/Home'))
const About = lazy(() => import('@/pages/About/About'))
const Articles = lazy(() => import('@/pages/Articles/Articles'))
const Reels = lazy(() => import('@/pages/Reels/Reels'))
const Projects = lazy(() => import('@/pages/Projects/Projects'))
const ArticleDetail = lazy(() => import('@/pages/Articles/ArticleDetail'))
const ProjectDetail = lazy(() => import('@/pages/Projects/ProjectDetail'))

function PageFallback() {
	return <div className="min-h-screen bg-background" aria-hidden="true" />
}

function renderPage(page: ReactNode) {
	return <Suspense fallback={<PageFallback />}>{page}</Suspense>
}

type AppPageRoute = {
	id: string
	path: string
	title: string
	layout: 'scroll' | 'viewport'
	surface: Surface
	navLabel?: string
	navTone?: 'neutral' | 'accent'
	/** 전역 네비게이션 메뉴에 링크로 노출할지 여부 (동적 상세 라우트는 false) */
	nav: boolean
	smoothScroll: boolean
	loader?: LoaderFunction
	render: () => ReactNode
}

export const PAGE_ROUTES = [
	{
		id: 'home',
		path: '/',
		title: 'Home',
		layout: 'viewport',
		surface: 'viewport',
		navLabel: 'Seobin',
		navTone: 'neutral',
		nav: true,
		smoothScroll: false,
		loader: undefined,
		render: () => renderPage(<Home />),
	},
	{
		id: 'about',
		path: '/about',
		title: 'About',
		layout: 'scroll',
		surface: 'scroll',
		navTone: 'accent',
		nav: true,
		smoothScroll: true,
		loader: profileLoader,
		render: () => renderPage(<About />),
	},
	{
		id: 'articles',
		path: '/articles',
		title: 'Articles',
		layout: 'scroll',
		surface: 'scroll',
		navLabel: 'Articles',
		navTone: 'neutral',
		nav: true,
		smoothScroll: true,
		loader: articlesLoader,
		render: () => renderPage(<Articles />),
	},
	{
		id: 'reels',
		path: '/reels',
		title: 'Reels',
		layout: 'scroll',
		surface: 'scroll',
		navLabel: 'Reels',
		navTone: 'neutral',
		nav: true,
		smoothScroll: true,
		loader: reelsLoader,
		render: () => renderPage(<Reels />),
	},
	{
		id: 'projects',
		path: '/projects',
		title: 'Projects',
		layout: 'scroll',
		surface: 'scroll',
		navLabel: 'Projects',
		navTone: 'neutral',
		nav: true,
		smoothScroll: true,
		loader: projectsLoader,
		render: () => renderPage(<Projects />),
	},
	{
		id: 'article-detail',
		path: '/articles/:slug',
		title: 'Article',
		layout: 'scroll',
		surface: 'detail',
		nav: false,
		smoothScroll: true,
		loader: articleDetailLoader,
		render: () => renderPage(<ArticleDetail />),
	},
	{
		id: 'project-detail',
		path: '/projects/:slug',
		title: 'Project',
		layout: 'scroll',
		surface: 'detail',
		nav: false,
		smoothScroll: true,
		loader: projectDetailLoader,
		render: () => renderPage(<ProjectDetail />),
	},
] as const satisfies readonly AppPageRoute[]

export type AppRoutePath = (typeof PAGE_ROUTES)[number]['path']

/** 전역 네비게이션 메뉴에 노출할 라우트 (선언 순서 = 메뉴 순서) */
export const NAVIGATION_ROUTES = PAGE_ROUTES.filter((route) => route.nav)
