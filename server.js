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

//Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Only start the server if NOT in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;