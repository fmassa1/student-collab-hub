const { createLogger, format, transports } = require('winston');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname,  '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [
        //new transports.Console({ format: format.simple() }),
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logDir, 'combined.log') })
    ],
});


const requestLogger = morgan((tokens, req, res) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent') || 'unknown';

    return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        response_time: `${tokens['response-time'](req, res)} ms`,
        ip: ip,
        user_agent: userAgent,
    });
}, {
    stream: {
        write: (message) => {
        try {
            const logObj = JSON.parse(message);
            logger.info('HTTP Request', logObj);
        } catch {
            logger.info(message.trim());
        }
        }
    }
});

module.exports = requestLogger;