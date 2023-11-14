"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    account: {
        username: { type: String, required: true },
        avatar: Object,
    },
    salt: { require: true, type: String },
    token: { require: true, type: String },
    hash: { require: true, type: String },
});
exports.User = mongoose_1.default.model("User", UserSchema);
