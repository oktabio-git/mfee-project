import express from "express";
import cors from "cors";
import helmet from "helmet";

import { corsOptions } from "./config/corsConfig";
import { verifyToken } from "./middleware/auth";

import categories from "./routes/categories";
import auth from "./routes/auth";
import posts from "./routes/posts";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));

app.use("/api/auth", auth);

app.use(verifyToken);
app.use("/api/categories", categories);
app.use("/api/posts", posts);

app.use(errorHandler);

export default app;
