const express = require('express');
const router = express.Router();
const traccarService = require('../services/traccarService');

/**
 * GET /api/traccar/get-positions/:trackingToken
 * Obtiene las posiciones de un dispositivo GPS
 */
router.get('/get-positions/:motorBikeId', async (req, res) => {
    try {
        const idParam = req.params.motorBikeId;
        
        // Si contiene comas, tratamos como lista de IDs para filtrar/consultar en lote
        if (idParam.includes(',')) {
            const ids = idParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
            const resultsPromises = ids.map(async (id) => {
                try {
                    const pos = await traccarService.getPositions(id);
                    return { id, ...pos.data, success: true };
                } catch (err) {
                    return { id, success: false, error: err.message };
                }
            });
            const results = await Promise.all(resultsPromises);
            return res.json({
                success: true,
                data: results
            });
        }

        const result = await traccarService.getPositions(idParam);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

module.exports = router;

