import { LeftOutlined } from "@ant-design/icons";
import {
	Button,
	Card,
	Col,
	Flex,
	Image,
	Row,
	Spin,
	Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { fallbackImage } from "../../utils/file";
import { useBookingsByUserId } from "../booking/hooks/useBookingQuery";
import { useAuthStore } from "../auth/hooks/useAuthStore";
import { Booking } from "../booking/types";
import { toDateTime } from "../../utils/dateFunction";
import { getImage } from "../room/hooks/useRoomQuery";
import EmptyData from "../../components/common/EmptyData";

type Props = {};

export default function History({}: Props) {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { data, isPending } = useBookingsByUserId(Number(user?.id));
	console.log("data", data);

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
				<Typography.Title level={5}>ประวัติการจอง</Typography.Title>
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
			{data?.data.length>0?<Spin spinning={isPending}>
				<Row gutter={[10,10]}>
					{data?.data?.map((item: Booking) => (
						<Col span={24}>
							<Link to={"/booking/detail/" + item.id}>
								<Card
									key={item.id}
									className="p-0"
									styles={{ body: { padding: "0.8rem" } }}
								>
									<Flex justify="space-between" align="center">
										<Flex vertical>
											<p className="line-clamp-1">{item.title}</p>
											<small className="line-clamp-1">
												ห้อง : {item?.room?.name}
											</small>
										</Flex>
										<div>
											<small>{toDateTime(item.book_start)}</small>
											<br />
											<small>{toDateTime(item.book_end)}</small>
										</div>
									</Flex>
								</Card>
							</Link>
						</Col>
					))}
				</Row>
			</Spin>:<EmptyData/>}
		</div>
	);
}
