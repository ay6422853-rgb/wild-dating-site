import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { updateProfile } from "../controllers/profileController.js";
import { discover, interact, matches } from "../controllers/discoveryController.js";
import { listMessages, sendMessage } from "../controllers/messageController.js";
import { createReport } from "../controllers/reportController.js";
import { dashboard, users, reports, setUserStatus } from "../controllers/adminController.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", auth, me);

router.put("/profile", auth, updateProfile);
router.get("/discover", auth, discover);
router.post("/interactions", auth, interact);
router.get("/matches", auth, matches);

router.get("/matches/:matchId/messages", auth, listMessages);
router.post("/matches/:matchId/messages", auth, sendMessage);

router.post("/reports", auth, createReport);

router.get("/admin/dashboard", auth, adminOnly, dashboard);
router.get("/admin/users", auth, adminOnly, users);
router.get("/admin/reports", auth, adminOnly, reports);
router.patch("/admin/users/:id/status", auth, adminOnly, setUserStatus);

export default router;