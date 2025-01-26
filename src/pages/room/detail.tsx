import {
	CalendarOutlined,
	EnvironmentFilled,
	LeftOutlined,
	OneToOneOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	Alert,
	Button,
	Carousel,
	Flex,
	Image,
	Spin,
	Timeline,
	Typography,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fallbackImage } from "../../utils/file";
import { useEffect, useState } from "react";
import { getImage, useRoomById } from "./hooks/useRoomQuery";
import { Room } from "./types";
import { toDateTime } from "../../utils/dateFunction";
import { useAuthStore } from "../auth/hooks/useAuthStore";
import EmptyData from "../../components/common/EmptyData";
import dayjs from "dayjs";

type Props = {};

export default function Detail({}: Props) {
	const navigate = useNavigate();
	const { id } = useParams<"id">();
	const [room, setRoom] = useState<Room>();
	const { data, isPending } = useRoomById(Number(id));
	const { user } = useAuthStore();

	useEffect(() => {
		if (data && !isPending) {
			setRoom(data?.data);
		}
	}, [data, isPending]);

	return (
		<div className="px-4 pt-4 pb-12">
			<Flex justify="space-between" align="center" className="mb-3">
				<Flex vertical>
					<Button
						type="text"
						icon={<LeftOutlined />}
						onClick={() => navigate("/")}
					/>
				</Flex>
				<Typography.Title level={5}>รายละเอียดห้อง</Typography.Title>
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

			<Spin spinning={isPending}>
				{!room || !id ? (
					<EmptyData />
				) : (
					<>
						<Carousel arrows infinite={true} className="max-h-80 rounded-md">
							{room?.room_image.map((room_image) => (
								<div className="rounded-md">
									<img
										src={getImage(room_image.image, "room")}
										className="w-full max-h-80 object-cover rounded-md"
										alt={room?.name}
									/>
								</div>
							))}
						</Carousel>

						{room?.booking_list.some((list) =>
							dayjs(list.book_start).isSame(dayjs(), "day")
						) && (
							<Alert
								message="วันนี้ห้องไม่ว่าง กรุณาเลือกห้องหรือวันที่อื่นในการจอง"
								type="warning"
								showIcon
								className="my-2"
							/>
						)}

						<Typography.Title level={4} className="mt-1">
							{room?.name}
						</Typography.Title>
						<Flex align="center">
							<p className="text-gray-600 text-xs line-clamp-1 me-1">
								<EnvironmentFilled className="me-1" />
								ตำแหน่ง :
							</p>
							<p>{room?.location}</p>
						</Flex>
						<Flex align="center">
							<p className="text-gray-600 text-xs line-clamp-1 me-1">
								<OneToOneOutlined className="me-1" />
								ขนาดห้อง :
							</p>
							<p>{room?.size}</p>
						</Flex>
						<Flex align="center">
							<p className="text-gray-600 text-xs line-clamp-1 me-1">
								<UserOutlined className="me-1" />
								จุคนได้ :
							</p>
							<p>{room?.capacity} คน</p>
						</Flex>

						<p className="mt-1">{room?.detail}</p>
						<Flex
							gap={10}
							wrap
							justify="center"
							align="center"
							className="mt-3 bg-gray-100 rounded-md p-3"
						>
							{room?.room_accessory.map((item) => (
								<Flex vertical align="center">
									<Flex
										justify="center"
										align="center"
										className="p-2 w-12 h-12"
									>
										<Image
											src={getImage(item.accessory?.image, "accessory")}
											preview={false}
											fallback={fallbackImage}
										/>
									</Flex>
									<p className="mt-1 text-sm line-clamp-1">
										{item.accessory?.name}
									</p>
								</Flex>
							))}
						</Flex>

						<Typography.Title level={5} className="mt-5">
							รายการจองอื่นๆในเดือนนี้
						</Typography.Title>
						<Timeline
							className="mb-5 mt-5"
							items={room?.booking_list.map((list) => ({
								children: (
									<div className="leading-4">
										<p>
											{toDateTime(list?.book_start)} -{" "}
											{toDateTime(list?.book_end)}
										</p>
										<small>{list?.title}</small>
										<br />
										<small>ผู้จอง : {list?.user_name}</small>
									</div>
								),
							}))}
						/>
					</>
				)}
			</Spin>

			{(room && id)&&<div className="w-full bg-white p-2 fixed bottom-0 left-0 right-0">
				<Button
					type="primary"
					icon={<CalendarOutlined />}
					size="large"
					block
					onClick={() => navigate(`/booking?room_id=${room?.id}`)}
				>
					จองห้อง
				</Button>
			</div>}
		</div>
	);
}
