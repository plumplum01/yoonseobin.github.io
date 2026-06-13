import { createContext, type ReactNode, useContext } from 'react'

export type Surface = 'detail' | 'viewport' | 'scroll'

const SurfaceContext = createContext<Surface>('scroll')

export function SurfaceProvider({
	children,
	surface,
}: {
	children: ReactNode
	surface: Surface
}) {
	return <SurfaceContext.Provider value={surface}>{children}</SurfaceContext.Provider>
}

export function useSurface() {
	return useContext(SurfaceContext)
}
