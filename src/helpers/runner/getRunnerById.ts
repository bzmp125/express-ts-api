import { Runner } from "../../interfaces";
import { Runner as RunnerModel } from "../../models";

export default (runnerId: string): Promise<Runner> => {
  return new Promise(async (resolve, reject) => {
    try {
      const runner = await RunnerModel.findById(runnerId);
      resolve(runner != null ? runner.toJSON() : null);
    } catch (e) {
      reject(e);
    }
  });
};
