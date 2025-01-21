import { Form, Input } from "antd";
import React, { HTMLProps } from "react";

type Props = {
	value: string;
	placeholder?: string;
	allowClear?: boolean;
	onSearch?: () => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onPressEnter?: () => void;
	label?: string;
	className?: HTMLProps<HTMLElement>["className"];
	loading?:boolean
};

const { Search } = Input;

export default function InputTextFilter({
	value,
	placeholder = "ค้นหา",
	allowClear = true,
	onSearch,
	onChange,
	onPressEnter,
	label,
	className,
	loading=false
}: Props) {
  
	return (
		<Form layout="vertical" >
			<Form.Item label={label}>
				<Search
					value={value}
					placeholder={placeholder}
					allowClear={allowClear}
					onSearch={onSearch}
					onChange={onChange}
					onPressEnter={onPressEnter}
					className={className}
					loading={loading}
				/>
			</Form.Item>
		</Form>
	);
}
