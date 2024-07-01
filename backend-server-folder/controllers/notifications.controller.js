// Example middleware and route setup
const express = require('express');
const router = express.Router();
const validateSession = require('../middleware/validate.session');
const Notification = require('../models/notifications.model');

router.get('/messages', validateSession, async (req, res) => {
    try {
        const notifications = await Notification.find({ actionBy: req.userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('message');
        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

module.exports = router;
