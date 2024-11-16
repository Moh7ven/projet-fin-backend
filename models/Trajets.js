import mongoose from "mongoose";

const trajetSchema = mongoose.Schema({
  idConducteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conducteurs",
  },
  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
  },
  idLocalite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Localites",
  },
  date: { type: String, required: true },
  heure: { type: String, required: true },
  lieuDepart: { type: String, required: true },
  lieuArrivee: { type: String, required: true },
  distance: { type: Number, required: false },
  cout: { type: Number, required: true },
  note: { type: String, required: false },
  active: { type: Boolean, default: true },
  terminer: { type: Boolean, default: false },
  placeRestantes: { type: Number, required: true },
  placeAtteint: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Trajets = mongoose.model("Trajets", trajetSchema);

export default Trajets;
