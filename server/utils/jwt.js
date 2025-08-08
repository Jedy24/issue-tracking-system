const jwt = require('jsonwebtoken');

function signAccess(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '15m' });
}
function signRefresh(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' });
}
function verifyAccess(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}
module.exports = { signAccess, signRefresh, verifyAccess };
