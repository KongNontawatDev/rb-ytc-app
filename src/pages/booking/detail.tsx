import { useEffect, useState } from "react";
import { Booking } from "./types";
import { useBookingById } from "./hooks/useBookingQuery";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Descriptions, Flex, Image, Spin, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { fallbackImage } from "../../utils/file";
import { toDateTime } from "../../utils/dateFunction";
import { DescriptionsProps } from "antd/lib";
import { getImage } from "../room/hooks/useRoomQuery";
import { useAuthStore } from "../auth/hooks/useAuthStore";
import BadgeStatus from "./components/BadgeStatus";
import { useUpdateBooking } from "./hooks/useBookingMutate";
import ButtonCancelAction from "../../components/common/ButtonCancelAction";
import EmptyData from "../../components/common/EmptyData";

type Props = {};

export default function BookingDetail({}: Props) {
	const navigate = useNavigate();
	const { id } = useParams<"id">();
	const [booking, setBooking] = useState<Booking>();
	const { data, isPending } = useBookingById(Number(id));
	const cancelBooking = useUpdateBooking(()=>{})
	const {user} = useAuthStore()
  	useEffect(() => {
		if (data && !isPending) {
			setBooking(data?.data);
		}
	}, [data, isPending]);

  	const items: DescriptionsProps["items"] = [
		{
			key: "รหัสการจอง",
			label: "รหัสการจอง",
			children: booking?.booking_number,
			span: 3,
		},
		{
			key: "ห้องประชุม",
			label: "ห้องประชุม",
			children: booking?.room.name,
			span: 3,
		},
		{
			key: "หัวข้อการประชุม",
			label: "หัวข้อการประชุม",
			children: booking?.title,
			span: 3,
		},
		{
			key: "รายละเอียด",
			label: "รายละเอียด",
			children: booking?.detail ? booking?.detail : "-",
			span: 3,
		},

		{
			key: "ชื่อผู้จอง",
			label: "ชื่อผู้จอง",
			children: booking?.user_name,
			span: 3,
		},
		{
			key: "เบอร์ผู้จอง",
			label: "เบอร์ผู้จอง",
			children: booking?.tel,
			span: 3,
		},

		{
			key: "แผนกที่ขอใช้",
			label: "แผนกที่ขอใช้",
			children: booking?.department.name,
			span: 3,
		},
		{
			key: "สถานะรายการจอง",
			label: "สถานะรายการจอง",
			children: <BadgeStatus value={String(booking?.status)} />,
			span: 3,
		},
		{
			key: "วันที่จอง",
			label: "วันที่จอง",
			children: toDateTime(booking?.book_start)+" - "+toDateTime(booking?.book_end),
			span: 3,
		},
		{
			key: "สร้างรายการเมื่อ",
			label: "สร้างรายการเมื่อ",
			children: toDateTime(booking?.created_at),
			span: 3,
		},
		{
			key: "แก้ไขล่าสุดเมื่อ",
			label: "แก้ไขล่าสุดเมื่อ",
			children: toDateTime(booking?.updated_at),
			span: 3,
		},
	];

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
				<Typography.Title level={5}>รายละเอียดการจอง</Typography.Title>
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
					{!booking||!id?<EmptyData/>:<Descriptions size="small" bordered items={items} className="my-5" />}
					{(booking?.status!==3&&(booking&&id))&&<ButtonCancelAction data="รายการจอง" title={"ยกเลิกจอง"} type="dashed" danger block className="mt-5" onCancel={async()=>cancelBooking.mutateAsync(booking?.id!)}/>}
				</Spin>
		</div>
	);
}
