import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ detail: 'Not authorized, no token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'crm_secret_key_default')
    const user = await User.findById(decoded.id).select('-password')
    if (!user || !user.isActive) {
      return res.status(401).json({ detail: 'User not found or deactivated' })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ detail: 'Not authorized, token invalid or expired' })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ detail: `User role '${req.user?.role}' is not authorized to access this route` })
    }
    next()
  }
}
