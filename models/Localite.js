import mongoose from "mongoose";

const localiteSchema = mongoose.Schema({
  // codePostal: { type: String, required: true },
  // region: { type: String, required: true },
  ville: { type: String, required: true },
});

const Localites = mongoose.model("Localite", localiteSchema);

export default Localites;
