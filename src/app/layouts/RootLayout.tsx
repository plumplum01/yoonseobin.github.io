import { matchPath, Outlet, useLocation, useNavigation } from 'react-router-dom'
import PagePending from '@/app/boundaries/PagePending'
import { PAGE_ROUTES } from '@/app/routes/pageRoutes'
import GlobalBreadcrumb from '@/components/layout/GlobalBreadcrumb'
import Cursor from '@/components/layout/GlobalCursor'
import Footer from '@/components/layout/GlobalFooter'
import GlobalNavigationBar from '@/components/layout/GlobalNavigation'
import { SurfaceProvider } from '@/context/SurfaceProvider'

function getCurrentPageRoute(pathname: string) {
	return PAGE_ROUTES.find((route) => matchPath({ path: route.path, end: true }, pathname))
}

export default function RootLayout() {
	const navigation = useNavigation()
	const { pathname } = useLocation()
	const isPending = navigation.state === 'loading'
	const pageRoute = getCurrentPageRoute(pathname)
	const pageLayout = pageRoute?.layout ?? 'scroll'
	const surface = pageRoute?.surface ?? 'scroll'
	const content = isPending ? <PagePending /> : <Outlet />

	return (
		<SurfaceProvider surface={surface}>
			{pageLayout === 'viewport' ? (
				<div className="flex h-svh flex-col overflow-hidden">
					<Cursor />
					<GlobalBreadcrumb />
					<GlobalNavigationBar />
					<div className="min-h-0 flex-1 overflow-hidden">{content}</div>
					<Footer />
				</div>
			) : (
				<>
					<Cursor />
					<GlobalBreadcrumb />
					<GlobalNavigationBar />
					{content}
					<Footer />
				</>
			)}
		</SurfaceProvider>
	)
}
