import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/AdminPanel/Sidebar'

const AdminLayout = () => {
  return (
    <>
    <main>
        <Sidebar />
        <Outlet/>
    </main>
    </>
  )
}

export default AdminLayout

