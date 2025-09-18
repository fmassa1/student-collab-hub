const jwt = require('jsonwebtoken');

function authenticator(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        console.log("No token provided")
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        console.log("Malformed token")

        return res.status(401).json({ error: "Malformed token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  
        next(); 
    } catch (err) {
        console.log("Invalid or expired token")

        return res.status(403).json({ error: "Invalid or expired token" });

    }
}

module.exports = authenticator;