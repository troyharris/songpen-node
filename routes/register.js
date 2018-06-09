const express = require("express");
const AuthenticationController = require("../controllers/authentication");
const passportService = require("../auth/passport");
const passport = require("passport");
const router = express.Router();

const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });

/* Register */
router.post("/", AuthenticationController.register);

module.exports = router;
