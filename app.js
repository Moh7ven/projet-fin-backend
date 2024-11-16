import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig.js";
import connectDB from "./config/db.js";
import clientRoutes from "./routes/clientsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import localiteRoutes from "./routes/localiteRoutes.js";
import reclamationsRoutes from "./routes/reclamationsRoutes.js";

const apiURL = "/api/v1";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());

app.use(`${apiURL}/clients/`, clientRoutes);
app.use(`${apiURL}/admin/`, adminRoutes);
app.use(`${apiURL}/localites/`, localiteRoutes);
app.use(`${apiURL}/reclamations/`, reclamationsRoutes);
export default app;
