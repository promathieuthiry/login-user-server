require('dotenv').config();
const express = require("express");
const cors = require('cors');
const morgan = require('morgan')
const helmet = require("helmet");
const userRoutes = require("./app/routes/user.routes")

const app = express();

// call dotenv and morgan package only in development mode
if (app.get('env') == 'development') {
  app.use(morgan('tiny'))
}

// middleware for parsing json objects
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(express.static('public')) // serve static content
app.use(helmet());


// Route
app.use(userRoutes)
// require("./app/routes/customer.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
