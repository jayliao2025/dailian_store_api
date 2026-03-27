import express from "express";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
