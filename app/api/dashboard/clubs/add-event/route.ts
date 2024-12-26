import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/lib/models/Event";
import Club from "@/lib/models/Club";
import User from "@/lib/models/User";
import { auth } from "@clerk/nextjs/server";
import sendEmail from "@/app/api/mail/mail";

async function sendEmailToInstructor(event: any, club: any, email: string) {
	
	const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
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
            margin-bottom: 20px;
          }
          .header h1 {
            color: #fff;
            background-color: #4CAF50;
            padding: 15px;
            border-radius: 5px;
            font-size: 28px;
          }
          .cover-image {
            width: 100%;
            height: auto;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .section-title {
            color: #333;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .section-content {
            color: #555;
            font-size: 16px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 12px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #888;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Event Created</h1>
          </div>

          <img src="${event.cover}" alt="Event Cover" class="cover-image" />
          
          <p>Dear Instructor,</p>
          <p>A new event has been created by <strong>${
				club.clubName
			}</strong>. Below are the details:</p>
          
          <div class="section">
            <div class="section-title">Event Name:</div>
            <div class="section-content">${event.name}</div>
          </div>

          <div class="section">
            <div class="section-title">Event Description:</div>
            <div class="section-content">${event.description}</div>
          </div>

          <div class="section">
            <div class="section-title">Event Objective:</div>
            <div class="section-content">${event.objective}</div>
          </div>

          <div class="section">
            <div class="section-title">Event Impact:</div>
            <div class="section-content">${event.impact}</div>
          </div>

          <div class="section">
            <div class="section-title">Start Date:</div>
            <div class="section-content">${new Date(
				event.startDate
			).toLocaleDateString()}</div>
          </div>

          <div class="section">
            <div class="section-title">End Date:</div>
            <div class="section-content">${new Date(
				event.endDate
			).toLocaleDateString()}</div>
          </div>

          <div class="section">
            <div class="section-title">Number of Attendees:</div>
            <div class="section-content">${event.numberOfAttendees}</div>
          </div>

          <div class="section">
            <div class="section-title">Club:</div>
            <div class="section-content">${club.clubName}</div>
          </div>

          <div class="footer">
            <p>If you have any questions, feel free to reach out to us.</p>
            <a href="mailto:${email}" class="button">Contact Instructor</a>
          </div>
        </div>
      </body>
    </html>
  `;

	// Send the email to the instructor
	await sendEmail(email, "New Event Created", htmlContent);
}

export const POST = async (req: Request) => {
	try {
		await connectToDB();
		const { sessionClaims, userId } = await auth();
		if (!sessionClaims) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (
			sessionClaims.metadata.role !== "president" &&
			sessionClaims.metadata.role !== "vicepresident" &&
			sessionClaims.metadata.role !== "generalsecretary" &&
			sessionClaims.metadata.role !== "treasurer" &&
			sessionClaims.metadata.role !== "instructor" &&
			sessionClaims.metadata.role !== "oca"
		) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const user = await User.findOne({ clerkID: userId });

		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const clubID = user.clubID;

		if (!clubID) {
			return NextResponse.json(
				{ message: "User is not a member of any club" },
				{ status: 404 }
			);
		}

		const club = await Club.findOne({ _id: clubID });

		if (!club) {
			return NextResponse.json(
				{ message: "Club not found" },
				{ status: 404 }
			);
		}

		const { event } = await req.json();
		if (!event) {
			return NextResponse.json(
				{ message: "Event not found" },
				{ status: 404 }
			);
		}

		if (!event.rooms.length) {
			return NextResponse.json(
				{ message: "Please add a room" },
				{ status: 400 }
			);
		}

		const newEvent = new Event({
			...event,
			club: club._id,
		});

		await newEvent.save();

		const instructor = await User.findOne({
			role: "instructor",
			clubID: club._id,
		});

		const instructorEmails = instructor?.email;

		await sendEmailToInstructor(newEvent, club, instructorEmails);

		return NextResponse.json({ message: "Event added successfully" });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const GET = async (req: Request) => {
	try {
		await connectToDB();
		const { sessionClaims, userId } = await auth();
		if (!sessionClaims) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (
			sessionClaims.metadata.role !== "president" &&
			sessionClaims.metadata.role !== "vicepresident" &&
			sessionClaims.metadata.role !== "generalsecretary" &&
			sessionClaims.metadata.role !== "treasurer" &&
			sessionClaims.metadata.role !== "instructor" &&
			sessionClaims.metadata.role !== "oca"
		) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const user = await User.findOne({ clerkID: userId });

		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const clubID = user.clubID;

		if (!clubID) {
			return NextResponse.json(
				{ message: "User is not a member of any club" },
				{ status: 404 }
			);
		}

		const club = await Club.findOne({ _id: clubID });

		if (!club) {
			return NextResponse.json(
				{ message: "Club not found" },
				{ status: 404 }
			);
		}

		const events = await Event.find({ club: club._id }).sort({
			endDate: 1,
		});

		console.log(events);

		return NextResponse.json({ events });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const PUT = async (req: Request) => {
	try {
		await connectToDB();
		const { sessionClaims } = await auth();
		if (!sessionClaims) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (
			sessionClaims.metadata.role !== "president" &&
			sessionClaims.metadata.role !== "vicepresident" &&
			sessionClaims.metadata.role !== "generalsecretary" &&
			sessionClaims.metadata.role !== "treasurer" &&
			sessionClaims.metadata.role !== "oca" &&
			sessionClaims.metadata.role !== "instructor"
		) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { budget, eventId } = await req.json();

		if (!budget || !eventId) {
			return NextResponse.json(
				{ message: "Budget not found" },
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

		const updatedBudget = event.budget.map((b: any) => {
			if (b._id.toString() === budget._id) {
				return {
					...b,
					...budget,
				};
			}
			return b;
		});

		event.budget = updatedBudget;

		await event.save();

		return NextResponse.json({
			message: "Budget updated successfully",
			event,
		});
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
