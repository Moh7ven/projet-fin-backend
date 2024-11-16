import express from "express";
import { getAllClients } from "../controllers/adminController.js";
import multer from "multer";

const upload = multer();

const router = express.Router();

router.get("/get-all-clients", upload.any(), getAllClients);
export default router;
