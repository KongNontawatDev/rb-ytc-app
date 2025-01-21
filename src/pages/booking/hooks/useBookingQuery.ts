import { useQuery } from "@tanstack/react-query";
import api from "../../../libs/api";

export const useBookingCurrentMonth = () => {
	return useQuery({
		queryKey: ["booking_list_by_month"],
		queryFn: async () => {
			const { data } = await api.get(`/app/booking_list/by/month`);
			return data;
		},
	});
};

export const useBookingById = (id: number | null | undefined) => {
	return useQuery({
		queryKey: id ? ["booking_list", id] : ["booking_list"],
		queryFn: async () => {
			if (id) {
				const { data } = await api.get(`/app/booking_list/${id}`);
				return data;
			} else {
				throw new Response("ไม่พบข้อมูลนี้", { status: 404 });
			}
		},
	});
};

export const useBookingsByUserId = (user_id: number | null | undefined) => {
	return useQuery({
		queryKey: user_id ? ["booking_list_by_user", user_id] : ["booking_list_by_user"],
		queryFn: async () => {
			if (user_id) {
				const { data } = await api.get(`/app/booking_list/by/user/${user_id}`);
				return data;
			} else {
				throw new Response("ไม่พบข้อมูลนี้", { status: 404 });
			}
		},
	});
};
