import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connexion MongoDB reussie ! "))
    .catch(() => console.log("Connexion a MongoDB echouée !"));
};

export default connectDB;
