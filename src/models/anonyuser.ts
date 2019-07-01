import { Schema, model } from "mongoose";

const AnonyUserSchema = new Schema({
  hash: { type: String, required: true, unique: true },
  password: {}
});

export default model("AnonyUser", AnonyUserSchema);
