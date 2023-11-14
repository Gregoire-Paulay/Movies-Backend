import express, { Request, Response } from "express";
import { Review, ReviewTypePopulate, ReviewType } from "../models/Review";
import { isAuthenticated } from "../middlewares/isAuthenticated";
const datemoment = require("moment");

export const reviewRouter = express.Router();

// type FeelingType = {
//   feeling?: "Good" | "Neutral" | "Bad";
// };

// 1 - Créer une review de film
reviewRouter.post(
  "/review/:movieId",
  isAuthenticated,
  async (req: any, res: Response) => {
    try {
      const { title, feeling, opinion } = req.body;
      const { movieId } = req.params;

      if (title && feeling && opinion && movieId) {
        const findMovie = await Review.find<ReviewType>({
          movieId,
        });

        // Aucun utilisateur n'a créer de review pour se film
        if (!findMovie) {
          const createReview = new Review({
            user: req.user._id,
            title,
            feeling,
            opinion,
            movieId,
            date: datemoment().format("YYYY-MM-DD"),
            like: [],
            dislike: [],
          });

          await createReview.save();
          return res.status(200).json({ message: "Review created" });
        } else {
          const userIdString: string = req.user._id.toString();
          //   console.log(userIdString);

          let review: boolean = false;

          findMovie.forEach(async (item: ReviewType) => {
            const reviewIdString: string = item.user.toString();
            if (reviewIdString === userIdString) {
              review = true;
              return res.status(200).json({
                message: "This user already posted a review for this film",
              });
            }
          });

          if (!review) {
            const createReview = new Review({
              user: req.user._id,
              title,
              feeling,
              opinion,
              movieId,
              date: datemoment().format("YYYY-MM-DD"),
              like: [],
              dislike: [],
            });
            await createReview.save();
            return res.status(200).json({ message: "Review created" });
          }
        }
      } else {
        return res
          .status(400)
          .json({ message: "missing parameters to create a review" });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

//  2 - Voir toutes les review d'un film

// 3 - Voir les review d'un user

// 4 - Modifier sa Review

// 5 - Supprimez sa review
