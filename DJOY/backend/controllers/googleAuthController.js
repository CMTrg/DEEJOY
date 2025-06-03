import jwt from 'jsonwebtoken';

export const googleCallback = async (req, res) => {
  const user = req.user; 
  const token = jwt.sign(
    { userId: user._id, username: user.username, email: user.email,role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.send(`
    <html>
      <body>
        <script>
          window.opener.postMessage({ token: "${token}" }, "http://localhost:5173");
          window.close();
        </script>
      </body>
    </html>
  `);
};
