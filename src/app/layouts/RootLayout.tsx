import { matchPath, Outlet, useLocation } from 'react-router-dom'
import { PAGE_ROUTES } from '@/app/routes/pageRoutes'
import GlobalBreadcrumb from '@/components/layout/GlobalBreadcrumb'
import Cursor from '@/components/layout/GlobalCursor'
import Footer from '@/components/layout/GlobalFooter'
import GlobalNavigationBar from '@/components/layout/GlobalNavigation'
import { SmoothScrollProvider } from '@/context/SmoothScrollProvider'
import { SurfaceProvider } from '@/context/SurfaceProvider'

function getCurrentPageRoute(pathname: string) {
	return PAGE_ROUTES.find((route) => matchPath({ path: route.path, end: true }, pathname))
}

export default function RootLayout() {
	const { pathname } = useLocation()
	const pageRoute = getCurrentPageRoute(pathname)
	const pageLayout = pageRoute?.layout ?? 'scroll'
	const surface = pageRoute?.surface ?? 'scroll'
	const smoothScroll = pageRoute?.smoothScroll ?? false
	const content = <Outlet />

	return (
		<SurfaceProvider surface={surface}>
			<SmoothScrollProvider enabled={smoothScroll}>
				{pageLayout === 'viewport' ? (
					<div className="relative flex h-svh flex-col overflow-hidden">
						<Cursor />
						<GlobalBreadcrumb />
						<GlobalNavigationBar />
						<div className="min-h-0 flex-1 overflow-hidden">{content}</div>
						<Footer />
					</div>
				) : (
					<div className="relative min-h-screen">
						<Cursor />
						<GlobalBreadcrumb />
						<GlobalNavigationBar />
						{content}
						<Footer />
					</div>
				)}
			</SmoothScrollProvider>
		</SurfaceProvider>
	)
}
