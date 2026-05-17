const express = require('express');
const taskRoutes = require('./taskRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/tasks', taskRoutes);
router.use('/admin/tasks', adminRoutes); // matches gateway proxy

module.exports = router;
