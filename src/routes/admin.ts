import * as express from "express";
import { login, verifyToken } from "../controllers/adminController";
import {
  createRunner,
  updateRunner,
  deleteRunner
} from "../controllers/runners";
import authAdmin from "../middleware/auth-admin";

const router = express.Router();

// login admin
router.post("/login", login);

router.get("/verify", verifyToken);

router.post("/runners", authAdmin, createRunner);

router.put("/runner/:runnerId", authAdmin, updateRunner);

router.delete("/runner/:runnerId", authAdmin, deleteRunner);
// register an admin
// router.post("/register", register);

export default router;
