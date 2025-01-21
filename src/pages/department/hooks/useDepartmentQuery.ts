import { useQuery } from "@tanstack/react-query";
import api from "../../../libs/api";

export const useDepartmentForDropdown = () => {
	return useQuery({
		queryKey: ["departments-dropdown"],
		queryFn: async () => {
			const { data } = await api.get(`/app/department/list/dropdown`);
			return data;
		},
	});
};
