// imports
import express from "express";
import {
  getOtherUsers,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

// create a router
const router = express.Router();

// create routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated, getOtherUsers);

// export router
export default router;
