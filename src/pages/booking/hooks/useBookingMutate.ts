import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Booking } from "../types";
import api from "../../../libs/api";


// Hook สำหรับเพิ่มข้อมูลสินค้า
export const useCreateBooking = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (newBooking: Omit<Booking,'id'>) => {

			// Insert the Booking into the database
			const { data } = await api.post(`/app/booking_list`, newBooking);

			if (!data) {
				throw new Error(`Booking creation failed`);
			}

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["booking_lists"] });
			handleSuccess();
		},
	});
};


// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateBooking = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number) => {
			const { data } = await api.patch(
				`/app/booking_list/update/status/${id}`,
				{status:3}
			);
			if (!data) throw new Error("Booking updated fail");
			return data;
		},
		onSuccess: () => {
			
			queryClient.invalidateQueries({ queryKey: ["booking_lists"] });
			queryClient.invalidateQueries({ queryKey: ["booking_list"] });
			handleSuccess();
		},
	});
};



// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateStatusBooking = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			updateBookingData: Pick<Booking, "status" | "id">
		) => {
			if (updateBookingData.id) {
				const { data } = await api.patch(
					`/app/booking_list/update/status/${updateBookingData.id}`,
					{ status: updateBookingData.status }
				);
				if (!data) throw new Error("Booking updated fail");
				return data;
			} else {
				throw new Error("Booking updated fail : Not id");
			}
		},
		onSuccess: () => {
			
			queryClient.invalidateQueries({ queryKey: ["booking_lists"] });
			queryClient.invalidateQueries({ queryKey: ["booking_list"] });
			handleSuccess();
		},
	});
};
