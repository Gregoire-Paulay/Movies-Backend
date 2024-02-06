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
      const { title, feeling, opinion, movieName } = req.body;
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
            movieName,
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
              movieName,
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
reviewRouter.get(
  "/review/:movieId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { movieId } = req.params;
      const findMovieReviews = await Review.find<ReviewType>({
        movieId,
      })
        .populate({
          path: "user",
          select: ["account", "_id"],
          model: "User",
        })
        .sort({ date: -1 });
      //   console.log(findMovieReviews);

      if (findMovieReviews.length) {
        return res.status(200).json(findMovieReviews);
      } else {
        return res
          .status(200)
          .json({ message: "No reviews were found for this movie" });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// 3 - Voir les review d'un user
reviewRouter.get(
  "/reviews/user",
  isAuthenticated,
  async (req: any, res: Response) => {
    try {
      const { _id } = req.user;
      const findUserReviews = await Review.find({ user: _id }).sort({
        date: -1,
      });
      console.log(findUserReviews);

      return res.status(200).json(findUserReviews);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// 4 - Modifier sa Review
reviewRouter.put(
  "/review/:id",
  isAuthenticated,
  async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const { title, feeling, opinion } = req.body;
      const findReview = await Review.findById(id);

      const userIdFoundReview = findReview.user.toString();
      const userIdAuthenticated = req.user._id.toString();
      if (userIdFoundReview === userIdAuthenticated) {
        if (feeling && opinion && title) {
          findReview.feeling = feeling;
          findReview.opinion = opinion;
          findReview.title = title;

          findReview.save();

          return res
            .status(202)
            .json("The review has been modified successfully");
        } else {
          return res.status(400).json({ message: "missing parameters" });
        }
      } else {
        return res.status(400).json("This review is not yours");
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// 5 - Supprimez sa review
reviewRouter.delete(
  "/review/:id",
  isAuthenticated,
  async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const findReview = await Review.findById(id);

      const userIdFoundReview = findReview.user.toString();
      const userIdAuthenticated = req.user._id.toString();
      if (userIdFoundReview === userIdAuthenticated) {
        await Review.findByIdAndDelete(id);
        return res.status(200).json("The review has been deleted");
      } else {
        return res.status(400).json("This review is not yours");
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);
