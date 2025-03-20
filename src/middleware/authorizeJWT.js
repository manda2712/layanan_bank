const jwt = require("jsonwebtoken");

function authorizeJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader); // Debugging

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token tidak diberikan!" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Tambahkan ini untuk melihat isi token

        if (!decoded.id) {
            return res.status(401).json({ message: "User ID tidak ditemukan dalam token!" });
        }

        req.userId = decoded.id; // Simpan ID user dari token
        next();
    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(403).json({ message: "Token tidak valid!" });
    }
}

module.exports = authorizeJWT;
