const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { checkWalletExists } = require('../middleware/walletMiddleware');

// Get wallet info
router.get('/wallet/:walletAddress', checkWalletExists, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Claim free tokens
router.post('/claim', checkWalletExists, async (req, res) => {
    try {
        const user = req.user;
        
        if (!user.newUser) {
            return res.status(400).json({ message: 'Tokens already claimed' });
        }

        user.balance += 10;
        user.newUser = false;
        await user.save();

        res.json({ 
            message: 'Tokens claimed successfully', 
            balance: user.balance 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deposit tokens
router.post('/deposit', checkWalletExists, async (req, res) => {
    try {
        const { amount } = req.body;
        const user = req.user;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        user.balance += Number(amount);
        await user.save();

        res.json({ 
            message: 'Deposit successful', 
            balance: user.balance 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Withdraw tokens
router.post('/withdraw', checkWalletExists, async (req, res) => {
    try {
        const { amount } = req.body;
        const user = req.user;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        user.balance -= Number(amount);
        await user.save();

        res.json({ 
            message: 'Withdrawal successful', 
            balance: user.balance 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;