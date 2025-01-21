import { LeftOutlined } from "@ant-design/icons";
import {
	Button,
	Col,
	DatePicker,
	Flex,
	Form,
	Image,
	Input,
	Row,
	Spin,
	Typography,
} from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fallbackImage } from "../../utils/file";
import { useEffect, useState } from "react";
import { useBookingById } from "./hooks/useBookingQuery";
import { useCreateBooking, useUpdateBooking } from "./hooks/useBookingMutate";
import dayjs from "dayjs";
import { useNavigationBlock } from "../../hooks/useNavigationBlock";
import { useNavigationBlockEnhanced } from "../../utils/formUtils";
import EmptyData from "../../components/common/EmptyData";
import AlertSubmitFail from "../../components/common/AlertSubmitFail";
import RoomDropdown from "../room/components/RoomDropdown";
import DepartmentDropdown from "../department/components/DepartmentDropdown";
import { datePickerTh } from "../../components/common/InputDate";
import { toDateTime } from "../../utils/dateFunction";
import ButtonCancel from "../../components/common/ButtonCancel";
import ButtonClearForm from "../../components/common/ButtonClearForm";
import ButtonSave from "../../components/common/ButtonSave";
import { Booking } from "./types";
import { useAuthStore } from "../auth/hooks/useAuthStore";
import { getImage } from "../room/hooks/useRoomQuery";

type Props = {};

export default function BookingPage({}: Props) {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { user } = useAuthStore();
	const room_id = searchParams.get("room_id");
	const id = searchParams.get("id");
	const [mode, _] = useState(id ? "edit" : "create");
	const [form] = Form.useForm<Booking>();
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState<string>();
	const { data, isPending: isDataLoading } = useBookingById(Number(id || null));
	const createBooking = useCreateBooking(() => navigate("/"));
	const updateBooking = useUpdateBooking(() => navigate("/"));
	const isReadOnly = mode === "view";
	const shouldDisableForm = (mode === "edit" && isSaving) || isReadOnly;
	// Reset form when mode or data changes
	useEffect(() => {
		// encryptStorage.setItem("token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImNvbnRleHQiOiJrb25nQGdtYWlsLmNvbSIsImFjdG9yIjoiYWRtaW4iLCJpYXQiOjE3MzYzMDMxMTcsImV4cCI6MTczNjMwMzExN30.RRKzShYrUa1kT6gbLl_rXl7YzZTqbIoLyI3bt9za8BA")
		if (mode === "create") {
			form.resetFields();
			if (room_id) {
				form.setFieldValue("room_id", Number(room_id));
			}
			form.setFieldValue("department_id", user?.department_id);
			form.setFieldValue("tel", user?.tel);
			form.setFieldValue("user_name", user?.full_name);
			form.setFieldValue("user_id", user?.id);
		} else if (data?.data && (mode === "edit" || mode === "view")) {
			form.setFieldsValue({
				...data?.data,
				book_end: dayjs(data?.data.book_end),
				book_start: dayjs(data?.data.book_start),
			});
		}
	}, [form, mode, data, room_id, id, user]);

	const handleFormChange = () => {
		const currentValues = form.getFieldsValue();
		const originalValues = data?.data || {};
		setIsDirty(
			JSON.stringify(currentValues) !== JSON.stringify(originalValues)
		);
	};

	useNavigationBlock(isDirty);
	useNavigationBlockEnhanced({ isModify: isDirty });

	const handleSubmit = async (values: Omit<Booking, "id">) => {
		setIsDirty(false);
		try {
			setIsSaving(true);
			if (mode === "edit" && id) {
				await updateBooking.mutateAsync({ id: Number(id), ...values });
			} else {
				await createBooking.mutateAsync({
					...values,
					user_id: Number(user?.id),
				});
			}
		} catch (error: any) {
			if (error.status == 400) {
				// const formattedError = handleApiError(error.response?.data || error);
				setErrorSubmit(error.response?.data?.message);
			}
			console.error("Failed to save booking_list:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const disabledDate = (current: dayjs.Dayjs) => {
		// Disable dates before today
		return current && current.isBefore(dayjs().startOf("day"));
	};

	if (!data?.data && !isDataLoading && mode !== "create") {
		return <EmptyData value={"รายการจอง"} />;
	}

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
				<Typography.Text>จองห้อง</Typography.Text>
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
			<Spin spinning={isDataLoading && mode !== "create"}>
				{errorSubmit && (
					<AlertSubmitFail
						message={
							mode == "create"
								? "เพิ่มรายการจองไม่สำเร็จ"
								: "แก้ไขรายการจองไม่สำเร็จ"
						}
						description={errorSubmit}
					/>
				)}
				<Form
					form={form}
					layout="vertical"
					onValuesChange={handleFormChange}
					onFinish={handleSubmit}
					disabled={shouldDisableForm}
					className="mt-4"
					initialValues={{ book_start: dayjs(), book_end: dayjs() }}
				>
					<Form.Item
						label={"ห้องประชุม"}
						name="room_id"
						rules={[
							{
								required: true,
								message: "ต้องเลือกห้องประชุม",
							},
						]}
					>
						<RoomDropdown
							value={form.getFieldValue("room_id")}
							onChange={(value) => {
								form.setFieldValue("room_id", value); // อัปเดตค่าในฟอร์ม
								handleFormChange(); // ตรวจสอบว่าฟอร์มมีการแก้ไข
							}}
							disabled={isReadOnly}
							placeholder="เลือกห้องประชุม"
						/>
					</Form.Item>
					<Form.Item
						label={"หัวข้อประชุม/เรื่องที่จะประชุม"}
						name="title"
						rules={[
							{
								required: true,
								message: "",
							},
							{
								max: 255,
								message: "กรุณาอย่ากรอกตัวอักษรเกิน 255 ตัว",
							},
						]}
					>
						<Input
							allowClear
							showCount
							maxLength={255}
							placeholder={"หัวข้อประชุม/เรื่องที่จะประชุม"}
						/>
					</Form.Item>
					<Form.Item
						label={"รายละเอียดการประชุม"}
						name="detail"
						rules={[
							{
								required: true,
								message: "กรุณากรอกรายละเอียดการประชุม",
							},
						]}
					>
						<Input.TextArea
							rows={2}
							allowClear
							placeholder={"กรอกรายละเอียดการประชุม"}
						/>
					</Form.Item>

					<Form.Item
						label={"แผนกที่ขอใช้"}
						name="department_id"
						rules={[
							{
								required: true,
								message: "เลือกแผนกที่ขอใช้",
							},
						]}
					>
						<DepartmentDropdown
							value={form.getFieldValue("department_id")}
							onChange={(value) => {
								form.setFieldValue("department_id", value); // อัปเดตค่าในฟอร์ม
								handleFormChange(); // ตรวจสอบว่าฟอร์มมีการแก้ไข
							}}
							disabled={isReadOnly}
						/>
					</Form.Item>
					<Form.Item
						label={"ผู้จอง/ผู้รับผิดชอบ"}
						name="user_name"
						rules={[
							{
								required: true,
								message: "กรุณากรอกชื่อผู้จอง/ผู้รับผิดชอบ",
							},
							{
								max: 150,
								message: "กรุณาอย่ากรอกตัวอักษรเกิน 150 ตัว",
							},
						]}
					>
						<Input
							allowClear
							showCount
							maxLength={150}
							placeholder={"กรอกชื่อผู้จอง/ผู้รับผิดชอบ"}
						/>
					</Form.Item>
					<Form.Item
						label={"เบอร์ผู้จอง/ผู้รับผิดชอบ"}
						name="tel"
						rules={[
							{
								required: true,
								message: "กรุณากรอกเบอร์ผู้จอง/ผู้รับผิดชอบ",
							},
							{
								max: 10,
								message: "กรุณาอย่ากรอกตัวอักษรเกิน 10 ตัว",
							},
						]}
					>
						<Input
							allowClear
							showCount
							maxLength={10}
							placeholder={"กรอกเบอร์ผู้จอง/ผู้รับผิดชอบ"}
						/>
					</Form.Item>

					<Row gutter={16}>
						<Col xs={24} sm={12}>
							<Form.Item
								label={"จองตั้งแต่"}
								name="book_start"
								rules={[
									{
										required: true,
										message: "กรุณาเลือกวันที่เริ่มจอง",
									},
								]}
							>
								<DatePicker
									format="DD-MM-BBBB HH:mm"
									disabledDate={disabledDate}
									showTime={{ defaultValue: dayjs("00:00", "HH:mm") }}
									locale={datePickerTh}
									className="w-full" // Make DatePicker full width
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item
								label={"จนถึง"}
								name="book_end"
								rules={[
									{
										required: true,
										message: "กรุณาเลือกวันที่สิ้นสุดการจอง",
									},
								]}
							>
								<DatePicker
									format="DD-MM-BBBB HH:mm"
									disabledDate={disabledDate}
									showTime={{ defaultValue: dayjs("00:00", "HH:mm") }}
									locale={datePickerTh}
									className="w-full" // Make DatePicker full width
								/>
							</Form.Item>
						</Col>
					</Row>

					{(isReadOnly || mode == "edit") && (
						<Flex wrap gap={15} className="mb-4">
							<Flex gap={5}>
								<Typography.Text type="secondary" className="text-xs">
									สร้างข้อมูลเมื่อ :{" "}
								</Typography.Text>
								<Typography.Text className="text-xs">
									{toDateTime(data?.data?.created_at)}
								</Typography.Text>
							</Flex>
							<Flex gap={5}>
								<Typography.Text type="secondary" className="text-xs">
									แก้ไขข้อมูลล่าสุด :{" "}
								</Typography.Text>
								<Typography.Text className="text-xs">
									{toDateTime(data?.data?.updated_at)}
								</Typography.Text>
							</Flex>
						</Flex>
					)}

					<Flex vertical gap={10}>
						{!isReadOnly && (
							<>
								<ButtonSave
									type="primary"
									disabled={!isDirty || isSaving}
									loading={isSaving}
									title={"บันทึกข้อมูล"}
									size="large"
									block
								/>
								<ButtonClearForm
									title={"ล้าง"}
									onClick={() => form.resetFields()}
									disabled={!isDirty || isSaving}
									block
								/>
							</>
						)}
						<ButtonCancel
							type="text"
							onClick={() => navigate("/")}
							disabled={isSaving}
							title={"ยกเลิก"}
							block
						/>
					</Flex>
				</Form>
			</Spin>
		</div>
	);
}
