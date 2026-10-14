const SESSION_COOKIE = "accufinance_session";

const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
};

module.exports = {
    SESSION_COOKIE,
    sessionCookieOptions
};
