import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import liff from '@line/liff'
import api from '../../../libs/api'
import { useAuthStore } from '../../../pages/auth/hooks/useAuthStore'

const ProtectedRoute = () => {
  const location = useLocation()
  const { user, setAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        setIsLoading(false)
        return
      }
      // else {
      //   const liffUser = await liff.getProfile()
      //   const response = await api.post('/app/auth/check_register', {
      //     line_id: liffUser.userId
      //   })

      //   if (response.status === 200 && response.data?.data) {
      //     setAuth(response.data.data)
      //   }
      // }

      try {
        const liffUser = await liff.getProfile()
        const response = await api.post('/app/auth/check_register', {
          line_id: liffUser.userId
        })

        if (response.status === 200 && response.data?.data) {
          setAuth(response.data.data)
        }
      } catch (error: any) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [user, setAuth])

  if (location.pathname === '/auth/register') {
    return <Outlet />
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/auth/register" replace />
  }

  return <Outlet />
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
