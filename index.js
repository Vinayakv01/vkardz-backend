const express = require("express");
require('dotenv').config();
const cors = require('cors');
const db = require('./services/db');
const cookieParser = require('cookie-parser');
const path = require('path'); // Import the path module



const app = express();
const port = process.env.PORT || 3000;


app.use('/uploads', cors(), express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://192.168.1.14:5173', 'http://localhost:5173', 'http://100.107.70.7:5173', 'http://192.168.1.37:5173'],
  credentials: true,
}));



// Add the cookie-parser middleware
app.use(cookieParser());



// Routes
const publicprofile = require('./routes/publicprofile');
const visitcount = require('./routes/visitcount');
const authRoutes = require('./routes/auth'); 
const adminAuthRouter = require('./routes/adminAuth');
const authUser = require('./routes/authUser');// Add this line
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const logoutRoute = require('./routes/logout');
const profileRoute = require('./routes/Profile');
const updateRoute = require('./routes/register');
const adminLogoutRoute = require('./routes/adminLogout');
const getUserRoute = require('./routes/getUser');
const updateUserRoute = require('./routes/updateUser');
const updatePasswordRouter = require('./routes/updatePassword'); // Import the router
const publicgetimageRoute = require('./routes/publicgetimage');


app.use(publicprofile); //PublicTemplateRoute
app.use('/public/user', publicgetimageRoute); //unauthenticated user image
app.use('/api', authRoutes); // Add this line //middleware
app.use('/api/admin', adminAuthRouter); //adminlogin
app.use('/api/admin/logout',adminLogoutRoute); //adminlogout
app.use('/api/login', loginRoutes); //userlogin
app.use('/api/register', registerRoutes); //userregister
app.use('/api/logout', logoutRoute); //userlogout
app.use('/api/profile', authUser, profileRoute); //array of profile
app.use('/api/profile/:ProfileID',authUser,profileRoute);  //authenticated user particular profile
app.use('api/update-default/:profileID',authUser,profileRoute);
app.use('/api/userimage',authUser,registerRoutes); //authenticated userimage template
app.use('/api/update',authUser, updateRoute); //upload image in UserProfile.
app.use('/api/updateuser', authUser, updateUserRoute);
app.use('/api/getuser', authUser, getUserRoute); // Add the new route
app.use('/api', authUser, updatePasswordRouter); // Use the router for the "/api" route
app.use('/api/visitcount/',visitcount);  //summation of visit count



// Default route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at 'http://192.168.1.14:${port}`);
});