import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#0a0f1e]">
      <Sidebar />
      <main className="flex-1 lg:ml-60 min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
