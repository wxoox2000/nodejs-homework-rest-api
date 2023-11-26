const express = require('express');

const router = express.Router();
const authController = require("../../controllers/authController");
const middlewares = require("../../middlewares/index");
const validateBody = require("../../helpers/validateBody");
const schemas = require("../../schemas/schemas");

router.post("/signup", validateBody(schemas.userSignupSchema), authController.signup);
router.post("/signin", validateBody(schemas.userSigninSchema), authController.signin);
router.get("/current", middlewares.authenticate, authController.getCurrent);
router.post("/signout", middlewares.authenticate, authController.signout);
module.exports = router
