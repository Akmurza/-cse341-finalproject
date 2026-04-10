const express = require('express');
const router = express.Router();
const passport = require("passport");
const {authController} = require("../controllers/authController")

const ensureGithubStrategy = (req, res, next) => {
  if (!passport._strategy("github")) {
    return res.status(503).json({
      success: false,
      message: "GitHub OAuth is not configured on this server"
    });
  }

  next();
};

// OAuth routes
// router.get('/login', (req, res) => {
//   res.send('OAuth login endpoint is working');
// });


// Redirect to GitHub OAuth
router.get("/login",
  // #swagger.ignore = true
  ensureGithubStrategy,
  passport.authenticate("github", { scope: ["user:email"], session: false })
);

//  Callback GitHub
router.get(
  "/github/callback",
  ensureGithubStrategy,
  passport.authenticate("github", {
    failureRedirect: "/",
    session: false
  }),
    authController  
)

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;