import mongoose from "mongoose";

export type ReviewTypePopulate = {
  user: {
    account: { username: string; avatar: string };
    _id: string;
  };
  feeling: string;
  opinion: string;
  date: string;
  movieId: number;
  title: string;
  like: [];
  dislike: [];
};

export type ReviewType = {
  user: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "User";
  };
  feeling: string;
  opinion: string;
  date: string;
  movieId: number;
  title: string;
  like: [];
  dislike: [];
};

const ReviewSchema = new mongoose.Schema<ReviewType>({
  user: Object,
  feeling: {
    type: String,
    enum: ["Good", "Neutral", "Bad"],
    default: "Neutral",
  },
  opinion: String,
  date: String,
  movieId: Number,
  title: String,
  like: Array,
  dislike: Array,
});

export const Review =
  mongoose.models.Review || mongoose.model<ReviewType>("Review", ReviewSchema);
