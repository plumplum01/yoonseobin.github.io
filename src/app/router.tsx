import type { ReactNode } from 'react'
import {
  createBrowserRouter,
  type LoaderFunctionArgs,
  type RouteObject,
} from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import PageError from './route-state/PageError'
import About from '../pages/About'
import Home from '../pages/Home'
import PostDetail from '../pages/PostDetail'
import Posts from '../pages/Posts'
import { loadProfile } from '../registry/profile'
import { loadPost, loadPosts } from '../registry/posts'

type AppPageRoute = {
  id: string
  path: string
  title: string
  smoothScroll: boolean
  loader?: (args: LoaderFunctionArgs) => unknown
  render: (options: { smoothScrollEnabled: boolean }) => ReactNode
}

function loadPostRoute({ params }: LoaderFunctionArgs) {
  if (!params.slug) {
    throw new Error('Post slug is missing')
  }

  return loadPost(params.slug)
}

export const pageRoutes = [
  {
    id: 'home',
    path: '/',
    title: 'Home',
    smoothScroll: true,
    loader: undefined,
    render: ({ smoothScrollEnabled }) => <Home smoothScrollEnabled={smoothScrollEnabled} />,
  },
  {
    id: 'about',
    path: '/about',
    title: 'About',
    smoothScroll: false,
    loader: () => loadProfile(),
    render: () => <About />,
  },
  {
    id: 'posts',
    path: '/posts',
    title: 'Posts',
    smoothScroll: false,
    loader: () => loadPosts(),
    render: () => <Posts />,
  },
  {
    id: 'post-detail',
    path: '/posts/:slug',
    title: 'Post',
    smoothScroll: false,
    loader: loadPostRoute,
    render: () => <PostDetail />,
  },
] as const satisfies readonly AppPageRoute[]

export type AppRoutePath = (typeof pageRoutes)[number]['path']

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
