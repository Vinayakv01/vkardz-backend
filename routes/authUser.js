const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  const jwtToken = req.cookies.jwtToken;

  if (!jwtToken) {
    // Handle unauthenticated requests
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    req.userID = decodedToken.userID;

    // Log the userID for debugging purposes
    console.log('UserID:', req.userID);

    next();
  } catch (err) {
    console.error('Error verifying JWT token:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authUser;
