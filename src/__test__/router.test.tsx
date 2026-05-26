import { describe, expect, it } from 'vitest'
import { pageRoutes, routes } from '../app/router'

describe('router config', () => {
  it('defines unique page route paths', () => {
    const paths = pageRoutes.map((route) => route.path)

    expect(new Set(paths).size).toBe(paths.length)
  })

  it('maps page route paths into the root layout children', () => {
    expect(routes[0]?.children?.map((route) => route.path)).toEqual(
      pageRoutes.map((route) => route.path),
    )
  })

  it('includes required public pages', () => {
    expect(pageRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'home', path: '/', title: 'Home' }),
        expect.objectContaining({ id: 'about', path: '/about', title: 'About' }),
      ]),
    )
  })

  it('controls smooth scroll per page route', () => {
    expect(pageRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'home', smoothScroll: true }),
        expect.objectContaining({ id: 'about', smoothScroll: false }),
      ]),
    )
  })
})
