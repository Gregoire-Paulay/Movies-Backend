import express, { Request, Response } from "express";
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid = require("uid2");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
import { UploadedFile } from "express-fileupload";
import { User, UserType, UserTypewithId } from "../models/User";
import { convertToBase64 } from "../utils/convertToBase64";
import { isAuthenticated } from "../middlewares/isAuthenticated";

export const userRouter = express.Router();

// 1 - Route pour créer un utilisateur
userRouter.post(
  "/user/signup",
  fileUpload(),
  async (req: any, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const foundUser = await User.findOne<UserType>({
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
      const newUser = new User({
        email,
        account: { username },
        salt,
        token,
        hash,
      });

      if (req.files?.avatar) {
        const pictureToUpload: UploadedFile | UploadedFile[] | undefined =
          req.files.avatar;
        const cloudinaryResponse = await cloudinary.uploader.upload(
          convertToBase64(pictureToUpload),
          {
            folder: `movies/users/${newUser._id}`,
            public_id: "avatar",
          }
        );
        newUser.account.avatar = cloudinaryResponse;
      }

      await newUser.save();
      const responseObject = {
        account: {
          username: username,
        },
        email: email,
      };
      // console.log(responseObject);

      res.status(200).json(responseObject);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// 2 - Route pour se connecter
userRouter.post("/user/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne<UserTypewithId>({ email: email });
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
      } else {
        return res
          .status(400)
          .json({ message: "l'email ou mot de passe incorrecte" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "l'email ou mot de passe incorrecte" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// 3 - Route pour voir son profil
userRouter.get(
  "/user/profile",
  isAuthenticated,
  async (req: any, res: Response) => {
    try {
      // console.log(req.user);
      const { _id, email, account } = req.user;
      let avatarResponse = [];
      if (account.avatar?.secure_url) {
        avatarResponse.push({ secure_url: account.avatar.secure_url });
      }
      const responseObject = {
        id: _id,
        email: email,
        username: account.username,
        avatar: avatarResponse,
      };
      res.status(200).json(responseObject);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// 4 - Modifier email
userRouter.put(
  "/user/email",
  isAuthenticated,
  async (req: any, res: Response) => {
    const { email } = req.body;
    try {
      if (email && typeof email === "string") {
        const searchEmail = await User.findOne<UserType>({ email });
        if (searchEmail) {
          return res
            .status(400)
            .json({ message: "This email is already used" });
        } else {
          let userNewMail = req.user;
          if (userNewMail.email !== email) {
            userNewMail.email = email;
            userNewMail.save();
            return res.status(202).json({ message: "Your email was modified" });
          } else {
            return res
              .status(400)
              .json({ message: "This is already your email" });
          }
        }
      } else {
        return res.status(400).json({ message: "Invalid email in request" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// 5 - Modifier username

// 6 - Modifier son image

// 7 - Supprimez le compte
