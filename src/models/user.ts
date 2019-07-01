import { Schema, model } from "mongoose";
import * as bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: {}
});

UserSchema.pre("save", function(next: any) {
  const user: any = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, (err: any, salt: string) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(
  candidatePassword: string,
  cb: any
) {
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

export default model("User", UserSchema);
