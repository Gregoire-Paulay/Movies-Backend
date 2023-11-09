import express, { Request, Response } from "express";
import { ZodError, z } from "zod";
import axios from "axios";

import { envVariables } from "../utils/envVariables";
const { API_KEY, BEARER_TOKEN } = envVariables;

export const moviesRouter = express.Router();

const PopularMoviesSchema = z.object({
  page: z.number(),
  results: z.array(
    z.object({
      adult: z.boolean(),
      backdrop_path: z.string(),
      genre_ids: z.array(z.number()),
      id: z.number(),
      original_language: z.string(),
      original_title: z.string(),
      overview: z.string(),
      popularity: z.number(),
      poster_path: z.string(),
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

// 1 Route qui renvoie les films populaires
moviesRouter.get("/movies/popular", async (req: Request, res: Response) => {
  const { page } = req.query;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?language=fr&page=${page}`,
      { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } }
    );
    const movieParse = PopularMoviesSchema.parse(response.data);
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