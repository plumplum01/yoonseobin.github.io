import { Outlet, useNavigation } from 'react-router-dom'
import Cursor from '../../components/layout/Cursor'
import GlobalNavigationBar from '../../components/layout/navigation/GlobalNavigationBar'
import PagePending from '../boundaries/PagePending'

export default function RootLayout() {
  const navigation = useNavigation()
  const isPending = navigation.state === 'loading'

  return (
    <>
      <Cursor />
      <GlobalNavigationBar />
      {isPending && <PagePending />}
      <Outlet />
    </>
  )
}
