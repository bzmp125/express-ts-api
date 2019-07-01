import * as express from "express";
import {
  login,
  signup,
  verifyToken,
  resetPassword,
  anonymous
} from "../controllers/users";

const router = express.Router();

router.post("/anonymous", anonymous);

router.post("/login", login);

router.post("/signup", signup);

router.get("/verify", verifyToken);

router.post("/reset-password", resetPassword);

export default router;
