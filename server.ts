import express, { Application, Request, Response } from "express";
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const app: Application = express();
app.use(express.json()); // permet de manipuler les paramètre de type body
app.use(cors());

// Variables d'environnement
import { envVariables } from "./utils/envVariables";
const { PORT, NODE_ENV, MONGODB_URI } = envVariables;

// MongoDB
import mongoose from "mongoose";
mongoose.connect(MONGODB_URI);

// Authentification cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req: Request, res: Response) => {
  try {
    return res.status(200).json("Bienvenue sur le serveur Movies");
  } catch (error: any) {
    return res.status(500).json({ message: "Sorry, the app doesn't respond" });
  }
});

// Mes routes
import { moviesRouter } from "./routes/movies";
app.use(moviesRouter);
import { userRouter } from "./routes/users";
app.use(userRouter);
import { reviewRouter } from "./routes/reviews";
app.use(reviewRouter);

// Toute les routes sauf celles crées au dessus arriveront ici
app.all("*", (req, res) => {
  return res.status(404).json("Not found");
});
//Pour écouter le serveur : ici on écoute la requete du port 3000
app.listen(PORT, () => {
  console.log(`server started on port : ${PORT} in ${NODE_ENV} mode`);
});
