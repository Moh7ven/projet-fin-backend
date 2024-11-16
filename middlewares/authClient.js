import jwt from "jsonwebtoken";

// Middleware to check if user is authenticated
export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const clientId = decodedToken.clientId;

    req.auth = {
      clientId: clientId,
    };

    if (!req.auth.clientId) {
      res.status(401).json({
        error: "Invalid nanien ID",
        message: "Vous n'êtes pas autorisé",
        status: false,
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: error,
      message:
        "Une erreur est survenue lors de la vérification du token. Veuillez vous reconnecter.",
      status: false,
    });
  }
};
