const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Or check HTTP-only cookie
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Authentication required. Please log in.',
          code: 'UNAUTHORIZED'
        }
      });
    }

    const secret = process.env.JWT_SECRET || 'taskflow_jwt_dev_secret_key_change_in_production_2026';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'User belonging to this token no longer exists.',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          message: error.name === 'TokenExpiredError' ? 'Token expired. Please log in again.' : 'Invalid token.',
          code: 'INVALID_TOKEN'
        }
      });
    }
    next(error);
  }
};

module.exports = authMiddleware;
