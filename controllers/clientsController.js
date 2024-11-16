import Client from "../models/Clients.js";
import Trajets from "../models/Trajets.js";
import TrajetsReserver from "../models/TrajetsReserver.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Conducteurs from "../models/Conducteur.js";
import verifImmatricule from "../utils/immatricule.js";
import permisVerif from "../utils/permisVerif.js";

export const createClient = async (req, res) => {
  const { nom, prenom, email, tel, password } = req.body;
  try {
    if (!nom || !prenom || !email || !tel || !password) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    // Verifier la taille du mot de passe
    if (password.length < 8 || password.length > 10) {
      return res.status(400).json({
        message: "Le mot de passe doit être entre 8 et 10 caractères",
        status: false,
      });
    }

    // verifier la taille du tel
    if (tel.length !== 10) {
      return res.status(400).json({
        message: "Le numéro de tel doit être de 10 caractères",
        status: false,
      });
    }
    // Verifier si l'utilisateur existe
    const user = await Client.findOne({ $or: [{ email }, { tel }] });
    if (user) {
      return res.status(400).json({
        message: "Cet utilisateur existe deja !",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await Client.create({
      nom,
      prenom,
      email,
      tel,
      password: hashedPassword,
    });
    res.status(201).json({
      data: client,
      status: true,
      message: "Utilisateur creé avec succès  !",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const loginClient = async (req, res) => {
  try {
    const { tel, password } = req.body;

    if (!tel || !password) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    const client = await Client.findOne({ tel });
    if (!client) {
      return res.status(400).json({
        message: "Cet utilisateur n'existe pas !",
        status: false,
      });
    }

    const { nom, prenom, email } = client;

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Mot de passe incorrect !",
        status: false,
      });
    }

    const token = jwt.sign({ clientId: client._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({
      data: { nom, prenom, email },
      token,
      status: true,
      message: "Connexion reussie !",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getUserConnected = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    if (!clientId) {
      return res
        .status(401)
        .json({ message: "Vous n'etes pas autorisé", status: false });
    }
    const client = await Client.findById(clientId);
    if (!client) {
      return res
        .status(404)
        .json({ message: "Vous n'êtes pas autoriser", status: false });
    }
    res.status(200).json({ data: client, status: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const clientId = req.auth.clientId;

    const client = await Client.findByIdAndUpdate(clientId, req.body, {
      new: true,
    });
    res.status(200).json({
      data: client,
      message: "Utilisateur mis à jour !",
      status: true,
    });
  } catch (error) {
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const addTrajet = async (req, res) => {
  try {
    const { date, heure, lieuDepart, lieuArrivee, distance, cout, note } =
      req.body;
    const clientId = req.auth.clientId;

    if (!date || !heure || !lieuDepart || !lieuArrivee || !cout) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    const verifyConducteur = await Conducteurs.findOne({
      idConducteur: clientId,
    });
    if (!verifyConducteur) {
      return res.status(400).json({
        message:
          "Vous n'etes pas autorisé !, veuillez enregistrer vos informations en tant que conducteur",
        status: false,
      });
    }

    const verifyTrajet = await Trajets.findOne({
      idConducteur: clientId,
      active: true,
      date,
    });
    if (verifyTrajet) {
      return res.status(400).json({
        message: "Vous devez terminer votre trajet en cours !",
        status: false,
      });
    }

    const trajet = await Trajets.create({
      idConducteur: clientId,
      idClient: clientId,
      date,
      heure,
      lieuDepart,
      lieuArrivee,
      distance,
      cout,
      note,
      placeRestantes: verifyConducteur.nombrePlace,
    });
    res.status(201).json({
      data: trajet,
      status: true,
      message: "Trajet ajouter avec succes !",
    });
  } catch (error) {
    res.status(404).json({ message: error.message, status: false });
  }
};

export const getTrajetEnCours = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    const trajetEnCours = await TrajetsReserver.findOne({
      idClient: clientId,
      active: true,
    })
      .populate("idClient")
      .populate("idTrajet");
    res
      .status(200)
      .json({ data: trajetEnCours, message: "Trajet en cours", status: true });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getAllTrajet = async (req, res) => {
  try {
    const allTrajet = await Trajets.find();
    res.status(200).json({ data: allTrajet, status: true });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getOneTrajet = async (req, res) => {
  try {
    const { trajetId } = req.params;
    if (!trajetId) {
      return res.status(400).json({
        message: "Aucune trajet en cours  selectionné !",
        status: false,
      });
    }
    const oneTrajet = await Trajets.find({
      _id: trajetId,
      active: true,
    });
    res.status(200).json({ data: oneTrajet, status: true });
  } catch (error) {}
};

export const getTrajetEnCoursConducteur = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    const trajetEnCours = await Trajets.findOne({
      idConducteur: clientId,
      active: true,
      terminer: false,
    }).populate("idClient");
    res
      .status(200)
      .json({ data: trajetEnCours, message: "Trajet en cours", status: true });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const reserverTrajet = async (req, res) => {
  try {
    const { trajetId } = req.params;
    const { date, heure } = req.body;
    const clientId = req.auth.clientId;

    if (!date || !heure) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    if (!trajetId) {
      return res.status(400).json({
        message: "Aucune trajet selectionné !",
        status: false,
      });
    }

    const existingTrajet = await Trajets.findOne({
      _id: trajetId,
    });
    if (!existingTrajet) {
      return res.status(400).json({
        message: "Ce trajet n'existe pas !",
        status: false,
      });
    }

    const seeTrajetReserve = await TrajetsReserver.findOne({
      idClient: clientId,
      idTrajet: trajetId,
    });
    if (seeTrajetReserve) {
      return res.status(400).json({
        message: "Vous avez déjà reserver ce trajet !",
        status: false,
      });
    }

    const isConducteur = await Conducteurs.findOne({
      idConducteur: clientId,
    });
    if (isConducteur) {
      return res.status(400).json({
        message: "Vous ne pouvez pas reserver votre propre trajet !",
        status: false,
      });
    }

    const verifyNomberPlace = await Trajets.findOne({
      _id: trajetId,
    });

    if (verifyNomberPlace.placeRestantes === 0) {
      return res.status(400).json({
        message: "Il n'y a plus de place disponible !",
        status: false,
      });
    }

    const trajetReserver = await TrajetsReserver.create({
      idTrajet: trajetId,
      idClient: clientId,
      date,
      heure,
    });

    await Trajets.findOneAndUpdate(
      { _id: trajetId },
      { $inc: { placeRestantes: -1 } }
    );

    res.status(201).json({
      data: trajetReserver,
      status: true,
      message: "Trajet reserve avec succes !",
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const annulerTrajetReserver = async (req, res) => {
  try {
    const { trajetId } = req.params;
    const clientId = req.auth.clientId;
    const trajetReserver = await TrajetsReserver.findOne({
      idTrajet: trajetId,
      annuler: false,
    });
    if (!trajetReserver) {
      return res.status(400).json({
        message: "Aucun trajet reserve !",
        status: false,
      });
    }

    const verifyTrajetIsActive = await Trajets.findOne({
      _id: trajetId,
    }).populate("active");

    if (verifyTrajetIsActive.active === false) {
      return res.status(400).json({
        message:
          "Ce trajet n'est plus disponible, le conducteur à l'a surement annulé !",
        status: false,
      });
    }

    const verifyTrajetAnnuler = await TrajetsReserver.findOne({
      idTrajet: trajetId,
      idClient: clientId,
      annuler: true,
    });
    if (verifyTrajetAnnuler) {
      return res.status(400).json({
        message: "Vous avez déjà annuler ce trajet !",
        status: false,
      });
    }

    const verifyTrajetTerminer = await Trajets.findOne({
      _id: trajetId,
    });
    if (verifyTrajetTerminer.terminer === true) {
      return res.status(400).json({
        message: "Ce trajet est terminé !",
        status: false,
      });
    }

    const updateTrajetReserver = await TrajetsReserver.findOneAndUpdate(
      { _id: trajetReserver._id },
      { $set: { annuler: true } },
      { new: true }
    );

    await Trajets.findOneAndUpdate(
      { _id: trajetId },
      { $inc: { placeRestantes: 1 } }
    );
    res.status(200).json({
      data: updateTrajetReserver,
      status: true,
      message: "Trajet annuler avec succes !",
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getAllTrajetsAnnuler = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    const trajetAnnuler = await TrajetsReserver.find({
      idClient: clientId,
      annuler: true,
    }).populate({
      path: "idTrajet",
      populate: {
        path: "idClient",
        model: "Clients",
      },
    });
    if (trajetAnnuler.length === 0) {
      return res.status(400).json({
        data: [],
        message: "Aucun trajet annuler !",
        status: false,
      });
    }
    res.status(200).json({
      data: trajetAnnuler,
      message: "Donnée recupéres ",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getTrajetReserver = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    /* const trajetReserver = await TrajetsReserver.find({
      idClient: clientId,
    }).populate({
      path: "idTrajet",
      select: "active",
    }); */

    const trajetReserver = await TrajetsReserver.find({
      idClient: clientId,
      active: true,
      annuler: false,
    }).populate({
      path: "idTrajet",
      populate: {
        path: "idClient",
        model: "Clients",
      },
    });

    const trajetReserverActive = trajetReserver.map((trajet) =>
      trajet.idTrajet.active === true ? true : false
    );

    const trajetTerminer = trajetReserver.map((trajet) =>
      trajet.idTrajet.terminer === true ? true : false
    );

    if (trajetReserver.length === 0) {
      return res.status(400).json({
        data: [],
        message:
          "Aucun trajet reserve ! , trajet terminer ou annuler par le conducteur",
        status: false,
      });
    }

    if (trajetReserverActive === false) {
      return res.status(400).json({
        message: "Trajet annuler par le conducteur !",
        status: false,
      });
    } else if (trajetTerminer === true) {
      return res.status(400).json({
        message: "Trajet terminé !",
        status: false,
      });
    }

    res.status(200).json({ data: trajetReserver, status: true });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getAllClientReserveMyTrajet = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    const { trajetId } = req.params;

    const trajetReserver = await TrajetsReserver.find({
      idTrajet: trajetId,
    })
      .populate("idTrajet")
      .populate("idClient");

    const filtre = trajetReserver.filter((trajet) =>
      trajet.idTrajet.idConducteur === clientId ? trajet.idClient : []
    );

    if (trajetReserver.length === 0) {
      return res.status(400).json({
        data: [],
        message: "Aucun client pour ce trajet !",
        status: false,
      });
    }

    res.status(200).json({
      data: filtre,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const annulerTrajetAjouter = async (req, res) => {
  try {
    const { trajetId } = req.params;
    const clientId = req.auth.clientId;
    const trajet = await Trajets.findOne({
      _id: trajetId,
      idConducteur: clientId,
    });
    if (!trajet) {
      return res.status(400).json({
        message: "Vous n'avez enregistré  aucun trajet!",
        status: false,
      });
    }

    const updateTrajet = await Trajets.findOneAndUpdate(
      { _id: trajetId },
      { $set: { active: false } }
    );
    res.status(200).json({
      data: updateTrajet,
      status: true,
      message: "Trajet annuler avec succes !",
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const terminerTrajet = async (req, res) => {
  try {
    const { trajetId } = req.params;
    const clientId = req.auth.clientId;
    if (!trajetId) {
      return res.status(400).json({
        message: "Aucune trajet selectionné !",
        status: false,
      });
    }
    const trajet = await Trajets.findOne({
      _id: trajetId,
      idConducteur: clientId,
    });
    if (!trajet) {
      return res.status(400).json({
        message: "Vous n'avez enregistré  aucun trajet!",
        status: false,
      });
    }
    const updateTrajet = await Trajets.findOneAndUpdate(
      { _id: trajetId },
      { $set: { terminer: true, active: false } }
    );
    res.status(200).json({
      data: updateTrajet,
      status: true,
      message: "Trajet terminé avec succes !",
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getAllTrajetsTerminer = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    const trajet = await Trajets.find({
      idConducteur: clientId,
      active: false,
      terminer: true,
    });
    res.status(200).json({ data: trajet, status: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getAllTrajetsTerminerByConduc = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    const trajet = await Trajets.find({
      idConducteur: clientId,
      active: false,
      terminer: true,
    });
    res.status(200).json({ data: trajet, status: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const saveAsConducteur = async (req, res) => {
  try {
    const clientId = req.auth.clientId;

    const client = await Client.findById(clientId);
    const verifConducteur = await Conducteurs.findOne({
      idConducteur: clientId,
    });
    const { immatriculation, colorVehicule, permis, vehicule, nombrePlace } =
      req.body;
    if (
      !immatriculation ||
      !permis ||
      !vehicule ||
      !nombrePlace ||
      !colorVehicule
    ) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    if (verifImmatricule(immatriculation) === false) {
      return res.status(400).json({
        message: "Immatriculation invalide !",
        status: false,
      });
    }

    if (permisVerif(permis) === false) {
      return res.status(400).json({
        message: "Permis invalide !",
        status: false,
      });
    }

    if (verifConducteur) {
      return res.status(400).json({
        message: "Vous avez déjà enregistrer des données de conducteur !",
        status: false,
      });
    }

    if (!client) {
      return res.status(400).json({
        message: "Utilisateur inexistant!",
        status: false,
      });
    }

    const conducteur = {
      idConducteur: clientId,
      immatriculation,
      permis,
      vehicule,
      nombrePlace,
      colorVehicule,
    };

    const newConducteur = await Conducteurs.create(conducteur);
    res.status(201).json({
      data: newConducteur,
      status: true,
      message: "Conducteur ajouter avec succes !",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getConducteurInfos = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    const conducteur = await Conducteurs.findOne({
      idConducteur: clientId,
    }).populate("idConducteur");

    if (!conducteur) {
      return res.status(404).json({
        message: "Vous n'êtes pas enregistré en tant que conducteur !",
        status: false,
      });
    }
    res.status(200).json({ data: conducteur, status: true });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const updateConducteurInfos = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    const conducteur = await Conducteurs.findOne({
      idConducteur: clientId,
    });
    if (!conducteur) {
      return res.status(404).json({
        message: "Vous n'etes pas autorisé !",
        status: false,
      });
    }
    const { immatriculation, permis, vehicule, nombrePlace } = req.body;
    if (!immatriculation || !permis || !vehicule || !nombrePlace) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    if (verifImmatricule(immatriculation) === false) {
      return res.status(400).json({
        message: "Immatriculation invalide !",
        status: false,
      });
    }

    if (permisVerif(permis) === false) {
      return res.status(400).json({
        message: "Permis invalide !",
        status: false,
      });
    }

    const updateConducteur = await Conducteurs.findOneAndUpdate(
      { idConducteur: clientId },
      { immatriculation, permis, vehicule, nombrePlace },
      { new: true }
    );
    res.status(200).json({
      data: updateConducteur,
      status: true,
      message: "Informations de conducteur modifie avec succes !",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const searchTrajet = async (req, res) => {
  try {
    const { lieuDepart, lieuArrivee, cout } = req.body;
    const tabCout = cout.split("-");
    const coutMin = parseInt(tabCout[0]);
    const coutMax = parseInt(tabCout[1]);

    // Recherche en fonction du cout aussi / A faire

    if (!lieuDepart || !lieuArrivee) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    const trajets = await Trajets.find({
      lieuDepart: { $regex: lieuDepart, $options: "i" },
      lieuArrivee: { $regex: lieuArrivee, $options: "i" },
      active: true,
      terminer: false,
    })
      .populate("idClient")
      .populate("idConducteur");

    if (!trajets) {
      return res.status(404).json({
        message: "Aucun trajet trouvé !",
        status: false,
      });
    }

    const trajetsFiltre = trajets.filter((trajet) => {
      return trajet.cout >= coutMin && trajet.cout <= coutMax;
    });

    if (trajetsFiltre.length === 0) {
      return res.status(404).json({
        message: "Aucun trajet correspondant !",
        status: false,
      });
    }

    res
      .status(200)
      .json({ data: trajets, message: "Trajet trouvé !", status: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const historiqueDepenses = async (req, res) => {
  try {
    const clientId = req.auth.clientId;

    //Historique somme depensée
    const historiqueDepClient = await TrajetsReserver.find({
      idClient: clientId,
    }).populate("idTrajet");

    if (!historiqueDepClient) {
      return res.status(404).json({
        message: "Aucun trajet reserve !",
        status: false,
      });
    }

    const recupDepense = historiqueDepClient.map(
      (trajet) => trajet.idTrajet.cout
    );

    const sommeDepense = recupDepense.reduce((a, b) => a + b, 0);

    res.status(200).json({
      data: historiqueDepClient,
      sommeDepense: sommeDepense,
      message: "Historique !",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const historiqueGain = async (req, res) => {
  const clientId = req.auth.clientId;

  //Historique somme gagné
  const historqueGainClient = await TrajetsReserver.find({
    idClient: clientId,
  }).populate("idTrajet");

  if (!historqueGainClient) {
    return res.status(404).json({
      message: "Aucun trajet reserve !",
      status: false,
    });
  }

  let recupGain = [];

  historqueGainClient.map((trajet) => {
    if (trajet.idTrajet.terminer === true) {
      recupGain.push(trajet.idTrajet.cout);
    }
  });

  const sommeGagne = recupGain.reduce((a, b) => a + b, 0);

  console.log(recupGain, sommeGagne);

  res.status(200).json({
    data: historqueGainClient,
    sommeGagne: sommeGagne,
    message: "Historique !",
    status: true,
  });
};
