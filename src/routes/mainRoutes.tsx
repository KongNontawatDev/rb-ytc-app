import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import { Outlet } from "react-router-dom";
import { ErrorBoundaryWrapper } from "../components/error";
import MainLayoutLoading from "../components/layouts/MainLayout/loading";
import MainLayout from "../components/layouts/MainLayout/Layout";

// Lazy load all pages

const Home = lazy(() => import("../pages/home"));
const RoomAll = lazy(() => import("../pages/room"));
const RoomEmpty = lazy(() => import("../pages/room/empty"));
const RoomDetail = lazy(() => import("../pages/room/detail"));
const Booking = lazy(() => import("../pages/booking"));
const BookingDetail = lazy(() => import("../pages/booking/detail"));
const History = lazy(() => import("../pages/profile/history"));
const Profile = lazy(() => import("../pages/profile"));


// Modified MainLayoutWithSuspense to include Suspense
const MainLayoutWithSuspenseWrapper = () => {
	return (
		<MainLayout>
			<ErrorBoundaryWrapper>
				<Suspense fallback={<MainLayoutLoading />}>
					<Outlet />
				</Suspense>
			</ErrorBoundaryWrapper>
		</MainLayout>
	);
};

const mainRoutes = {
	path: "/",
	element: <ProtectedRoute />,
	errorElement: (
		<ErrorBoundaryWrapper>
			<Outlet />
		</ErrorBoundaryWrapper>
	),
	children: [
		{
			element: <MainLayoutWithSuspenseWrapper />,
			children: [
				{ index: true, element: <Home/> },
				{ path:'/room/list/all', element: <RoomAll/> },
				{ path:'/room/list/empty', element: <RoomEmpty/> },
				{ path:'/room/:id', element: <RoomDetail/> },
				{ path:'/booking', element: <Booking/> },
				{ path:'/booking/detail/:id', element: <BookingDetail/> },
				{ path:'/profile/history', element: <History/> },
				{ path:'/profile', element: <Profile/> },
			],
		},
	],
};




export default mainRoutes;
