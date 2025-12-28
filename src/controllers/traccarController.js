const express = require('express');
const router = express.Router();
const traccarService = require('../services/traccarService');

/**
 * GET /api/traccar/get-positions/:trackingToken
 * Obtiene las posiciones de un dispositivo GPS
 */
router.get('/get-positions/:motorBikeId', async (req, res) => {
    try {
        const result = await traccarService.getPositions(req.params.motorBikeId);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

module.exports = router;

