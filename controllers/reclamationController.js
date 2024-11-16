import Reclamations from "../models/Reclamations.js";

export const createReclamation = async (req, res) => {
  try {
    const { clientId } = req.auth;
    const { description, texte } = req.body;

    if (!description || !texte) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    const newReclamation = new Reclamations({
      idClient: clientId,
      description,
      texte,
    });

    const savedReclamation = await newReclamation.save();
    res.status(201).json({
      data: savedReclamation,
      status: true,
      message: "Reclamation envoyer",
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamations.find().populate("idClient");
    res.status(200).json({
      data: reclamations,
      status: true,
      message: "Reclamations recupérées",
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};
