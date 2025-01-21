import { EditOutlined } from "@ant-design/icons";
import { Card,  Form, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";
import AlertSubmitFail from "../../components/common/AlertSubmitFail";
import { useTranslation } from "react-i18next";
import { User } from "../profile/types";
import { useNavigationBlock } from "../../hooks/useNavigationBlock";
import { useNavigationBlockEnhanced } from "../../utils/formUtils";
import { useCreateUser } from "./hooks/useAuthMutate";
import ImageUpload from "../../components/common/ImageUpload";
import DepartmentDropdown from "../department/components/DepartmentDropdown";
import ButtonCancel from "../../components/common/ButtonCancel";
import ButtonSave from "../../components/common/ButtonSave";
import { useNavigate } from "react-router-dom";
import { getLineProfile } from "../../utils/liff";

const Register: React.FC = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm<User>();
	const navigate = useNavigate();
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState<string>();
	const createUser = useCreateUser(() => navigate('/'));
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isImageRemoved, setIsImageRemoved] = useState(false);
	const [profileLine, setProfileLine] = useState<{userId:string,displayName:string,image:string}>()
	const lineProfile = async () => {
		try {
			const profile = await getLineProfile()
			setProfileLine({
				displayName:profile.displayName,
				userId:profile.userId,
				image:profile.pictureUrl||""
			})
		form.setFieldValue("image",profile.pictureUrl)
		form.setFieldValue("full_name",profile.displayName)
		} catch (error) {
			console.error('Error fetching LINE profile:', error)
		}
	}

  useEffect(() => {
    lineProfile()
  }, [])
	const handleFormChange = () => {
		const currentValues = form.getFieldsValue();
		const hasChanges = JSON.stringify(currentValues) !== JSON.stringify({});
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
			setIsDirty(false)
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

			formData.append("image", imageFile?.name?imageFile:String(profileLine?.image));
			formData.append("line_name", String(profileLine?.displayName));
			formData.append("line_id", String(profileLine?.userId));

			await createUser.mutateAsync(
				Object.fromEntries(formData.entries()) as any
			);
			
		} catch (error: any) {
			if (error.status === 400) {
				setErrorSubmit(error.response?.data?.message);
			}
			console.error("Failed to save user:", error);
		} finally {
			setIsSaving(false);
		}
	};
	return (
		<div className="px-4 pt-4">
			<Card hoverable>
				<Typography.Title level={5} className="text-center">
					<EditOutlined /> ลงทะเบียนใช้งาน
				</Typography.Title>
				<Typography.Text className="block text-center">
					ระบบจองห้องประชุมออนไลน์
				</Typography.Text>
				{errorSubmit && (
					<AlertSubmitFail
						message={t("common:createData.error", {
							data: t("user:title"),
						})}
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
							value={imageFile as any}
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
							title={"ลงทะเบียน"}
							block
              className="mb-4"
						/>

					<ButtonCancel
						type="text"
						onClick={() => navigate("/")}
						disabled={isSaving}
						title={t("common:cancel")}
						block
					/>
				</Form>
			</Card>
		</div>
	);
};

export default Register;
