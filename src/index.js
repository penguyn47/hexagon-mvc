const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const connectDB = require("./config/mongodb");
const cors = require("cors");
const session = require("express-session");

const jwt = require("jsonwebtoken");

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
// Cấu hình session
app.use(
  session({
    secret: "secret-key", // Khóa bí mật để mã hóa session
    resave: false, // Không lưu lại session nếu không có thay đổi
    saveUninitialized: true, // Lưu session ngay cả khi chưa khởi tạo dữ liệu
    cookie: {
      maxAge: 1000 * 60 * 30, // Session tồn tại 30 phút
      secure: false, // Chỉ bật secure khi chạy HTTPS
    },
  })
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
  const token = jwt.sign({ id: user.id }, "your-secret-key", {
    expiresIn: "30m", // 30 min
  });
  done(null, token);
});

// Get info session
passport.deserializeUser((token, done) => {
  try {
    const decoded = jwt.verify(token, "your-secret-key"); // Xác minh token
    User.findById(decoded.id).then((user) => {
      done(null, user); // Trả về thông tin người dùng từ token
    });
  } catch (error) {
    done(error, null);
  }
});

app.post(
  "/account/login",
  passport.authenticate("local", {
    successRedirect: "/", // Chuyển hướng nếu đăng nhập thành công
    failureRedirect: "/account/login", // Chuyển hướng nếu thất bại
    failureFlash: false, // Không sử dụng flash messages
  }),
  (req, res) => {
    // Sau khi đăng nhập thành công, lưu token vào cookie
    res.cookie("token", req.user.token, {
      httpOnly: true, // Cookie không thể truy cập từ JavaScript
      secure: false, // Chỉ bật secure khi chạy HTTPS
      maxAge: 1000 * 60 * 30, // Thời gian hết hạn cookie (30 phút)
    });
    res.redirect("/"); // Redirect về trang chính
  }
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
