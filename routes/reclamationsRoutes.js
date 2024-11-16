import express from "express";
import authClient from "../middlewares/authClient.js";
import multer from "multer";
import {
  createReclamation,
  getAllReclamations,
} from "../controllers/reclamationController.js";

const router = express.Router();

const upload = multer();

router.post("/add-reclamation", upload.any(), authClient, createReclamation);

router.get("/get-all-reclamations", upload.any(), getAllReclamations);

export default router;
