import { Outlet, useNavigation } from 'react-router-dom'
import PagePending from '@/app/boundaries/PagePending'
import GlobalBreadcrumb from '@/components/layouts/globals/GlobalBreadcrumb'
import Cursor from '@/components/layouts/globals/GlobalCursor'
import Footer from '@/components/layouts/globals/GlobalFooter'
import GlobalNavigationBar from '@/components/layouts/globals/GlobalNavigation'

export default function RootLayout() {
	const navigation = useNavigation()
	const isPending = navigation.state === 'loading'

	return (
		<>
			<Cursor />
			<GlobalBreadcrumb />
			<GlobalNavigationBar />
			{isPending && <PagePending />}
			<Outlet />
			<Footer />
		</>
	)
}
