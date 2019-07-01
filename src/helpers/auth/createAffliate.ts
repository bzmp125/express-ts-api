import { Affiliate } from "../../interfaces";
import { Affiliate as AffiliateUserModel } from "../../models";

export default (
  name: string,
  email: string,
  password: string
): Promise<Affiliate> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newAffiliate = new AffiliateUserModel({ name, email, password });
      await newAffiliate.save();
      const tmp = newAffiliate.toJSON();
      delete tmp._id;
      delete tmp.password;
      delete tmp.__v;
      resolve(tmp);
    } catch (e) {
      reject(e);
    }
  });
};
