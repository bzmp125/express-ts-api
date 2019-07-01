import { Response } from "express";
import { RunnerChanges } from "../../interfaces";
import { response, logger, getRunnerById, updateRunner } from "../../helpers";
import { allowedRunnerChangePars } from "../../config";

export default async (req: any, res: Response) => {
  const tags = ["update-runner"];

  const { runnerId } = req.params;

  const adminId = req.locals.user.id;

  const changes: Partial<RunnerChanges> = {
    last_edited_by: adminId
  };

  allowedRunnerChangePars.forEach(change => {
    if (req.body[change] != null) {
      changes[change] = req.body[change];
    }
  });

  try {
    const runner = await getRunnerById(runnerId);
    if (runner) {
      await updateRunner(runner._id, changes);
      logger.info(`Changes saved for runner ${runnerId}.`, {
        tags: [...tags, "changes-saved"]
      });
      return res.json(response(true, "CHANGES SAVED."));
    } else {
      logger.info(`Runner ${runnerId} not found.`, {
        tags: [...tags, "changes-not-saved"]
      });
      return res.json(response(false, "RUNNER NOT FOUND."));
    }
  } catch (e) {
    logger.error(
      `Exception when saving changes for runner ${runnerId}, e:${e}`,
      { tags: [...tags, "exception", "exception-saving-changes"] }
    );
    return res.status(500).json(response(false, "FAILED TO SAVE CHANGES."));
  }
};
