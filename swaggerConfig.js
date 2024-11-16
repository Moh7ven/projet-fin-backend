import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Covoit'Express API",
      version: "1.0.0",
      description: "Documentation de l'API Covoit_express",
    },
  },
  apis: ["./routes/*.js"], // Chemin vers les routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
