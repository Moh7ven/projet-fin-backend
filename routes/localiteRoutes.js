import express from "express";
import {
  addLocalite,
  deleteLocalite,
  getAllLocalites,
  updateLocalite,
} from "../controllers/localiteController.js";
import authClient from "../middlewares/authClient.js";
import multer from "multer";

const router = express.Router();

const upload = multer();

router.post("/add-localite", upload.any(), addLocalite);

router.get("/get-all-localite", getAllLocalites);

router.put("/update-localite/:id", upload.any(), updateLocalite);

router.delete("/delete-localite/:id", upload.any(), deleteLocalite);

export default router;
