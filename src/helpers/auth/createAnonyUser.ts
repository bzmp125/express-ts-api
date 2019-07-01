import { AnonyUser } from "../../interfaces";
import { AnonyUser as AnonyUserModel } from "../../models";

export default (hash: string): Promise<AnonyUser> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newUser = new AnonyUserModel({ hash });
      await newUser.save();
      resolve(newUser.toJSON());
    } catch (e) {
      reject(e);
    }
  });
};
