import express from "express";
import {
  createClient,
  loginClient,
  getUserConnected,
  updateClient,
  addTrajet,
  saveAsConducteur,
  getConducteurInfos,
  updateConducteurInfos,
  getAllTrajet,
  getTrajetEnCours,
  getOneTrajet,
  getTrajetEnCoursConducteur,
  reserverTrajet,
  getTrajetReserver,
  annulerTrajetReserver,
  getAllTrajetsAnnuler,
  searchTrajet,
  terminerTrajet,
  historiqueDepenses,
  historiqueGain,
  getAllClientReserveMyTrajet,
  annulerTrajetAjouter,
  getAllTrajetsTerminerByConduc,
  getAllTrajetsTerminer,
} from "../controllers/clientsController.js";
import multer from "multer";
import authClient from "../middlewares/authClient.js";

const router = express.Router();
const upload = multer();

router.post("/add-client", upload.any(), createClient);

router.post("/login-client", upload.any(), loginClient);

router.get("/get-client-connected", upload.any(), authClient, getUserConnected);

router.put("/update-client", upload.any(), authClient, updateClient);

router.post("/add-trajet", upload.any(), authClient, addTrajet);

router.get("/get-all-trajets", upload.any(), authClient, getAllTrajet);

router.get("/get-trajets-en-cours", upload.any(), authClient, getTrajetEnCours);

router.get(
  "/get-trajet-en-cours-conducteur",
  upload.any(),
  authClient,
  getTrajetEnCoursConducteur
);

router.get(
  "/get-trajtes-terminer-by-conducteur",
  upload.any(),
  authClient,
  getAllTrajetsTerminerByConduc
);

router.get(
  "/get-one-trajets-en-cours/:trajetId",
  upload.any(),
  authClient,
  getOneTrajet
);

router.post(
  "/reserver-trajet/:trajetId",
  upload.any(),
  authClient,
  reserverTrajet
);

router.get("/get-trajets-reserve", upload.any(), authClient, getTrajetReserver);

router.get("/termine", upload.any(), authClient, getAllTrajetsTerminer);

router.get(
  "/get-client-reserve-my-trajet/:trajetId",
  upload.any(),
  authClient,
  getAllClientReserveMyTrajet
);

router.put(
  "/annuler-trajet-reserver/:trajetId",
  upload.any(),
  authClient,
  annulerTrajetReserver
);

router.put(
  "/terminer-trajet/:trajetId",
  upload.any(),
  authClient,
  terminerTrajet
);

router.get(
  "/all-trajet-reserver-annuler",
  upload.any(),
  authClient,
  getAllTrajetsAnnuler
);

router.put(
  "/annuler-trajet-ajouter/:trajetId",
  upload.any(),
  authClient,
  annulerTrajetAjouter
);

router.post("/save-as-conducteur", upload.any(), authClient, saveAsConducteur);

router.get("/get-conducteur", upload.any(), authClient, getConducteurInfos);

router.put(
  "/update-conducteur",
  upload.any(),
  authClient,
  updateConducteurInfos
);

router.get(
  "/historique/depenses",
  upload.any(),
  authClient,
  historiqueDepenses
);

router.get("/historique/gains", upload.any(), authClient, historiqueGain);

router.post("/search-trajet", upload.any(), searchTrajet);
export default router;
