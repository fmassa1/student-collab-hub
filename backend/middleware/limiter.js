const rateLimit = require("express-rate-limit");

const requestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100000, 
    standardHeaders: true, 
    legacyHeaders: false,  
});

module.exports = requestLimiter;