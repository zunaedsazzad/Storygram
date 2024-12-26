import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="flex bg-gray-200 h-screen justify-center items-center ">
			<SignIn fallbackRedirectUrl="/" />
		</div>
	);
}
