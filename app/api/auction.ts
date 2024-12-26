import { Request, Response } from "express";
import Auction from "../../lib/models/auction";
import Book from "../../lib/models/book";

// Extend the Request type to include `user`
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    email?: string;
  };
}

export const createAuction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { bookId, startingPrice, endTime } = req.body;

  try {
    // Find the book to ensure it exists and is not already auctioned
    const book = await Book.findById(bookId);

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    if (book.isAuctioned) {
      res.status(400).json({ error: "This book is already auctioned" });
      return;
    }

    // Create the auction
    const auction = await Auction.create({
      bookId,
      sellerId: req.user?._id,
      startingPrice,
      endTime,
    });

    // Update the book's status
    book.isAuctioned = true;
    await book.save();

    res.status(201).json(auction);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const getActiveAuctions = async (req: Request, res: Response): Promise<void> => {
  try {
    const auctions = await Auction.find({ status: "active" })
      .populate("bookId") // Include book details
      .populate("sellerId"); // Include seller details

    res.status(200).json(auctions);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const placeBid = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { auctionId, bidAmount } = req.body;

  try {
    const auction = await Auction.findById(auctionId);

    if (!auction || auction.status !== "active") {
      res.status(404).json({ error: "Auction not found or ended" });
      return;
    }

    if (bidAmount <= auction.currentBid) {
      res.status(400).json({ error: "Bid must be higher than the current bid" });
      return;
    }

    // Update the auction with the new bid
    auction.currentBid = bidAmount;
    auction.currentBidder = req.user?._id;

    await auction.save();

    res.status(200).json(auction);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
