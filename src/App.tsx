import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import AntDesignProvider from "./components/layouts/AntDesignProvider";
import i18n from "./libs/i18n";
import { I18nextProvider } from "react-i18next";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./libs/reactQuery";
import { useEffect } from "react";
import liff from "@line/liff";
import { Analytics } from "@vercel/analytics/react";
export default function App() {
	useEffect(() => {
		const initLiff = async () => {
			try {
				await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
				if (!liff.isLoggedIn()) {
					liff.login();
				}
			} catch (error) {
				console.error("LIFF init failed", error);
			}
		};
		initLiff();
	}, []);

	return (
		<>
			<Analytics />
			<I18nextProvider i18n={i18n}>
				<QueryClientProvider client={queryClient}>
					<AntDesignProvider>
						<RouterProvider router={router} />
					</AntDesignProvider>
				</QueryClientProvider>
			</I18nextProvider>
		</>
	);
}
