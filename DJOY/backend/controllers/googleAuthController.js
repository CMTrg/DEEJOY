import jwt from 'jsonwebtoken';

export const googleCallback = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.redirect(`http://localhost:5173?token=${token}`);
};
