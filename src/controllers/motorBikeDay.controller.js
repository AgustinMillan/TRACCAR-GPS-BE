const express = require("express");
const router = express.Router();
const MotorBikeDayService = require("../services/motorBikeDay.service");

// Crear un día
router.post("/", async (req, res) => {
  try {
    const result = await MotorBikeDayService.createDay(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener días por moto y mes (Ejemplo: /1?year=2026&month=2)
router.get("/:motorBikeId", async (req, res) => {
  try {
    const motorBikeId = req.params.motorBikeId;
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    if (!year || !month) {
      return res.status(400).json({ success: false, error: "Las query parameters 'year' y 'month' son obligatorias" });
    }

    const result = await MotorBikeDayService.getDaysByMotorBikeAndMonth(motorBikeId, year, month);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Actualizar un día
router.put("/:id", async (req, res) => {
  try {
    const result = await MotorBikeDayService.updateDay(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
