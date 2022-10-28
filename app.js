const path = require("path");
const express = require("express");
const expressHbs = require("express-handlebars");
const sequelize = require("./utils/database.js");
const User = require("./models/userModel.js");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const flash = require("connect-flash");
const csrf = require("csurf");
const csrfProtection = csrf();

const app = express();

const compareHelpers = require("./utils/helpers/compare.js");
const usuario = require("./models/userModel");
const post = require("./models/postModel");
const comment = require("./models/commentModel");
const notification = require("./models/notificationModel");
const friends = require("./models/friendModel");
const eventos = require("./models/eventModel");

app.engine(
  "hbs",
  expressHbs.engine({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
      equalValue: compareHelpers.EqualValue,
    },
  })
);

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/images",express.static(path.join(__dirname, "images")));

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}-${file.originalname}`);
    },
  });
  
app.use(multer({ storage: fileStorage }).single("imagePath"));



app.use(
  session({ secret: "anything", resave: true, saveUninitialized: false })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session) {
    return next();
  }
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  const errors = req.flash("errors");  
  res.locals.Usuario = req.session.user;
  res.locals.notification = req.session.notifications;
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.errorMessages = errors;
  res.locals.hasErrorMessages = errors.length > 0;
  res.locals.csrfToken = req.csrfToken();
  next();
});

const authRouter = require("./routes/authRouter");
const errorController = require("./controllers/errorController");
const postRouter = require("./routes/postRouter");
const friendRouter = require("./routes/friendRouter");
const eventrouter = require("./routes/eventRouter");

app.use(eventrouter);
app.use(friendRouter);
app.use(postRouter);
app.use(authRouter);

app.use(errorController.Get404);

 post.belongsTo(usuario, { constraint: true, onDelete: "CASCADE" });
 usuario.hasMany(post);

 notification.belongsTo(usuario, { constraint: true, onDelete: "CASCADE" });
 usuario.hasMany(notification);

 friends.belongsTo(usuario, { as: "friendRecept", constraint: true, onDelete: "CASCADE" });
 usuario.hasMany(friends);

 friends.belongsTo(usuario, { constraint: true, onDelete: "CASCADE" });
 usuario.hasMany(friends);

 eventos.belongsTo(usuario, { as: "friendReceptEvent", constraint: true, onDelete: "CASCADE" });
 usuario.hasMany(eventos);

 eventos.belongsTo(usuario, { constraint: true, onDelete: "CASCADE" });
 usuario.hasMany(eventos);

 notification.belongsTo(usuario, { as: "recept", constraint: true, onDelete: "CASCADE" });
 usuario.hasMany(notification);

 comment.belongsTo(usuario, { constraint: true, onDelete: "CASCADE" });
 usuario.hasMany(comment);

 comment.belongsTo(post, { constraint: true, onDelete: "CASCADE" });
 post.hasMany(comment);

sequelize
  .sync()
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });