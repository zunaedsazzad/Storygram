import LeftPanel from "./LeftPanel";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="h-full text-white flex flex-col lg:flex-row">
			<LeftPanel />
			{children}
		</div>
	);
}
