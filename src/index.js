const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const connectDB = require("./config/mongodb");
const cors = require("cors");
const session = require("express-session");

// Change
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.model");
const bcrypt = require("bcrypt");

const handlebarsHelper = require("./helpers/handlebarsHelper");

Handlebars.registerHelper("times", function (n, options) {
  let result = "";
  for (let i = 0; i < n; i++) {
    result += options.fn(i);
  }
  return result;
});

Object.entries(handlebarsHelper).forEach(([name, fn]) => {
  Handlebars.registerHelper(name, fn);
});

// Importing files
const routes = require("./routes/handlers");
const { log } = require("console");

const app = express();

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

app.use(cors());

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
// Change
app.use(
  session({ secret: "secret-key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Configure Routes
app.use("/", routes);

// LocalStrategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Tìm người dùng trong cơ sở dữ liệu
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }

      // Xác thực thành công
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Save info to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Get info session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.post(
  "/account/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/account/login",
    failureFlash: false, // Enable if using flash messages
  })
);

const port = process.env.PORT || 3000;

// connect to db
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
