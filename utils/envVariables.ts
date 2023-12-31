import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  PORT: z.string().nonempty(),
  NODE_ENV: z
    .string()
    .refine((value) => value === "production" || value === "development", {
      message: "NODE_ENV must be 'production' or 'development'",
    }),
  API_KEY: z.string(),
  BEARER_TOKEN: z.string(),
  MONGODB_URI: z.string(),
  CLOUDINARY_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

export const envVariables = schema.parse(process.env);
