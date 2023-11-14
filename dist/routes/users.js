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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid = require("uid2");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const User_1 = require("../models/User");
const Review_1 = require("../models/Review");
const convertToBase64_1 = require("../utils/convertToBase64");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
exports.userRouter = express_1.default.Router();
// 1 - Route pour créer un utilisateur
exports.userRouter.post("/user/signup", fileUpload(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { username, email, password } = req.body;
        const foundUser = yield User_1.User.findOne({
            email: email,
        });
        //   console.log(foundUser);
        if (!username || !email || !password) {
            return res.status(400).json("Missing Parameters");
        }
        if (foundUser) {
            return res.status(409).json("This mail is already in use");
        }
        // Création nouvel utilisateur
        const salt = uid(16);
        const token = uid(32);
        const saltPassword = password + salt;
        const hash = SHA256(saltPassword).toString(encBase64);
        const newUser = new User_1.User({
            email,
            account: { username },
            salt,
            token,
            hash,
        });
        if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.avatar) {
            const pictureToUpload = req.files.avatar;
            const cloudinaryResponse = yield cloudinary.uploader.upload((0, convertToBase64_1.convertToBase64)(pictureToUpload), {
                folder: `movies/users/${newUser._id}`,
                public_id: "avatar",
            });
            newUser.account.avatar = cloudinaryResponse.secure_url;
        }
        yield newUser.save();
        const responseObject = {
            account: {
                username: username,
            },
            email: email,
        };
        // console.log(responseObject);
        return res.status(200).json(responseObject);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
// 2 - Route pour se connecter
exports.userRouter.post("/user/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const foundUser = yield User_1.User.findOne({ email: email });
        if (foundUser) {
            const newSaltPassword = password + foundUser.salt;
            const newHash = SHA256(newSaltPassword).toString(encBase64);
            if (newHash === foundUser.hash) {
                const responseObject = {
                    _id: foundUser._id,
                    token: foundUser.token,
                    account: { username: foundUser.account.username },
                };
                return res.status(200).json(responseObject);
            }
            else {
                return res
                    .status(400)
                    .json({ message: "l'email ou mot de passe incorrecte" });
            }
        }
        else {
            return res
                .status(400)
                .json({ message: "l'email ou mot de passe incorrecte" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
// 3 - Route pour voir son profil
exports.userRouter.get("/user/profile", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.user);
        const { _id, email, account } = req.user;
        let avatarResponse = "";
        if (account.avatar) {
            avatarResponse = account.avatar;
        }
        const responseObject = {
            id: _id,
            email: email,
            username: account.username,
            avatar: avatarResponse,
        };
        return res.status(200).json(responseObject);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
// 4 - Modifier email
exports.userRouter.put("/user/email", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (email && typeof email === "string") {
            const searchEmail = yield User_1.User.findOne({ email });
            if (searchEmail) {
                return res
                    .status(400)
                    .json({ message: "This email is already used" });
            }
            else {
                let userNewMail = req.user;
                userNewMail.email = email;
                userNewMail.save();
                return res.status(202).json({ message: "Your email was modified" });
            }
        }
        else {
            return res.status(400).json({ message: "Invalid email in request" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
// 5 - Modifier username
exports.userRouter.put("/user/username", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    // console.log(req.user);
    try {
        if (username === req.user.account.username) {
            return res
                .status(400)
                .json({ message: "This is already your username" });
        }
        const foundUser = yield User_1.User.findOne({
            account: { username: username },
        });
        if (foundUser) {
            return res
                .status(400)
                .json({ message: "This username is already used" });
        }
        else {
            let newUsername = req.user;
            newUsername.account.username = username;
            newUsername.save();
            return res.status(202).json({ message: "Your username was modified" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
// 6 - Modifier son image
exports.userRouter.put("/user/avatar", isAuthenticated_1.isAuthenticated, fileUpload(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.files) {
            //On supprime l'ancien Avatar
            const cloudinaryId = req.user.account.avatar.split("/")[9];
            const avatarCloudinaryId = "movies/users/" + cloudinaryId + "/avatar";
            // console.log(avatarCloudinaryId);
            yield cloudinary.uploader.destroy(avatarCloudinaryId);
            // On ajoute le nouvel avatar
            const pictureToUpload = req.files.avatar;
            const cloudinaryResponse = yield cloudinary.uploader.upload((0, convertToBase64_1.convertToBase64)(pictureToUpload), {
                folder: `movies/users/${req.user._id}`,
                public_id: "avatar",
            });
            req.user.account.avatar = cloudinaryResponse.secure_url;
            yield req.user.save();
            return res
                .status(202)
                .json({ message: "Your avatar has been modified" });
        }
        else {
            return res.status(400).json({ message: "missing picture to transfer" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
// 7 - Supprimez le compte
exports.userRouter.delete("/user/delete", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        // console.log(req.user);
        if (email === req.user.email) {
            const foundUserReview = yield Review_1.Review.find({ user: req.user._id });
            for (let i = 0; i < foundUserReview.length; i++) {
                foundUserReview[i].user = "deleted account";
                foundUserReview[i].save();
            }
            yield User_1.User.findByIdAndDelete(req.user._id);
            return res
                .status(200)
                .json({ message: "Your account has been deleted succesfully" });
        }
        else {
            return res.status(400).json({ message: "email not valid" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
