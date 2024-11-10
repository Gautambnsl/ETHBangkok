const User = require('../models/User');

const checkWalletExists = async (req, res, next) => {
    try {
        const walletAddress = req.body.walletAddress || req.params.walletAddress;
        
        if (!walletAddress) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        let user = await User.findOne({ walletAddress });
        
        if (!user) {
            user = new User({
                walletAddress,
                balance: 0,
                newUser: true
            });
            await user.save();
        }
        
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { checkWalletExists };
