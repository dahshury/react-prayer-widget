import { Suspense } from "react";
import { DemoPage } from "@/src/pages/_demo";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DemoPage />
		</Suspense>
	);
}
