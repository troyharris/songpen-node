const express = require("express");
const AuthenticationController = require("../controllers/authentication");
const passport = require("passport");
const router = express.Router();

// const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });

/* Login */
router.post("/", requireLogin, AuthenticationController.login);

module.exports = router;
