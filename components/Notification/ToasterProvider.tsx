import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
  return <Toaster />;
};

import nodemailer from "nodemailer";

// Define the type for the auction object
interface Auction {
  currentBidderEmail: string;
  bookId: { title: string };
}

const notifyUsers = async (auction: Auction) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: "your-email@gmail.com", pass: "your-password" },
  });

  await transporter.sendMail({
    to: auction.currentBidderEmail,
    subject: "Auction Won",
    text: `Congratulations! You won the auction for ${auction.bookId.title}.`,
  });
};
