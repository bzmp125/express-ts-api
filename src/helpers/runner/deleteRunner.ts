import { Runner } from "../../models";
export default (runnerId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Runner.findByIdAndDelete(runnerId);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
