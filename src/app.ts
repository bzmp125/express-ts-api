import * as Dotenv from "dotenv";
Dotenv.config();

import * as Compression from "compression";
import * as Express from "express";
import { Request, Response, NextFunction } from "express";
import * as Helmet from "helmet";
import * as Cors from "cors";
import * as Mongoose from "mongoose";
import * as BodyParser from "body-parser";
import AdminRouter from "./routes/admin";
import AffiliatesRouter from "./routes/affiliates";
import RunnersRouter from "./routes/runners";
import UserRouter from "./routes/users";
import { dbUrl as DbURL } from "./settings";
import { logger, response } from "./helpers";
import { init as RabbotInit } from "./services/rabbitmq";

const app = Express();
const tags = ["app"];

// Middleware
// Using helmet per best practise: https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(Helmet());
// Using gzip compression per best practise: https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression
app.use(Compression());
// use cors
app.use(
  Cors({
    allowedHeaders: "Content-Type",
    methods: "GET,HEAD,PUT,POST,DELETE,OPTIONS",
    origin: "*"
  })
);

// use body parser
app.use(BodyParser.json());

// establish db connection then set routes

Mongoose.connect(
  DbURL,
  { useNewUrlParser: true }
)
  .then(() => {
    logger.info("Connected to DB", {
      tags: `${[...tags, "database-connected"]}`
    });
  })
  .catch(err => {
    logger.info(`Failed to Connect to DB ${err}`, {
      tags: `${[...tags, "database-connection-failed"]}`
    });
  });

RabbotInit();

app.use("/admin", AdminRouter);
app.use("/user", UserRouter);
app.use("/affiliates", AffiliatesRouter);
app.use("/runners", RunnersRouter);

// 404 - error handler
// tslint:disable:variable-name
app.use((_req: Express.Request, _res: Express.Response) => {
  _res.status(404).json(response(false, "ROUTE NOT FOUND."));
});

// 500 - error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Checking if headers sent per recommendation: https://expressjs.com/en/guide/error-handling.html
  if (res.headersSent) {
    return next(err);
  }

  // set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.send();
});

export default app;
