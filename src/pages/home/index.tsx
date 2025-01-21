import { Flex, Image, Spin, Tag, theme, Timeline, Typography } from "antd";
import { fallbackImage } from "../../utils/file";
import { useAuthStore } from "../auth/hooks/useAuthStore";
import {
	EnvironmentFilled,
	FileSyncOutlined,
	ProfileOutlined,
	RightOutlined,
	UnorderedListOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getImage, useRoomAll, useRoomEmpty } from "../room/hooks/useRoomQuery";
import { useBookingCurrentMonth } from "../booking/hooks/useBookingQuery";
import { Booking } from "../booking/types";
import { toDateTime } from "../../utils/dateFunction";

type Props = {};

export default function Home({}: Props) {
	const authStore = useAuthStore();
	const { token } = theme.useToken();
	const { data: roomAll, isPending: roomAllIsPending } = useRoomAll();
	const { data: roomEmpty, isPending: roomEmptyIsPending } = useRoomEmpty();
	const {
		data: bookingListCurrentMonth,
		isPending: bookingListCurrentMonthIsPending,
	} = useBookingCurrentMonth();
	return (
		<div className="px-4 pt-4">
			{/* Header */}
			<Flex justify="space-between" align="center">
				<Flex vertical>
					<Typography.Text className="mb-0 pb-0 text-sm font-light">
						สวัสดีคุณ:
					</Typography.Text>
					<Typography.Text className="text-lg">
						{authStore.user?.full_name}
					</Typography.Text>
				</Flex>
				<Link to={"/profile"}>
					<Image
						src={getImage(authStore?.user?.image!, "user")}
						alt="image profile"
						preview={false}
						fallback={fallbackImage}
						className="max-w-11 rounded-full"
					/>
				</Link>
			</Flex>

			{/* Top Menu */}
			<Flex gap={5} justify="space-between" align="center" className="mt-4">
				<Link to={"/booking"}>
					<Flex
						vertical
						align="center"
						className="p-2 active:bg-blue-50 hover:bg-blue-50 rounded-md"
					>
						<Flex
							justify="center"
							align="center"
							className="bg-blue-100 p-2 w-14 h-14 rounded-full"
						>
							<ProfileOutlined
								style={{ color: token.colorPrimary, fontSize: 27 }}
							/>
						</Flex>
						<p className="mt-1 text-sm">จองห้อง</p>
					</Flex>
				</Link>
				<Link to={"/room/list/all"}>
					<Flex
						vertical
						align="center"
						className="p-2 active:bg-blue-50 hover:bg-blue-50 rounded-md"
					>
						<Flex
							justify="center"
							align="center"
							className="bg-blue-100 p-2 w-14 h-14 rounded-full"
						>
							<UnorderedListOutlined
								style={{ color: token.colorPrimary, fontSize: 27 }}
							/>
						</Flex>
						<p className="mt-1 text-sm">ห้องทั้งหมด</p>
					</Flex>
				</Link>
				<Link to={"/profile/history"}>
					<Flex
						vertical
						align="center"
						className="p-2 active:bg-blue-50 hover:bg-blue-50 rounded-md"
					>
						<Flex
							justify="center"
							align="center"
							className="bg-blue-100 p-2 w-14 h-14 rounded-full"
						>
							<FileSyncOutlined
								style={{ color: token.colorPrimary, fontSize: 27 }}
							/>
						</Flex>
						<p className="mt-1 text-sm">ประวัติ</p>
					</Flex>
				</Link>
				<Link to={"/profile"}>
					<Flex
						vertical
						align="center"
						className="p-2 active:bg-blue-50 hover:bg-blue-50 rounded-md"
					>
						<Flex
							justify="center"
							align="center"
							className="bg-blue-100 p-2 w-14 h-14 rounded-full"
						>
							<UserOutlined
								style={{ color: token.colorPrimary, fontSize: 27 }}
							/>
						</Flex>
						<p className="mt-1 text-sm">โปรไฟล์</p>
					</Flex>
				</Link>
			</Flex>

			{/* Room Empty List */}
			<Flex justify="space-between" align="center" className="mt-4">
				<Typography.Text className="text-lg">ห้องว่างวันนี้</Typography.Text>
				<Link to={"/room/list/empty"} style={{ color: token.colorPrimary }}>
					ดูทั้งหมด <RightOutlined />
				</Link>
			</Flex>
			<Spin spinning={roomEmptyIsPending}>
				<Flex gap={10} className="w-full overflow-x-scroll pt-2 pb-3">
					{roomEmpty?.data?.map((item: any) => (
						<Link to={`/room/${item.id}`}>
							<div className="w-[230px] max-w-[230px] rounded-md shadow-md">
								{item.room_image && (
									<img
										className="w-full max-h-28 object-cover rounded-md"
										src={getImage(item.room_image[0]?.image, "room")}
										alt="Sunset in the mountains"
									/>
								)}
								<div className="p-2">
									<p className="line-clamp-2">{item.name}</p>
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
			</Spin>

			{/* Room All List */}
			<Flex justify="space-between" align="center" className="mt-5">
				<Typography.Text className="text-lg">ห้องทั้งหมด</Typography.Text>
				<Link to={"/room/list/all"} style={{ color: token.colorPrimary }}>
					ดูทั้งหมด <RightOutlined />
				</Link>
			</Flex>
			<Spin spinning={roomAllIsPending}>
				<Flex gap={10} className="w-full overflow-x-scroll pt-2 pb-3">
					{roomAll?.data?.map((item: any) => (
						<Link to={`/room/${item.id}`}>
							<div className="w-[230px] max-w-[230px] rounded-md shadow-md">
								{item.room_image && (
									<img
										className="w-full max-h-28 object-cover rounded-md"
										src={getImage(item.room_image[0]?.image, "room")}
										alt="Sunset in the mountains"
									/>
								)}
								<div className="p-2">
									<p className="line-clamp-2">{item.name}</p>
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
			</Spin>

			{/* Timeline Booking */}
			<Flex justify="space-between" align="center" className="mt-5">
				<Typography.Text className="text-lg">
					ไทมไลน์จองห้องเดือนนี้
				</Typography.Text>
			</Flex>
			<Spin spinning={bookingListCurrentMonthIsPending}>
				<Timeline
					className="mb-5 mt-4"
					items={bookingListCurrentMonth?.data.map((list: Booking) => ({
						children: (
							<div className="leading-4">
								<p>
									{toDateTime(list?.book_start)} - {toDateTime(list?.book_end)}
								</p>
								<small>{list?.title}</small>
								<br />
								<small>ผู้จอง : {list?.user_name}</small>
							</div>
						),
					}))}
				/>
			</Spin>
		</div>
	);
}
