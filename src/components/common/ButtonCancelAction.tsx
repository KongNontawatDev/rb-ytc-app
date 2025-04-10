import { CloseOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { ButtonSize, ButtonType } from "antd/es/button";
import { TooltipPlacement } from "antd/es/tooltip";
import PopconfirmCancel from "./ConfirmCancel";
import { HTMLProps } from "react";

type Props = {
	title?: string | null;
	type?: ButtonType;
	size?: ButtonSize;
	danger?: boolean;
	tooltip?: string;
	data?: string;
	block?: boolean;
	onCancel: () => Promise<void>;
	placement?: TooltipPlacement;
		className?: HTMLProps<HTMLElement>["className"];
};

export default function ButtonCancelAction({
	title,
	type = "text",
	size = "middle",
	danger = false,
	tooltip = "ยกเลิก",
	placement = "top",
	data,
	block = false,
	className,
	onCancel,
}: Props) {
	if (title) {
		return (
			<PopconfirmCancel
				onConfirm={onCancel}
				title={data!}
				placement={placement}
			>
				<Button
					type={type}
					block={block}
											className={className}
					icon={<CloseOutlined />}
					size={size}
					danger={danger}
				>
					{title}
				</Button>
			</PopconfirmCancel>
		);
	} else {
		return (
			<PopconfirmCancel
				onConfirm={onCancel}
				title={data!}
				placement={placement}
			>
				<Tooltip title={tooltip}>
					<Button
						className={className}
						type={type}
						block={block}
						icon={<CloseOutlined />}
						size={size}
						danger={danger}
					></Button>
				</Tooltip>
			</PopconfirmCancel>
		);
	}
}
