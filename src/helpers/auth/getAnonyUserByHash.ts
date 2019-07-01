import { AnonyUser } from "../../interfaces";
import { AnonyUser as AnonyUserModel } from "../../models";

export default (hash: string): Promise<AnonyUser> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await AnonyUserModel.findOne({ hash });
      resolve(user != null ? user.toJSON() : null);
    } catch (e) {
      reject(e);
    }
  });
};
