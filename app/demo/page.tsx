import { Suspense } from "react";
import { DemoPage } from "@/pages/_demo";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DemoPage />
		</Suspense>
	);
}
