const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY; // Asegúrate de que la clave esté en tu archivo .env

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    // console.log('Token recibido:', token); // Para verificar si el token llega

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // console.log('Token decodificado:', decoded); // Para verificar contenido del token
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};



module.exports = verifyToken;
