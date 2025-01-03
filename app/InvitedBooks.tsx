import React, { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InvitedBooksProps {
	invites: any[];
}

export const InvitedBooks: React.FC<InvitedBooksProps> = ({ invites }) => {
	const inviteScrollRef = useRef<HTMLDivElement>(null);

	console.log(invites);

	const scrollLeft = () => {
		if (inviteScrollRef.current) {
			inviteScrollRef.current.scrollBy({
				left: -300,
				behavior: "smooth",
			});
		}
	};

	const scrollRight = () => {
		if (inviteScrollRef.current) {
			inviteScrollRef.current.scrollBy({
				left: 300,
				behavior: "smooth",
			});
		}
	};

	return (
		<div className="mt-12">
			<h1 className="text-2xl font-bold text-white mb-4">
				Invited Books
			</h1>
			{invites.length > 0 ? (
				<div className="relative">
					<button
						title="Scroll Left"
						className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full z-10"
						onClick={scrollLeft}
					>
						<ChevronLeft className="text-gray-500 hover:text-black" />
					</button>
					<div
						ref={inviteScrollRef}
						className="flex overflow-x-hidden space-x-4"
					>
						{invites.map((invite) => (
							<div
								key={invite._id}
								className="relative bg-white shadow-md rounded-lg overflow-hidden"
								style={{
									aspectRatio: "2 / 3",
									minWidth: "200px",
								}}
							>
								<Image
									src={`data:image/jpeg;base64,${invite.book.photo}`}
									alt={invite.book.bookname}
									width={200}
									height={300}
									className="w-[200px] h-[300px] object-cover"
								/>
								<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
									<h3 className="text-lg font-bold">
										{invite.book.bookname}
									</h3>
									<p className="text-sm">
										{invite.book.bookauthor}
									</p>
									<p className="text-xs italic">
										Genre: {invite.book.genre}
									</p>
									<p className="text-xs mt-2">
										Invited by:{" "}
										<span className="font-semibold">
											{invite.invitor.name}
										</span>
									</p>
								</div>
							</div>
						))}
					</div>
					<button
						title="Scroll Right"
						className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full z-10"
						onClick={scrollRight}
					>
						<ChevronRight className="text-gray-500 hover:text-black" />
					</button>
				</div>
			) : (
				<p className="text-white">No invites found</p>
			)}
		</div>
	);
};
