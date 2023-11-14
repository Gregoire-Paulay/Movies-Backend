"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const app = (0, express_1.default)();
app.use(express_1.default.json()); // permet de manipuler les paramètre de type body
app.use(cors());
// Variables d'environnement
const envVariables_1 = require("./utils/envVariables");
const { PORT, NODE_ENV, MONGODB_URI } = envVariables_1.envVariables;
// MongoDB
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(MONGODB_URI);
// Authentification cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.get("/", (req, res) => {
    try {
        return res.status(200).json("Bienvenue sur le serveur Movies");
    }
    catch (error) {
        return res.status(500).json({ message: "Sorry, the app doesn't respond" });
    }
});
// Mes routes
const movies_1 = require("./routes/movies");
app.use(movies_1.moviesRouter);
const users_1 = require("./routes/users");
app.use(users_1.userRouter);
const reviews_1 = require("./routes/reviews");
app.use(reviews_1.reviewRouter);
// Toute les routes sauf celles crées au dessus arriveront ici
app.all("*", (req, res) => {
    return res.status(404).json("Not found");
});
//Pour écouter le serveur : ici on écoute la requete du port 3000
app.listen(PORT, () => {
    console.log(`server started on port : ${PORT} in ${NODE_ENV} mode`);
});
