import * as express from "express";
import { login, register, verifyToken } from "../controllers/affiliates";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.get("/verify", verifyToken);

export default router;
