// routes/protectedRoute.js
const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.get('/', verifyToken, (req, res) => {
    // Si el token es válido, el flujo llega aquí
    res.json({
        message: 'Datos protegidos',
        user: req.user // Puedes acceder a la información del usuario decodificada
    });
});

module.exports = router;
