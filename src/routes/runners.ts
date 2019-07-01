import * as express from "express";
import { login, verifyToken } from "../controllers/runners";

const router = express.Router();

router.post("/login", login);

router.get("/verify", verifyToken);

export default router;
