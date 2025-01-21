import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../../libs/api";
import { buildURLSearchParams } from "../../../utils";
import { FilterQuery } from "../types";
import { handleApiError } from "../../../utils/errorHandler";
import { useNotification } from "../../../hooks/useNotification";
import { useNavigate } from "react-router-dom";

export const useRooms = (filterQuery: FilterQuery) => {
	const [filters, setFilters] = useState<FilterQuery>(filterQuery);
	const { showErrorNotification } = useNotification();
	const navigate = useNavigate();
	const query = useQuery({
		queryKey: ["rooms", filters],
		queryFn: async () => {
			try {
				const params = buildURLSearchParams(filterQuery);
				const { data } = await api.get(`/app/room/search`, { params });

				return data;
			} catch (error: any) {
				handleApiError(error, showErrorNotification, navigate);
			}
		},
	});
	return {
		...query,
		setFilters,
	};
};

export const useRoomEmpty = () => {
	return useQuery({
		queryKey: ["rooms_empty"],
		queryFn: async () => {
			const { data } = await api.get(`/app/room/status/empty`);
			return data;
		},
	});
};

export const useRoomAll = () => {
	return useQuery({
		queryKey: ["rooms_all"],
		queryFn: async () => {
			const { data } = await api.get(`/app/room`);
			return data;
		},
	});
};

// Hook สำหรับดึงข้อมูลสินค้าตาม ID หรือไม่ส่ง ID สำหรับทำ form เพิ่มและแก้ไข
export const useRoomById = (id: number | null | undefined) => {
	return useQuery({
		queryKey: id ? ["room", id] : ["room"],
		queryFn: async () => {
			if (id) {
				const { data } = await api.get(`/app/room/${id}`);
				return data;
			} else {
				throw new Response("ไม่พบข้อมูลนี้", { status: 404 });
			}
		},
	});
};

export const useRoomForDropdown = () => {
	return useQuery({
		queryKey: ["rooms-dropdown"],
		queryFn: async () => {
			const { data } = await api.get(`/app/room/list/dropdown`);
			return data;
		},
	});
};

export const getImage = (filename: string, folder: string) => {
	if (filename) {
		if (filename.includes("https")) {
			return filename;
		}
		return `${import.meta.env.VITE_API_URL}/${folder}/${filename}`;
	}else {
		return ""
	}
};
