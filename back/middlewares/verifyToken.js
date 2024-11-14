const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY; // Asegúrate de que la clave esté en tu archivo .env

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    // console.log('Token recibido:', token); // Para depuración
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};


module.exports = verifyToken;
