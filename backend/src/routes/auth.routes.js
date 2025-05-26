import { Router } from "express";

import { registerUser, loginUser, logoutUser, me } from '../controllers/auth.controllers.js';
import { isLoggedIn } from "../middlewares/auth.middlewares.js";

const router = new Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", isLoggedIn, logoutUser);
router.get("/me", isLoggedIn, me);

export default router;
