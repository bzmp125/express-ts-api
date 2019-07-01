import { RunnerChanges } from "../../interfaces";
import { Runner } from "../../models";
import { allowedRunnerChangePars } from "../../config";

export default (runnerId: string, changes: Partial<RunnerChanges>) => {
  return new Promise(async (resolve, reject) => {
    try {
      const runner = await Runner.findById(runnerId);
      if (runner) {
        Object.keys(changes).forEach(change => {
          if (allowedRunnerChangePars.indexOf(change) != -1)
            runner[change] = changes[change];
        });

        await runner.save();
        resolve();
      } else {
        reject(new Error("Order Not Found."));
      }
    } catch (e) {
      reject(e);
    }
  });
};
