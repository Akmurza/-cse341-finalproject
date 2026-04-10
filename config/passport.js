const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/userModel");

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id); // store user ID in session
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  process.env.GITHUB_CALLBACK_URL
) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ oauthId: profile.id });

          if (!user) {
            user = await User.create({
              oauthId: profile.id,
              name: profile.username,
              email: profile.emails?.[0]?.value || null,
              role: "user"
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

module.exports = passport;