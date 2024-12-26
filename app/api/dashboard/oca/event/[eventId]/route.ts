import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/lib/models/Event";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/models/User";
import Club from "@/lib/models/Club";
import sendEmail from "@/app/api/mail/mail";

async function sendEmailToInstractorAndMembers(
	event: any,
	club: any,
	emails: string[]
) {
	const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
          color: #333333;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4a90e2;
          color: #ffffff;
          padding: 20px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 20px;
        }
        .event-details, .club-details {
          margin-top: 20px;
          padding: 15px;
          border-radius: 6px;
          background-color: #f0f4f7;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #4a90e2;
          margin-bottom: 10px;
        }
        .event-cover {
          width: 100%;
          height: auto;
          border-radius: 6px;
          margin-top: 20px;
        }
        .cta-button {
          display: block;
          width: fit-content;
          margin: 20px auto 0;
          padding: 10px 20px;
          background-color: #4a90e2;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          text-align: center;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #777777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Event Approved by OCA!</div>
        <div class="content">
          <p>Hello,</p>
          <p>We are excited to inform you that the following event has been approved by the Office of Campus Activities (OCA). Here are the details:</p>
          
          <div class="event-details">
            <div class="section-title">Event Details</div>
            <p><strong>Name:</strong> ${event.name}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <p><strong>Start Date:</strong> ${new Date(
				event.startDate
			).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> ${new Date(
				event.endDate
			).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${event.rooms
				.map((room: any) => room.name)
				.join(", ")}</p>
          </div>

          <div class="club-details">
            <div class="section-title">Organized By</div>
            <p><strong>Club Name:</strong> ${club.clubName}</p>
            ${
				club.logo
					? `<img src="${club.logo}" alt="${club.clubName} Logo" style="max-width: 100px; margin-top: 10px;">`
					: ""
			}
            <p><strong>Description:</strong> ${
				club.description || "No description available."
			}</p>
          </div>

          <img src="${event.cover}" alt="Event Cover" class="event-cover">
          
          <a href="https://ocaplus.vercel.app/events/${
				event._id
			}" class="cta-button">Learn More About This Event</a>
        </div>
        <div class="footer">You are receiving this email because you are a member of ${
			club.clubName
		}.</div>
      </div>
    </body>
  </html>
`;

	for (const email of emails) {
		await sendEmail(
			email,
			"Event Approved by Instructor - Awaiting OCA Approval",
			htmlContent
		);
	}
}

export const GET = async (req: Request) => {
	try {
		await connectToDB();

		const { sessionClaims } = await auth();
		if (!sessionClaims) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (sessionClaims.metadata.role !== "oca") {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const url = new URL(req.url);
		const eventId = url.pathname.split("/").pop();
		if (!eventId) {
			return NextResponse.json(
				{ message: "Event not found" },
				{ status: 404 }
			);
		}

		const event = await Event.findOne({ _id: eventId });
		if (!event) {
			return NextResponse.json(
				{ message: "Event not found" },
				{ status: 404 }
			);
		}

		event.ocaApproval = true;

		await event.save();

		const ocaAccounts = await User.find(
			{ role: "oca" },
			{ email: 1, _id: 0 }
		);
		const ocaEmails = ocaAccounts.map((account) => account.email);

		const club = await Club.findOne({ _id: event.club });

		const members = await User.find(
			{ clubID: club._id, leavedAt: { $exists: false } },
			{ email: 1, _id: 0 }
		);
		const memberEmails = members.map((member) => member.email);

		await sendEmailToInstractorAndMembers(event, club, memberEmails);

		return NextResponse.json({ event }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
