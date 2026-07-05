const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "Access denied: Missing authentication token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT token verification failure:", err);
    return res.status(403).json({ success: false, error: "Access denied: Invalid or expired authentication token." });
  }
}

module.exports = { verifyToken };
