import { LeftOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { User } from "./types";
import { useEffect, useState } from "react";
import { useAuthStore } from "../auth/hooks/useAuthStore";
import { useUserById } from "./hooks/useUserQuery";
import { useUpdateUser } from "./hooks/useUserMutate";
import AlertSubmitFail from "../../components/common/AlertSubmitFail";
import ImageUpload from "../../components/common/ImageUpload";
import DepartmentDropdown from "../department/components/DepartmentDropdown";
import ButtonSave from "../../components/common/ButtonSave";
import ButtonCancel from "../../components/common/ButtonCancel";
import { useNavigationBlock } from "../../hooks/useNavigationBlock";
import { useNavigationBlockEnhanced } from "../../utils/formUtils";
import { getImage } from "../room/hooks/useRoomQuery";

type Props = {};

export default function Profile({}: Props) {
	const { user } = useAuthStore();
	const navigate = useNavigate();
	const [form] = Form.useForm<User>();
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState<string>();
	const { data, isPending } = useUserById(Number(user?.id));
	const updateUser = useUpdateUser(() => {});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [image, setImage] = useState<string>("");
	const [isImageRemoved, setIsImageRemoved] = useState(false);
	const mode = "edit";


	// Reset form when mode or data changes
	useEffect(() => {
    if(data&&!isPending) {
      form.setFieldsValue(data?.data);
      setImage(data?.data?.image)
      form.setFieldValue("image",getImage(data?.data?.image,"user"))
    }
	}, [form, mode, data]);

	const handleFormChange = () => {
		const currentValues = form.getFieldsValue();
		const originalValues = data?.data || {};
		const hasChanges =
			JSON.stringify(currentValues) !== JSON.stringify(originalValues);
		setIsDirty(hasChanges || isImageRemoved || !!imageFile);
	};

	useNavigationBlock(isDirty);
	useNavigationBlockEnhanced({ isModify: isDirty });

	const handleCustomUpload = async ({
		file,
		onSuccess: onUploadSuccess,
	}: any) => {
		setImageFile(file);
		setIsImageRemoved(false);
		setIsDirty(true);
		onUploadSuccess?.();
	};

	const handleImageRemove = () => {
		setImageFile(null);
		setIsImageRemoved(true);
		setIsDirty(true);
		form.setFieldValue("image", "");
	};

	const handleSubmit = async (values: User) => {
		try {
			setIsSaving(true);

			const formData = new FormData();
			const convertToString = (
				value: string | number | Date | undefined
			): string => {
				if (value === undefined || value === null) return "";
				if (value instanceof Date) return value.toISOString();
				return String(value);
			};

			Object.entries(values).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					formData.append(key, convertToString(value as any));
				}
			});

			// Handle image upload
			if (imageFile) {
				formData.append("image", imageFile);
			} else if (mode === "edit" && data?.data?.image && !isImageRemoved) {
				// If editing and no new image is selected, send the existing image URL
				formData.append("image", convertToString(data.data.image));
			} else if (isImageRemoved) {
				// If image was removed, send empty string
				formData.append("image", "");
			}

			await updateUser.mutateAsync({
				id: Number(user?.id),
        status:Number(user?.status),
				...(Object.fromEntries(formData.entries()) as any),
			});
		} catch (error: any) {
			if (error.status === 400) {
				setErrorSubmit(error.response?.data?.message);
			}
			console.error("Failed to save user:", error);
		} finally {
      setIsDirty(false)
			setIsSaving(false);
		}
	};
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
				<Typography.Title level={5}>โปรไฟล์</Typography.Title>
				<span> </span>
			</Flex>
			<Spin spinning={isPending}>
				{errorSubmit && (
					<AlertSubmitFail
						message={"แก้ไขโปรไฟล์ไม่สำเร็จ"}
						description={errorSubmit}
					/>
				)}
				<Form
					form={form}
					layout="vertical"
					onValuesChange={handleFormChange}
					onFinish={handleSubmit}
					className="mt-4"
				>
					<Form.Item
						label={"รูปโปรไฟล์"}
						name="image"
						className="flex flex-col items-center"
					>
						<ImageUpload
							displayType="picture-wall"
							maxCount={1}
							maxFileSize={5}
							customRequest={handleCustomUpload}
							value={getImage(image,"user")}
							loading={isSaving}
							centered={true}
							folder="user"
							onDelete={handleImageRemove}
						/>
					</Form.Item>
					<Form.Item
						label={"ชื่อ-สกุล"}
						name="full_name"
						rules={[
							{
								required: true,
								message: "กรุณากรอกชื่อ-สกุล",
							},
							{
								max: 150,
								message: "ห้ามกรอกชื่อ-สกุลเกิน 150 ตัวอักษร",
							},
						]}
					>
						<Input
							allowClear
							showCount
							maxLength={150}
							placeholder={"กรอกชื่อ-สกุล"}
						/>
					</Form.Item>
					<Form.Item
						label={"แผนกที่สังกัด"}
						name="department_id"
						rules={[
							{
								required: true,
								message: "กรุณาเลือกแผนก",
							},
						]}
					>
						<DepartmentDropdown
							value={form.getFieldValue("department_id")}
							onChange={(value) => {
								form.setFieldValue("department_id", value); // อัปเดตค่าในฟอร์ม
								handleFormChange(); // ตรวจสอบว่าฟอร์มมีการแก้ไข
							}}
							placeholder="เลือกแผนก"
						/>
					</Form.Item>
					<Form.Item
						label={"เบอร์โทร"}
						name="tel"
						rules={[
							{
								required: true,
								message: "กรุณากรอกเบอร์โทร",
							},
							{
								max: 10,
								message: "ห้ามกรอกเบอร์ไทรเกิน 10 ตัว",
							},
						]}
					>
						<Input
							allowClear
							showCount
							maxLength={10}
							placeholder={"กรอกเบอร์โทร"}
						/>
					</Form.Item>

					<ButtonSave
						type="primary"
						disabled={!isDirty || isSaving}
						loading={isSaving}
						title={"บันทึกข้อมูล"}
						block
						className="mb-4"
					/>

					<ButtonCancel
						type="text"
						onClick={() => navigate("/")}
						disabled={isSaving}
						title={"ยกเลิก"}
						block
					/>
				</Form>
			</Spin>
		</div>
	);
}
