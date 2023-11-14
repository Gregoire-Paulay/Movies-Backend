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
exports.moviesRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
const envVariables_1 = require("../utils/envVariables");
const { API_KEY, BEARER_TOKEN } = envVariables_1.envVariables;
exports.moviesRouter = express_1.default.Router();
const MoviesSchema = zod_1.z.object({
    page: zod_1.z.number(),
    results: zod_1.z.array(zod_1.z.object({
        adult: zod_1.z.boolean(),
        backdrop_path: zod_1.z.string().nullable(),
        genre_ids: zod_1.z.array(zod_1.z.number()),
        id: zod_1.z.number(),
        original_language: zod_1.z.string(),
        original_title: zod_1.z.string(),
        overview: zod_1.z.string(),
        popularity: zod_1.z.number(),
        poster_path: zod_1.z.string().nullable(),
        release_date: zod_1.z.string(),
        title: zod_1.z.string(),
        video: zod_1.z.boolean(),
        vote_average: zod_1.z.number(),
        vote_count: zod_1.z.number(),
    })),
    total_pages: zod_1.z.number(),
    total_results: zod_1.z.number(),
});
const MoviesDetailsSchema = zod_1.z.object({
    adult: zod_1.z.boolean(),
    backdrop_path: zod_1.z.string().nullable(),
    belongs_to_collection: zod_1.z
        .object({
        id: zod_1.z.number(),
        name: zod_1.z.string(),
        poster_path: zod_1.z.string().nullable(),
        backdrop_path: zod_1.z.string().nullable(),
    })
        .nullable(),
    budget: zod_1.z.number(),
    genres: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.number(),
        name: zod_1.z.string(),
    })),
    homepage: zod_1.z.string(),
    id: zod_1.z.number(),
    imdb_id: zod_1.z.string(),
    original_language: zod_1.z.string(),
    original_title: zod_1.z.string(),
    overview: zod_1.z.string(),
    popularity: zod_1.z.number(),
    poster_path: zod_1.z.string().nullable(),
    production_companies: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.number(),
        logo_path: zod_1.z.string().nullable(),
        name: zod_1.z.string(),
        origin_country: zod_1.z.string(),
    })),
    production_countries: zod_1.z.array(zod_1.z.object({
        iso_3166_1: zod_1.z.string(),
        name: zod_1.z.string(),
    })),
    release_date: zod_1.z.string(),
    revenue: zod_1.z.number(),
    runtime: zod_1.z.number(),
    status: zod_1.z.string(),
    tagline: zod_1.z.string(),
    title: zod_1.z.string(),
    video: zod_1.z.boolean(),
    vote_average: zod_1.z.number(),
    vote_count: zod_1.z.number(),
});
// 1 Route qui renvoie les films populaires
exports.moviesRouter.get("/movies/popular", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page } = req.query;
    try {
        const response = yield axios_1.default.get(`https://api.themoviedb.org/3/movie/popular?language=fr&page=${page}`, { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } });
        const movieParse = MoviesSchema.parse(response.data);
        // console.log(response.data);
        res.status(200).json(movieParse);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error);
        }
        else {
            res.status(500).json(error);
        }
    }
}));
// 2 - Route pour chercher un film
exports.moviesRouter.get("/movies/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    try {
        const response = yield axios_1.default.get(`https://api.themoviedb.org/3/search/movie?language=fr&query=${title}`, { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } });
        // console.log(response.data);
        const movieParse = MoviesSchema.parse(response.data);
        res.status(200).json(movieParse);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error);
        }
        else {
            res.status(500).json(error);
        }
    }
}));
// 3 - Route qui renvoi le detail d'un film
exports.moviesRouter.get("/movies/details/:movie_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movie_id } = req.params;
    try {
        const response = yield axios_1.default.get(`https://api.themoviedb.org/3/movie/${movie_id}?language=fr`, { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } });
        // console.log(response.data);
        const movieParse = MoviesDetailsSchema.parse(response.data);
        res.status(200).json(movieParse);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error);
        }
        else {
            res.status(500).json(error);
        }
    }
}));
