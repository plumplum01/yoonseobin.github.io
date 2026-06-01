import type { ReactNode } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import About from '../pages/About'
import Home from '../pages/Home'
import PostDetail from '../pages/PostDetail'
import Posts from '../pages/Posts'

type AppPageRoute = {
  id: string
  path: string
  title: string
  smoothScroll: boolean
  render: (options: { smoothScrollEnabled: boolean }) => ReactNode
}

export const pageRoutes = [
  {
    id: 'home',
    path: '/',
    title: 'Home',
    smoothScroll: true,
    render: ({ smoothScrollEnabled }) => <Home smoothScrollEnabled={smoothScrollEnabled} />,
  },
  {
    id: 'about',
    path: '/about',
    title: 'About',
    smoothScroll: false,
    render: () => <About />,
  },
  {
    id: 'posts',
    path: '/posts',
    title: 'Posts',
    smoothScroll: false,
    render: () => <Posts />,
  },
  {
    id: 'post-detail',
    path: '/posts/:slug',
    title: 'Post',
    smoothScroll: false,
    render: () => <PostDetail />,
  },
] as const satisfies readonly AppPageRoute[]

export type AppRoutePath = (typeof pageRoutes)[number]['path']

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: pageRoutes.map(({ path, smoothScroll, render }) => ({
      path,
      element: render({ smoothScrollEnabled: smoothScroll }),
    })),
  },
]

export const router = createBrowserRouter(routes, {
  basename: '/',
})
