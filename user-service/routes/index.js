const express = require('express');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

// For API Gateway internal mapping: 
// The gateway maps /api/users to /api/users in user-service, 
// but the original was /api/auth.
// I will just alias /users to /auth so we don't break frontend.
router.use('/users', authRoutes);

module.exports = router;
