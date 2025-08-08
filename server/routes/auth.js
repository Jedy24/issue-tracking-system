const express = require('express');
const bcrypt = require('bcryptjs');
const { signAccess, signRefresh } = require('../utils/jwt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

/** Register */
router.post('/register', async (req,res) => {
  const { name, email, password } = req.body;
  if(!email || !password) return res.status(400).json({ 
    message:'Missing fields' 
  });
  try{
    const exists = await User.findOne({ 
      email 
    });
    if(exists) 
      return res.status(400).json({ 
        message:'Email taken' 
    });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, email, password: hashed 
    });
    const access = signAccess(user);
    const refresh = signRefresh(user);
    user.refreshTokens.push(refresh);
    await user.save();
    res.json({ 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      }, access, refresh });
  }catch(err){ 
    res.status(500).json({ 
      message: err.message 
    }); 
  }
});

/** Login */
router.post('/login', async (req,res) => {
  const { email, password } = req.body;
  if(!email || !password) 
    return res.status(400).json({ 
      message:'Missing fields' 
    });
  try{
    const user = await User.findOne({ 
      email 
    });
    if(!user) 
      return res.status(400).json({ 
        message:'Invalid credentials' 
      });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) 
      return res.status(400).json({ 
        message:'Invalid credentials' 
      });
    const access = signAccess(user);
    const refresh = signRefresh(user);
    user.refreshTokens.push(refresh);
    await user.save();
    res.json({ 
      access, 
      refresh, 
      user: { id:user._id, email:user.email, name:user.name, role:user.role } 
    });
  } catch(err){ 
    res.status(500).json({ message: err.message }); 
  }
});

/** Refresh */
router.post('/refresh', async (req,res) => {
  const { refresh } = req.body;
  if(!refresh) 
    return res.status(400).json({ 
      message:'No refresh token' 
    });
  try {
    const payload = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if(!user || !user.refreshTokens.includes(refresh)) 
      return res.status(401).json({ 
        message:'Invalid refresh' 
      });
    const newAccess = signAccess(user);
    const newRefresh = signRefresh(user);
    // replace refresh token (rotate)
    user.refreshTokens = user.refreshTokens.filter(t => t !== refresh);
    user.refreshTokens.push(newRefresh);
    await user.save();
    res.json({ 
      access: newAccess, 
      refresh: newRefresh 
    });
  } catch(err) { 
    res.status(401).json({ message:'Invalid token' }); 
  }
});

router.post('/logout', async (req, res) => {
  const { refresh } = req.body;
  if (!refresh) {
    return res.status(400).json({ message: 'No refresh token provided' });
  }
  try {
    const payload = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.refreshTokens = user.refreshTokens.filter(t => t !== refresh);
    await user.save();

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});


module.exports = router;
