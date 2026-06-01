import type { ReactNode } from 'react'
import { createBrowserRouter, type LoaderFunction, type RouteObject } from 'react-router-dom'
import PageError from './boundaries/PageError'
import RootLayout from './layouts/RootLayout'
import { postDetailLoader, postsLoader, profileLoader } from './routes/routeLoaders'
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
  loader?: LoaderFunction
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
    loader: profileLoader,
    render: () => <About />,
  },
  {
    id: 'posts',
    path: '/posts',
    title: 'Posts',
    smoothScroll: false,
    loader: postsLoader,
    render: () => <Posts />,
  },
  {
    id: 'post-detail',
    path: '/posts/:slug',
    title: 'Post',
    smoothScroll: false,
    loader: postDetailLoader,
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
