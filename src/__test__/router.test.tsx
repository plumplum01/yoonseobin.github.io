import { describe, expect, it } from 'vitest'
import { pageRoutes, routes } from '../app/router'

describe('router config', () => {
  it('defines unique page route paths', () => {
    const paths = pageRoutes.map((route) => route.path)

    expect(new Set(paths).size).toBe(paths.length)
  })

  it('maps page routes into the root layout children', () => {
    expect(routes[0]?.children).toEqual(
      pageRoutes.map(({ path, element }) => ({
        path,
        element,
      })),
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
})
