import { UserAuth } from "./../interfaces";
import { serviceUrl } from "./../config/index";
import { Response, NextFunction } from "express";
import { response, logger } from "../helpers";
import axios from "axios";

const tags = ["token-verification"];

export default async (req: any, res: Response, next: NextFunction) => {
  if (req.headers && req.headers.token) {
    const { token } = req.headers;
    try {
      const authResponse = (await axios.get(`${serviceUrl}/admin/verify`, {
        headers: { token }
      })).data;

      if (
        authResponse &&
        authResponse.message === "ADMIN VERIFIED." &&
        authResponse.data
      ) {
        if (!req.locals) req.locals = {} as UserAuth;
        logger.info(
          authResponse.message
            .toLocaleLowerCase()
            .split(" ")
            .join("-"),
          { tags: `${[...tags, "successful-token-verification"]}` }
        );
        req.locals = { ...authResponse.data };
        next();
      } else {
        const message = "TOKEN NOT VERIFIED.";
        logger.info(
          message
            .toLocaleLowerCase()
            .split(" ")
            .join("-"),
          { tags: `${[...tags, "failed-token-verification"]}` }
        );
        res.json(response(false, message));
      }
    } catch (e) {
      logger.error(`Exception when verifying token ${e}`, {
        tags: `${[...tags, "exception", "exception-token-verification"]}`
      });
      res.status(500).json(response(false, "FAILED TO VERIFY TOKEN."));
    }
  } else {
    res.json(response(false, "MISSING TOKEN."));
  }
};
