import { Outlet } from 'react-router-dom'
import Cursor from '../../components/Cursor'
import GlobalNavigationBar from '../../components/navigation/GlobalNavigationBar'

export default function RootLayout() {
  return (
    <>
      <Cursor />
      <GlobalNavigationBar />
      <Outlet />
    </>
  )
}
