"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const Review_1 = require("../models/Review");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const datemoment = require("moment");
exports.reviewRouter = express_1.default.Router();
// type FeelingType = {
//   feeling?: "Good" | "Neutral" | "Bad";
// };
// 1 - Créer une review de film
exports.reviewRouter.post("/review/:movieId", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, feeling, opinion } = req.body;
        const { movieId } = req.params;
        if (title && feeling && opinion && movieId) {
            const findMovie = yield Review_1.Review.find({
                movieId,
            });
            // Aucun utilisateur n'a créer de review pour se film
            if (!findMovie) {
                const createReview = new Review_1.Review({
                    user: req.user._id,
                    title,
                    feeling,
                    opinion,
                    movieId,
                    date: datemoment().format("YYYY-MM-DD"),
                    like: [],
                    dislike: [],
                });
                yield createReview.save();
                return res.status(200).json({ message: "Review created" });
            }
            else {
                const userIdString = req.user._id.toString();
                //   console.log(userIdString);
                let review = false;
                findMovie.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                    const reviewIdString = item.user.toString();
                    if (reviewIdString === userIdString) {
                        review = true;
                        return res.status(200).json({
                            message: "This user already posted a review for this film",
                        });
                    }
                }));
                if (!review) {
                    const createReview = new Review_1.Review({
                        user: req.user._id,
                        title,
                        feeling,
                        opinion,
                        movieId,
                        date: datemoment().format("YYYY-MM-DD"),
                        like: [],
                        dislike: [],
                    });
                    yield createReview.save();
                    return res.status(200).json({ message: "Review created" });
                }
            }
        }
        else {
            return res
                .status(400)
                .json({ message: "missing parameters to create a review" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
//  2 - Voir toutes les review d'un film
exports.reviewRouter.get("/review/:movieId", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const findMovieReviews = yield Review_1.Review.find({
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
        }
        else {
            return res
                .status(200)
                .json({ message: "No reviews were found for this movie" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
// 3 - Voir les review d'un user
exports.reviewRouter.get("/reviews/user", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const findUserReviews = yield Review_1.Review.find({ user: _id }).sort({
            date: -1,
        });
        console.log(findUserReviews);
        return res.status(200).json(findUserReviews);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
// 4 - Modifier sa Review
exports.reviewRouter.put("/review/:id", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, feeling, opinion } = req.body;
        const findReview = yield Review_1.Review.findById(id);
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
            }
            else {
                return res.status(400).json({ message: "missing parameters" });
            }
        }
        else {
            return res.status(400).json("This review is not yours");
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
// 5 - Supprimez sa review
exports.reviewRouter.delete("/review/:id", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const findReview = yield Review_1.Review.findById(id);
        const userIdFoundReview = findReview.user.toString();
        const userIdAuthenticated = req.user._id.toString();
        if (userIdFoundReview === userIdAuthenticated) {
            yield Review_1.Review.findByIdAndDelete(id);
            return res.status(200).json("The review has been deleted");
        }
        else {
            return res.status(400).json("This review is not yours");
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
