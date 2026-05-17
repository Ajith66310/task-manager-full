require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sendEmail = require('./utils/email');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.post('/api/notifications/send-email', async (req, res) => {
    try {
        const { email, subject, message, html } = req.body;
        await sendEmail({ email, subject, message, html });
        res.status(200).json({ success: true, message: 'Email queued for sending' });
    } catch (error) {
        console.error('Error in notification service:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

app.get('/health', (req, res) => res.send('Notification Service is running'));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
});
