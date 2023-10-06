// const jwt = require('jsonwebtoken');

// const authUser = (req, res, next) => {
//   const jwtToken = req.cookies.jwtToken;

//   if (!jwtToken) {
//     // Handle unauthenticated requests
//     return res.status(401).json({ error: 'Authentication required' });
//   }

//   try {
//     const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
//     req.userID = decodedToken.userID;

//     // Log the userID for debugging purposes
//     console.log('UserID:', req.userID);

//     next();
//   } catch (err) {
//     console.error('Error verifying JWT token:', err);
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// module.exports = authUser;


// const jwt = require('jsonwebtoken');

// const authUser = (req, res, next) => {
//   const jwtToken = req.cookies.jwtToken;
//   const adminJwtToken = req.cookies.adminJwtToken; // Add this line for admin token

//   if (!jwtToken && !adminJwtToken) {
//     // Handle unauthenticated requests
//     return res.status(401).json({ error: 'Authentication required' });
//   }

//   try {
//     if (jwtToken) {
//       const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
//       req.userType = 'user';
//       req.userID = decodedToken.userID;

//       // Log the user type and userID for debugging purposes
//       console.log('User Type:', req.userType);
//       console.log('UserID:', req.userID);

//       next();
//     } else if (adminJwtToken) {
//       const decodedAdminToken = jwt.verify(adminJwtToken, process.env.JWT_SECRET_KEY_ADMIN);
//       req.userType = 'admin';
//       req.adminID = decodedAdminToken.userID; // Assuming admin ID is stored in the token

//       // Log the user type and admin ID for debugging purposes
//       console.log('User Type:', req.userType);
//       console.log('Admin ID:', req.adminID);

//       next();
//     }
//   } catch (err) {
//     console.error('Error verifying JWT token:', err);
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// module.exports = authUser ;


const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  const jwtToken = req.cookies.jwtToken;
  const adminJwtToken = req.cookies.adminJwtToken;
  const companyAdminJwtToken = req.cookies.companyAdminJwtToken; // Add this line for company admin token

  if (!jwtToken && !adminJwtToken && !companyAdminJwtToken) {
    // Handle unauthenticated requests
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    if (jwtToken) {
      const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
      req.userType = 'user';
      req.userID = decodedToken.userID;

      // Log the user type and userID for debugging purposes
      console.log('User Type:', req.userType);
      console.log('UserID:', req.userID);

      next();
    } else if (adminJwtToken) {
      const decodedAdminToken = jwt.verify(adminJwtToken, process.env.JWT_SECRET_KEY_ADMIN);
      req.userType = 'admin';
      req.adminID = decodedAdminToken.userID;

      // Log the user type and admin ID for debugging purposes
      console.log('User Type:', req.userType);
      console.log('Admin ID:', req.adminID);

      next();
    } else if (companyAdminJwtToken) {
      const decodedCompanyAdminToken = jwt.verify(companyAdminJwtToken, process.env.JWT_SECRET_KEY_COMPANYADMIN);
      req.userType = 'companyadmin';
      req.companyAdminID = decodedCompanyAdminToken.companyAdminID;

      // Log the user type and company admin ID for debugging purposes
      console.log('User Type:', req.userType);
      console.log('Company Admin ID:', req.companyAdminID);

      next();
    }
  } catch (err) {
    console.error('Error verifying JWT token:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authUser;