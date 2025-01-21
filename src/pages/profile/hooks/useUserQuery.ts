import { useQuery } from "@tanstack/react-query";
import api from "../../../libs/api";


// Hook สำหรับดึงข้อมูลสินค้าตาม ID หรือไม่ส่ง ID สำหรับทำ form เพิ่มและแก้ไข
export const useUserById = (id: number | null | undefined) => {
	return useQuery({
		queryKey: id ? ["user", id] : ["user"],
		queryFn: async () => {
			if (id) {
				const { data } = await api.get(`/app/user/${id}`);
				return data;
			} else {
				throw new Response("ไม่พบข้อมูลนี้", { status: 404 });
			}
		},
	});
};



