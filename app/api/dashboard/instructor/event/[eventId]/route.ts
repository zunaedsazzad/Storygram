import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/lib/models/Event";
import User from "@/lib/models/User";
import Club from "@/lib/models/Club";
import { auth } from "@clerk/nextjs/server";
import sendEmail from "@/app/api/mail/mail";

async function sendEmailToOcaAndMembers(
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
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            background-color: #4CAF50;
            padding: 15px;
            border-radius: 10px;
            color: white;
          }
          .content {
            margin-top: 20px;
            color: #333;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #888;
            margin-top: 40px;
          }
          .button {
            display: inline-block;
            padding: 12px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Approval Update</h1>
          </div>
          <div class="content">
            <p>Dear OCA and Members,</p>
            <p>The instructor has approved the following event, and it is now awaiting OCA's final approval.</p>
            <p><strong>Event Details:</strong></p>
            <ul>
              <li><strong>Event Name:</strong> ${event.name}</li>
              <li><strong>Description:</strong> ${event.description}</li>
              <li><strong>Objective:</strong> ${event.objective}</li>
              <li><strong>Impact:</strong> ${event.impact}</li>
              <li><strong>Start Date:</strong> ${new Date(
					event.startDate
				).toLocaleDateString()}</li>
              <li><strong>End Date:</strong> ${new Date(
					event.endDate
				).toLocaleDateString()}</li>
              <li><strong>Number of Attendees:</strong> ${
					event.numberOfAttendees
				}</li>
              <li><strong>Club:</strong> ${club.clubName}</li>
            </ul>
            <p>Please review the event at your earliest convenience.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, please contact the event instructor or OCA team.</p>
          </div>
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

		if (sessionClaims.metadata.role !== "instructor") {
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

		event.instructorApproval = true;

		await event.save();

		const ocaAccounts = await User.find(
			{ role: "oca" },
			{ email: 1, _id: 0 }
		);
		const ocaEmails = ocaAccounts.map((account) => account.email);

		const club = await Club.findOne({ _id: event.club });

		const members = await User.find(
			{
				clubID: club._id,
				leavedAt: { $exists: false },
				role: { $ne: "instructor" },
			},
			{ email: 1, _id: 0 }
		);

		const memberEmails = members.map((member) => member.email);
		const emails = [...ocaEmails, ...memberEmails];

		await sendEmailToOcaAndMembers(event, club, emails);

		return NextResponse.json({ event }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
