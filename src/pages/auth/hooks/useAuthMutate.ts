import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNotification } from "../../../hooks/useNotification";
import api from "../../../libs/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../types/axiosType";
import { handleApiError } from "../../../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import { User } from "../../profile/types";
import { useAuthStore } from "./useAuthStore";

// Hook สำหรับเพิ่มข้อมูลสินค้า
export const useCreateUser = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { t } = useTranslation(["common"]);
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const authStore = useAuthStore()
	const navigate = useNavigate();
	return useMutation({
	mutationFn: async (newUser: Partial<User>) => {
			delete newUser.id;

			// Insert the User into the database
			const { data } = await api.post(`/app/auth/register`, newUser,{
				headers:{
					"Content-Type":"multipart/form-data"
				}
			});

			if (!data) {
				throw new Error(`User creation failed`);
			}
			authStore.setAuth(data.data)
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:createData.success", { data: "ผู้ใช้" })
			);
			handleSuccess();
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			handleApiError(error, showErrorNotification,navigate);
		},
	});
};


// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateUser = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common"]);

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
			showSuccessNotification(
				t("common:editData.success", { data: "ผู้ใช้" })
			);
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["user"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: "ผู้ใช้" }),
				error.response?.data.message || error.message
			);
		},
	});
};


