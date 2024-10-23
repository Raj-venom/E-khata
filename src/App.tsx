
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Header from './components/Header/Header'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import authService from './services/auth'
import { login, logout } from './features/auth/authSlice'
function App() {
  const dispatch = useDispatch()
  const authStatus = useSelector((state: any) => state.auth.status)
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    setLoading(true)
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))

  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between'>
      <div className='w-full block'>
        {authStatus && <Header />}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  ) : <div className='flex justify-center items-center h-screen font-semibold text-4xl ' >loading...</div>

}

export default App
