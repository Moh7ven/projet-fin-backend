import mongoose from "mongoose";

const trajetReserverSchema = mongoose.Schema({
  idTrajet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trajets",
  },
  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
  },
  date: { type: String, required: true },
  heure: { type: String, required: true },
  annuler: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TrajetsReserver = mongoose.model("TrajetsReserver", trajetReserverSchema);

export default TrajetsReserver;
