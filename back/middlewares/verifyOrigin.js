const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

const verifyOrigin = (req, res, next) => {
    if (safeMethods.has(req.method)) {
        return next();
    }

    if (req.get("Origin") !== allowedOrigin) {
        return res.status(403).json({
            success: false,
            message: "Origen no autorizado."
        });
    }

    return next();
};

module.exports = {
    allowedOrigin,
    verifyOrigin
};
