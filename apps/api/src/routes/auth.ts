import express, { Router } from "express";
import authController from "../controllers/auth";

const router = express.Router();

router.get("/", authController.register);

router.post("/", authController.login);

export default Router;
