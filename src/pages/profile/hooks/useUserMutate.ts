import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../types";
import api from "../../../libs/api";




// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateUser = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (updateUserData: User) => {
			const { data } = await api.patch(
				`/app/user/${updateUserData.id}`,
				updateUserData,{
				headers:{
					"Content-Type":"multipart/form-data"
				}
			}
			);
			if (!data) throw new Error("User updated fail");
			return data;
		},
		onSuccess: () => {
			
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["user"] });
			handleSuccess();
		},
	});
};

