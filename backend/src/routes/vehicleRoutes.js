const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  createVehicle,
  getMyVehicles,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

router.post("/", auth, createVehicle);
router.get("/my", auth, getMyVehicles);
router.put("/:id", auth, updateVehicle);
router.delete("/:id", auth, deleteVehicle);

module.exports = router;