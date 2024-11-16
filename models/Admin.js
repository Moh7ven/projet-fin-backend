import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
clientSchema.plugin(uniqueValidator);

const Admin = mongoose.model("Admin", clientSchema);

export default Admin;
