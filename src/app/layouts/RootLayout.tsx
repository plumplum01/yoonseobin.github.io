import { matchPath, Outlet, useLocation, useNavigation } from 'react-router-dom'
import PagePending from '@/app/boundaries/PagePending'
import { PAGE_ROUTES } from '@/app/routes/pageRoutes'
import GlobalBreadcrumb from '@/components/layout/GlobalBreadcrumb'
import Cursor from '@/components/layout/GlobalCursor'
import Footer from '@/components/layout/GlobalFooter'
import GlobalNavigationBar from '@/components/layout/GlobalNavigation'

function getCurrentPageLayout(pathname: string) {
	const currentRoute = PAGE_ROUTES.find((route) =>
		matchPath({ path: route.path, end: true }, pathname),
	)

	return currentRoute?.layout ?? 'default'
}

export default function RootLayout() {
	const navigation = useNavigation()
	const { pathname } = useLocation()
	const isPending = navigation.state === 'loading'
	const pageLayout = getCurrentPageLayout(pathname)
	const content = isPending ? <PagePending /> : <Outlet />

	if (pageLayout === 'viewport') {
		return (
			<div className="flex h-[100svh] flex-col overflow-hidden">
				<Cursor />
				<GlobalBreadcrumb />
				<GlobalNavigationBar />
				<div className="min-h-0 flex-1 overflow-hidden">{content}</div>
				<Footer />
			</div>
		)
	}

	return (
		<>
			<Cursor />
			<GlobalBreadcrumb />
			<GlobalNavigationBar />
			{content}
			<Footer />
		</>
	)
}
