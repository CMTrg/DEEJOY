import PendingUser from '../models/pendingUserModel.js';
import User from '../models/userModel.js';

export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ message: 'Missing verification data.' });
    }

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser || pendingUser.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    const newUser = new User({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.hashedPassword,
      role: pendingUser.role || 'customer',
      profilePicture: null,
      isVerified: true,
      isOnline: false,
      lastSeen: null
    });

    await newUser.save();
    await PendingUser.deleteOne({ _id: pendingUser._id });

    res.status(200).json({ message: 'Verification successful. You can now log in.' });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Server error during verification.' });
  }
};
