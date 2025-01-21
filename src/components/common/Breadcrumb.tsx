import { Breadcrumb as AntdBreadcrumb } from "antd";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export type BreadcrumbItemType = {
	title: string | ReactNode;
	href?: string;
	icon?: ReactNode;
	lists?: {
		title: string;
		href: string;
	}[];
}[];

type Props = {
	listItems: BreadcrumbItemType;
	visible?: boolean;
};
export default function Breadcrumb({ listItems = [], visible = true }: Props) {
	const { t } = useTranslation("menu");

	const newListItems = [{ title: t("home"), href: "/" }, ...listItems];
	const items = newListItems.map((item) => {
		if (item.lists) {
			return {
				title: (
					<a href="javascript:void(0)">
						{item.icon} {item.title}
					</a>
				),
				menu: {
					items: item.lists.map((list) => ({
						label: list.title,
						key: list.href,
					})),
				},
			};
		} else {
			if (item.href === undefined) {
				return { title: item.title };
			} else {
				return {
					title: (
						<Link to={item.href!}>
							{item.icon} {item.title}
						</Link>
					),
				};
			}
		}
	});

	return (
		<AntdBreadcrumb
			style={{
				display: visible ? "flex" : "none",
				alignItems: "center",
				justifyContent: window.innerWidth <= 575 ? "start" : "end",
			}}
			items={items}
		/>
	);
}
