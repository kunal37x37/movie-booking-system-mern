const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    const actualToken = token ? token.replace('Bearer ', '') : null;

    if (!actualToken) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || 'secretkey');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const isOwner = (req, res, next) => {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ message: 'Access denied. Owner only.' });
    }
    next();
};

module.exports = { authMiddleware, isOwner };