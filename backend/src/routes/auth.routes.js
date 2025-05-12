import { Router } from "express";

import { isLoggedIn } from "../middlewares/auth.middlewares";

const router = new Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", isLoggedIn, logoutUser);
router.get("/me", isLoggedIn, me);

export default router;
