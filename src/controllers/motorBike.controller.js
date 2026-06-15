const express = require("express");
const router = express.Router();
const motorBikeService = require("../services/motorBike.service");

const { authenticateToken } = require("../middlewares/auth.middleware");

router.use(authenticateToken);
router.get("/", async (req, res) => {
  try {
    const result = await motorBikeService.getMotorBikes();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/reports/debts", async (req, res) => {
  try {
    const result = await motorBikeService.getMotorBikesDebts();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await motorBikeService.getMotorBikeById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await motorBikeService.createMotorBike(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = await motorBikeService.updateMotorBike(
      req.params.id,
      req.body,
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
