import express, { Request, Response } from "express";
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid = require("uid2");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
import { UploadedFile } from "express-fileupload";
import { User, UserType } from "../models/User";
import { convertToBase64 } from "../utils/convertToBase64";

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

// 3 - Route pour voir son profil

// 4 - Modifier son image

// 5 - Modifier username

// 6 - Modifier email

// 7 - Supprimez le compte
