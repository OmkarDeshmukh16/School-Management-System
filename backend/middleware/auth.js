const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SECRET_KEY || 'mysecretkey';
const JWT_EXPIRY = '24h';

/**
 * Generate a JWT token for authenticated users
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

/**
 * Middleware: Verify JWT token from Authorization header
 * Attaches decoded user data to req.user
 */
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

/**
 * Middleware factory: Restrict access to specific roles
 * Usage: requireRole('SuperAdmin') or requireRole('SuperAdmin', 'Admin')
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { generateToken, verifyToken, requireRole };
