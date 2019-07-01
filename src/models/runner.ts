import { Schema, model } from "mongoose";
import * as bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

const Runner = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {}
});

Runner.pre("save", function(next: any) {
  const admin: any = this;
  if (!admin.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, (err: any, salt: string) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(admin.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      admin.password = hash;
      next();
    });
  });
});

Runner.methods.comparePassword = function(candidatePassword: string, cb: any) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    (err: any, isMatch: boolean) => {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    }
  );
};

Runner.set("toJSON", {
  virtuals: true
});

export default model("Runner", Runner);
