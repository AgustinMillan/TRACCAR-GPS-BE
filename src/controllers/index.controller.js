const express = require("express");
const router = express.Router();
const traccarController = require("./traccarController");
const motorBikeController = require("./motorBike.controller");

// Rutas
router.use("/traccar", traccarController);
router.use("/motor-bikes", motorBikeController);
router.use("/balance/accounts", require("./account.controller"));
router.use("/balance/payments", require("./transaction.controller"));
router.use("/motor-bike-days", require("./motorBikeDay.controller"));
router.use("/reports", require("./report.controller"));
router.use("/categories", require("./categories.controller"));
router.use("/clients", require("./client.controller"));
router.use("/files", require("./file.controller"));

module.exports = router;
