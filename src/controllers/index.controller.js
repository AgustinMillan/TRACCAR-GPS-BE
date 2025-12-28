const express = require('express');
const router = express.Router();
const traccarController = require('./traccarController');
const motorBikeController = require('./motorBike.controller');

// Rutas
router.use('/traccar', traccarController);
router.use('/motor-bikes', motorBikeController);

module.exports = router;