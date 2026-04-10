const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE341 Final Project API',
    description: 'API documentation for the final project'
  },

  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter JWT as: Bearer <token>"
    }
  }
};

if (process.env.SWAGGER_HOST) {
  doc.host = process.env.SWAGGER_HOST;
}

if (process.env.SWAGGER_SCHEMES) {
  doc.schemes = process.env.SWAGGER_SCHEMES.split(',').map((item) => item.trim());
}

const outputFile = './docs/swagger.json';
const endpointsFiles = [
  './routes/index.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc);