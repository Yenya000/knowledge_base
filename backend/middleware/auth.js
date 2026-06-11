const jwt = require('jsonwebtoken');

const JWT_SECRET = 'oblivion_secret_key_2026';


function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Отсутствует токен авторизации' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Неверный или просроченный токен' });
    }
}


function roleMiddleware(requiredRole) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ error: 'Недостаточно прав' });
        }
        next();
    };
}

module.exports = { authMiddleware, roleMiddleware };