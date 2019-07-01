import { Runner } from "../../interfaces";
import { Runner as RunnerModel } from "../../models";

export default (email: string): Promise<Runner> => {
  return new Promise(async (resolve, reject) => {
    try {
      const runner = await RunnerModel.findOne({ email });
      resolve(runner != null ? runner.toJSON() : null);
    } catch (e) {
      reject(e);
    }
  });
};
