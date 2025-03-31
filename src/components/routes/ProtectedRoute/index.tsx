import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import liff from '@line/liff'
import api from '../../../libs/api'
import { useAuthStore } from '../../../pages/auth/hooks/useAuthStore'

const ProtectedRoute = () => {
  const location = useLocation()
  const { user, setAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isLiffInitialized, setIsLiffInitialized] = useState(false)
  const [isAuthChecked, setIsAuthChecked] = useState(false)

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID })
        setIsLiffInitialized(true)
      } catch (error) {
        console.error('LIFF initialization failed:', error)
        setIsLoading(false)
        setIsAuthChecked(true)
      }
    }

    initializeLiff()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLiffInitialized) return

      try {
        if (liff.isLoggedIn()) {
          const liffUser = await liff.getProfile()
          const response = await api.post('/app/auth/check_register', {
            line_id: liffUser.userId
          })

          if (response.status === 200 && response.data?.data) {
            setAuth(response.data.data)
          }
        }
      } catch (error: any) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
        setIsAuthChecked(true)
      }
    }

    if (isLiffInitialized && !isAuthChecked) {
      checkAuth()
    }
  }, [isLiffInitialized, setAuth, isAuthChecked])

  // If we're on the register page and LIFF is initialized, allow access
  if (location.pathname === '/auth/register' && isLiffInitialized) {
    return <Outlet />
  }

  // Show loading while we're initializing LIFF or checking auth
  if (isLoading || !isAuthChecked) {
    return <div>Loading...</div>
  }

  // If no user and we're not on register page, redirect to register
  if (!user) {
    return <Navigate to="/auth/register" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
