import express, { Application, Request, Response } from "express";

// Variables d'environnement
import { envVariables } from "./utils/envVariables";
const { PORT, NODE_ENV } = envVariables;

// Import de mes routes
import { moviesRouter } from "./routes/movies";

const app: Application = express();
app.use(express.json()); // permet de manipuler les paramètre de type body

app.get("/", (req: Request, res: Response) => {
  try {
    return res.status(200).json("Bienvenue sur le serveur Movies");
  } catch (error: any) {
    return res.status(500).json({ message: "Sorry, the app doesn't respond" });
  }
});

// Mes routes
app.use(moviesRouter);

// Toute les routes sauf celles crées au dessus arriveront ici
app.all("*", (req, res) => {
  return res.status(404).json("Not found");
});
//Pour écouter le serveur : ici on écoute la requete du port 3000
app.listen(PORT, () => {
  console.log(`server started on port : ${PORT} in ${NODE_ENV} mode`);
});
