import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";

export const GET = async (req: Request) => {
	try {
		await connectToDB();

		const gallery = [
			"https://res.cloudinary.com/dezocwunv/image/upload/v1731269888/gallary/cdlmoqwprwxkwfnajlt2.jpg",
			"https://res.cloudinary.com/dezocwunv/image/upload/v1731269871/gallary/drklhsavlgndcpftngvy.jpg",
			"https://res.cloudinary.com/dezocwunv/image/upload/v1731269871/gallary/xlesvdt8zgzwbbu22mp6.jpg",
			"https://res.cloudinary.com/dezocwunv/image/upload/v1731269871/gallary/wkumfcodareexd9v0wg4.jpg",
		];

		return NextResponse.json(gallery, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
