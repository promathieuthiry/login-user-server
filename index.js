require('dotenv').config();
const express = require("express");
const cors = require('cors');
const morgan = require('morgan')
const cookieParser = require("cookie-parser")
const cookieSession = require('cookie-session')
const fileUpload = require('express-fileupload');


// Routes
const userRoutes = require("./app/routes/user.routes")

const app = express();

// call dotenv and morgan package only in development mode
if (app.get('env') == 'development') {
  app.use(morgan('tiny'))
}

require('./app/utilities/prod')(app)
// middleware for parsing json objects
app.use(cors({
  origin: ["https://login-user-exp.netlify.app"],
  // origin: ["http://localhost:3000"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
// app.use(express.static('public')) // serve static content
app.use(express.static(__dirname));
app.use(fileUpload());


app.use(cookieParser())

app.use(cookieSession({
  name: 'session',
  keys: 'login-user',
  resave: false,
  saveUninitialized: false,
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


// Route
app.use(userRoutes)
// require("./app/routes/customer.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
