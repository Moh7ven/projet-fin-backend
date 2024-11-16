import Localites from "../models/Localite.js";

export const addLocalite = async (req, res) => {
  const newLocalite = new Localites(req.body);
  try {
    if (!newLocalite.ville) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }
    const existingLocalite = await Localites.findOne({
      ville: newLocalite.ville,
    });
    if (existingLocalite) {
      return res
        .status(200)
        .json({ message: "Localite existe déja", status: false });
    }

    const savedLocalite = await newLocalite.save();
    res
      .status(200)
      .json({ data: savedLocalite, status: true, message: "Localite ajoute" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllLocalites = async (req, res) => {
  try {
    const localites = await Localites.find();
    res
      .status(200)
      .json({ data: localites, status: true, message: "localites recupérées" });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const updateLocalite = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Veuillez choisir la localite à modifier !",
        status: false,
      });
    }

    const { ville } = req.body;

    if (!ville) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }
    const updatedLocalite = await Localites.findByIdAndUpdate(
      id,
      { ville },
      { new: true }
    );
    res.status(200).json({
      data: updatedLocalite,
      status: true,
      message: "Localite modifié",
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const deleteLocalite = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Veuillez choisir la localite à supprimer !",
        status: false,
      });
    }
    const deletedLocalite = await Localites.findByIdAndDelete(id);
    res.status(200).json({
      data: deletedLocalite,
      status: true,
      message: "Localite supprime",
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};
