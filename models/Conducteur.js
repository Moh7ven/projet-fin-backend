import mongoose from "mongoose";

const conducteurSchema = mongoose.Schema({
  idConducteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
  },
  immatriculation: { type: String, required: true },
  permis: { type: String, required: true },
  vehicule: { type: String, required: true },
  colorVehicule: { type: String, required: true },
  nombrePlace: { type: Number, required: true },
});

const Conducteurs = mongoose.model("Conducteurs", conducteurSchema);

export default Conducteurs;
