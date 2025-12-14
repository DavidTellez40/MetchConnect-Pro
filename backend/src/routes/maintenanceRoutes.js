const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const { createMaintenance, listMaintenance } = require('../controllers/maintenanceController');

router.post('/', auth, role('mecanico'), createMaintenance);
router.get('/', auth, role('admin'), listMaintenance);

module.exports = router;