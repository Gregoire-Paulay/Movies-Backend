"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
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
exports.Review = mongoose_1.default.models.Review || mongoose_1.default.model("Review", ReviewSchema);
