const express = require("express");
const router = express.Router();
const traccarController = require("./traccarController");
const motorBikeController = require("./motorBike.controller");

// Rutas
router.use("/traccar", traccarController);
router.use("/motor-bikes", motorBikeController);
router.use("/balance/accounts", require("./account.controller"));
router.use("/balance/payments", require("./transaction.controller"));

module.exports = router;
