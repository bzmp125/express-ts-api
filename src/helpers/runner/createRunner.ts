import { Runner } from "../../interfaces";
import { Runner as RunnerUserModel } from "../../models";

export default (
  name: string,
  email: string,
  password: string
): Promise<Runner> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newRunner = new RunnerUserModel({ name, email, password });
      await newRunner.save();
      const tmp = newRunner.toJSON();
      delete tmp._id;
      delete tmp.password;
      delete tmp.__v;
      resolve(tmp);
    } catch (e) {
      reject(e);
    }
  });
};
