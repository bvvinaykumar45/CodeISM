import {Router} from "express";

const router = new Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', me);

export default router;
