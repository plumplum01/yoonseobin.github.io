import type { ReactNode } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import About from '../pages/About'
import Home from '../pages/Home'

type AppPageRoute = {
  id: string
  path: string
  title: string
  element: ReactNode
}

export const pageRoutes: AppPageRoute[] = [
  {
    id: 'home',
    path: '/',
    title: 'Home',
    element: <Home />,
  },
  {
    id: 'about',
    path: '/about',
    title: 'About',
    element: <About />,
  },
]

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: pageRoutes.map(({ path, element }) => ({
      path,
      element,
    })),
  },
]

export const router = createBrowserRouter(routes, {
  basename: '/',
})
