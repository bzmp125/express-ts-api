import { Request, Response } from "express";
import {
  missingPars,
  response,
  createRunner,
  logger,
  getRunnerByEmail
} from "../../helpers";

export default async (req: Request, res: Response) => {
  const requiredPars = ["name", "email"];
  const tags = ["create-runner"];
  const missing = missingPars(requiredPars, req.body);

  if (missing.length > 0) {
    return res.json(
      response(false, "MISSING OR INVALID PARAMETERS.", { missing })
    );
  } else {
    const { email } = req.body;

    // check if runner exists
    const similarRunner = await getRunnerByEmail(email);

    if (similarRunner) {
      return res.json(response(false, "SIMILAR RUNNER EXISTS."));
    }

    // similar runner doesn't exist

    const password = (Math.random() + 1)
      .toString()
      .replace("1.", "")
      .substr(0, 8);
    const { name } = req.body;
    try {
      const newRunner = await createRunner(name, email, password);
      if (newRunner) {
        logger.info(`Runner ${email} created.`, {
          tags: [...tags, "runner-created"]
        });
        return res.json(
          response(true, "RUNNER CREATED.", { ...newRunner, password })
        );
      } else {
        logger.info(`Runner ${email} not created.`, {
          tags: [...tags, "runner-not-created"]
        });
        return res.json(response(false, "RUNNER NOT CREATED."));
      }
    } catch (e) {
      logger.error(`Exception when creating runner ${email}, e: ${e}`, {
        tags: [...tags, "exception", "exception-creating-runner"]
      });
      return res.status(500).json(response(false, "FAILED TO CREATE RUNNER."));
    }
  }
};
