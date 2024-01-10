import express, { Request, Response } from "express";
import { ZodError, z } from "zod";
import axios from "axios";

import { envVariables } from "../utils/envVariables";
const { API_KEY, BEARER_TOKEN } = envVariables;

export const moviesRouter = express.Router();

const MoviesSchema = z.object({
  page: z.number(),
  results: z.array(
    z.object({
      adult: z.boolean(),
      backdrop_path: z.string().nullable(),
      genre_ids: z.array(z.number()),
      id: z.number(),
      original_language: z.string(),
      original_title: z.string(),
      overview: z.string(),
      popularity: z.number(),
      poster_path: z.string().nullable(),
      release_date: z.string(),
      title: z.string(),
      video: z.boolean(),
      vote_average: z.number(),
      vote_count: z.number(),
    })
  ),
  total_pages: z.number(),
  total_results: z.number(),
});

const MoviesDetailsSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  belongs_to_collection: z
    .object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string().nullable(),
      backdrop_path: z.string().nullable(),
    })
    .nullable(),
  budget: z.number(),
  genres: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  homepage: z.string(),
  id: z.number(),
  imdb_id: z.string(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  production_companies: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string().nullable(),
      name: z.string(),
      origin_country: z.string(),
    })
  ),
  production_countries: z.array(
    z.object({
      iso_3166_1: z.string(),
      name: z.string(),
    })
  ),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  status: z.string(),
  tagline: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

// 1 Route qui renvoie les films populaires
moviesRouter.get("/movies/popular", async (req: Request, res: Response) => {
  const { page } = req.query;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?language=fr&page=${page}`,
      { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } }
    );
    const movieParse = MoviesSchema.parse(response.data);
    // console.log(response.data);

    res.status(200).json(movieParse);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

// 2 - Route pour chercher un film
moviesRouter.post("/movies/search", async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?language=fr&query=${title}`,
      { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } }
    );
    // console.log(response.data);
    const movieParse = MoviesSchema.parse(response.data);

    res.status(200).json(movieParse);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

// 3 - Route qui renvoi le detail d'un film
moviesRouter.get(
  "/movies/details/:movie_id",
  async (req: Request, res: Response) => {
    const { movie_id } = req.params;
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie_id}?language=fr`,
        { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } }
      );
      // console.log(response.data);
      const movieParse = MoviesDetailsSchema.parse(response.data);

      res.status(200).json(movieParse);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  }
);
