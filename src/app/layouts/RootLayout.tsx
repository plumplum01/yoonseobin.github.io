import { Outlet } from 'react-router-dom'
import Cursor from '../../components/layout/Cursor'
import GlobalNavigationBar from '../../components/layout/navigation/GlobalNavigationBar'

export default function RootLayout() {
  return (
    <>
      <Cursor />
      <GlobalNavigationBar />
      <Outlet />
    </>
  )
}
