import { Suspense } from "react";
import { DemoPage as DemoPageContent } from "../_demo";

export function DemoPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DemoPageContent />
		</Suspense>
	);
}
