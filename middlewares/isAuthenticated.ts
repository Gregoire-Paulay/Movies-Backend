import { User } from "../models/User";
import { Request, Response, NextFunction } from "express-serve-static-core";

export const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      console.log("Middleware isAuthenticated");

      const receivedToken = req.headers.authorization.replace("Bearer ", "");
      const foundUser = await User.findOne({ token: receivedToken });
      if (foundUser) {
        console.log("Authorized");
        req.user = foundUser;
        return next();
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
