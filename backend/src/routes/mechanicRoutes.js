const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const { searchMechanics } = require("../controllers/mechanicController");

router.get("/search", auth, searchMechanics);

module.exports = router;