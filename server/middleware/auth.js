const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ 
    message:'No token' 
  });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if(!user) return res.status(401).json({ 
      message:'User not found' 
    });
    req.user = user;
    next();
  } catch(err) { return res.status(401).json({ 
    message:'Invalid token' 
  }); }
}

function authorize(...roles) {
  return (req,res,next) => {
    if(!roles.includes(req.user.role)) return res.status(403).json({ 
      message:'Forbidden' 
    });
    next();
  };
}

module.exports = { authenticate, authorize };
