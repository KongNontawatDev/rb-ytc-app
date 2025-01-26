import { Button, Flex, Image, Spin, Tag, Typography } from "antd";
import { fallbackImage } from "../../utils/file";
import { Link, useNavigate } from "react-router-dom";
import { EnvironmentFilled, LeftOutlined } from "@ant-design/icons";
import { getImage, useRoomAll } from "./hooks/useRoomQuery";
import { useAuthStore } from "../auth/hooks/useAuthStore";
import EmptyData from "../../components/common/EmptyData";

type Props = {};

export default function Room({}: Props) {
	const navigate = useNavigate();
	const { data: roomAll, isPending: roomAllIsPending } = useRoomAll();
	const {user} = useAuthStore()
	return (
		<div className="px-4 pt-4">
			<Flex justify="space-between" align="center" className="mb-3">
				<Flex vertical>
					<Button
						type="text"
						icon={<LeftOutlined />}
						onClick={() => navigate("/")}
					/>
				</Flex>
				<Typography.Title level={5}>ห้องประชุมทั้งหมด</Typography.Title>
				<Link to={"/profile"}>
					<Image
						src={getImage(user?.image!, "user")}
						alt="image profile"
						preview={false}
						fallback={fallbackImage}
						className="max-w-11 rounded-full"
					/>
				</Link>
			</Flex>

			{roomAll?.data.length>0?<Spin spinning={roomAllIsPending}>
				<Flex vertical gap={15} className="w-full overflow-x-scroll pt-2 pb-3">
					{roomAll?.data?.map((item: any) => (
						<Link to={`/room/${item.id}`}>
							<div className="w-full rounded-md shadow-md">
								{item.room_image&&<img
									className="w-full object-cover rounded-md"
									src={getImage(item.room_image[0]?.image, "room")}
									alt="Sunset in the mountains"
								/>}
								<div className="p-2">
									<p className="text-lg font-medium line-clamp-2">{item.name}</p>
									<p className="text-gray-600 text-xs line-clamp-1">
										<EnvironmentFilled className="me-1" />
										{item.location}
									</p>
								</div>
								<Flex
									className="px-2 pb-2"
									justify="space-between"
									align="center"
								>
									<Tag color="blue" className="rounded-full px-1 -py-1">
										<small>ห้อง{item.size}</small>
									</Tag>
									<Tag color="green" className="rounded-full px-1 -py-1">
										<small>จุได้ {item.capacity} คน</small>
									</Tag>
								</Flex>
							</div>
						</Link>
					))}
				</Flex>
			</Spin>:<EmptyData/>}
		</div>
	);
}
