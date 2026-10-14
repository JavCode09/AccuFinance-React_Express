const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const { SESSION_COOKIE } = require("../utils/sessionCookie");

const verifyToken = (req, res, next) => {
    const cookieHeader = req.headers.cookie || "";
    const cookie = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${SESSION_COOKIE}=`));

    if (!cookie) {
        return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    const token = cookie.slice(SESSION_COOKIE.length + 1);

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err || !decoded || typeof decoded !== "object" ||
            !Number.isSafeInteger(Number(decoded.id)) ||
            !Number.isSafeInteger(Number(decoded.rol)) ||
            !["users", "user_access_log"].includes(decoded.source)) {
            return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
