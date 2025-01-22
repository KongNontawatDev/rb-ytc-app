import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import liff from '@line/liff'
import api from '../../../libs/api'
import { useAuthStore } from '../../../pages/auth/hooks/useAuthStore'

const ProtectedRoute = () => {
  const location = useLocation()
  const { user, setAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      // If user exists in store, no need to check further
      if (user) {
        setIsLoading(false)
        return
      }

      try {
        // Get LINE user profile
        const liffUser = await liff.getProfile()
        
        // Check if user exists in database
        const response = await api.post('/app/auth/check_register', {
          line_id: liffUser.userId
        })

        // If user found in database, store in auth store
        if ((response.status === 200 && response.data?.data) || response.status === 201) {
          setAuth(response.data.data)
          setShouldRedirect(false)
        }
      } catch (error: any) {
        console.error('Auth check failed:', error)
        
        // If user not found in database (304) or other errors
        if (error.response?.status === 304 || error.response?.status === 404) {
          setShouldRedirect(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [user, setAuth, location])

  // Skip protection for register path
  if (location.pathname === '/auth/register') {
    return <Outlet />
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Redirect to register if no user found in store and database
  if (!user && shouldRedirect) {
    return <Navigate to="/auth/register" replace />
  }

  // Allow access if user exists in store
  if (user) {
    return <Outlet />
  }

  // Show loading while checking database
  return <div>Loading...</div>
}

export default ProtectedRoute
// import React, { useEffect } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../../pages/auth/hooks/useAuth";
// import { Spin } from "antd";
// import { encryptStorage } from "../../../libs/encryptStorage";

// interface Props {
// 	redirectPath?: string;
// }

// const ProtectedRoute: React.FC<Props> = ({ redirectPath = "/auth/login" }) => {
// 	const { isAuthenticated, isLoading } = useAuth();
//   // const token = encryptStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImNvbnRleHQiOiJVNzUxZTdkNzA2MWYxYTNkNzRkYjhmMTJjODgxMTFiMzciLCJhY3RvciI6InVzZXIiLCJpYXQiOjE3MzcyNjQ3ODgsImV4cCI6MTczNzI2ODM4OH0.oHLuxI-eVdqsETOEqCcRBMQaaOXvorkGtQRakebitGY');
// 	// Show loading state while checking authentication
// 	if (isLoading) {
// 		return (
// 			<Spin spinning={isLoading} fullscreen>
// 				<div className="flex items-center justify-center min-h-screen">
// 					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
// 				</div>
// 			</Spin>
// 		);
// 	}


// 	// Redirect if not authenticated
// 	// if (!isAuthenticated) {
// 	// 	return <Navigate to={redirectPath} replace />;
// 	// }

// 	// Render child routes if authenticated
// 	return <Outlet />;
// };

// export default ProtectedRoute;
