const express = require('express');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', require('./Routes/tokenRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const webAppUrl = 'https://win-chain.vercel.app/';
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome!', {
      reply_markup: {
        keyboard: [[{ text: 'Open App', web_app: { url: webAppUrl } }]],
      },
    });
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
