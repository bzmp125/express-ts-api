import { Request, Response } from "express";
import { deleteRunnerById, response, logger } from "../../helpers";

export default async (req: Request, res: Response) => {
  const { runnerId } = req.params;
  const tags = ["delete-runner"];

  try {
    await deleteRunnerById(runnerId);
    return res.json(response(true, "RUNNER DELETED."));
  } catch (e) {
    logger.error(`Exception when deleting runner ${runnerId}, e: ${e}`, {
      tags: [...tags, "exception", "exception-delete-runner"]
    });
    return res.status(500).json(response(false, "FAILED TO DELETE RUNNER."));
  }
};
