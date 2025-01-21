import { HTMLProps, ReactNode } from "react";

type Props = {
	className?: HTMLProps<HTMLElement>["className"];
	children: ReactNode;
};

export default function Container({ children, className }: Props) {
	return (
		<center>
			<div className={`max-w-[1000px] bg-white text-start relative ${className}`}>
				{children}
			</div>
		</center>
	);
}
