import { ReactNode } from "react";
import Container from "../../common/Container";

export default function MainLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Container>{children}</Container>
		</>
	);
}
