const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const connectDB = require('./config/db');
const session = require('express-session')
const passport = require("./config/passport")
const GitHubStrategy = require('passport-github2').Strategy

const app = express();
const port = process.env.PORT || 3000;

// Respect reverse-proxy headers (required on Render for correct https detection).
app.set('trust proxy', 1);

// Github Oauth 
app.use(session({
  secret: process.env.SESSION_SECRET || "secretkey",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Main routes
app.get('/', (req, res) => {
  res.send('Our API is running...');
});

app.use('/users', require('./routes/usersRoutes'));
app.use('/products', require('./routes/productsRoutes'));
app.use('/orders', require('./routes/ordersRoutes'));
app.use('/reviews', require('./routes/reviewsRoutes'));
app.use('/auth', require('./routes/authRoutes'));

// Serve Swagger spec with runtime host/scheme so it works on Render and localhost.
app.get('/swagger.json', (req, res) => {
  const forwardedProto = req.get('x-forwarded-proto');
  const headerProto = forwardedProto ? forwardedProto.split(',')[0].trim().toLowerCase() : '';
  const resolvedScheme = headerProto || req.protocol;

  const runtimeSwagger = {
    ...swaggerDocument,
    host: req.get('host'),
    schemes: [resolvedScheme === 'https' ? 'https' : 'http']
  };

  res.json(runtimeSwagger);
});

//Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
  swaggerOptions: {
    url: '/swagger.json'
  }
}));

// Only start the server if NOT in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;