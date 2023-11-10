import express, { Request, Response } from "express";
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid = require("uid2");
import { User, UserType } from "../models/User";
import { ZodError, z } from "zod";

export const userRouter = express.Router();

// 1 - Route pour créer un utilisateur
userRouter.post("/user/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const foundUser = await User.findOne<UserType>({
      email: email,
    });
    console.log(foundUser);

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
      account: {
        username,
        avatar: {},
      },
      salt,
      token,
      hash,
    });
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
});
