const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {Op} = require("sequelize");

const transporter = nodemailer.createTransport({
  service: "Outlook365",
  auth: {
    user: "SocialApp007@outlook.com",
    pass: "jxgeWNHaA-BK4R9",
  },
});

exports.GetLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    loginCSS: true,
    loginActive: true,
  });
};

exports.PostLogin = (req, res, next) => {
  const user = req.body.user;
  const password = req.body.password;

  User.findOne({ where: { user: user } })
    .then((user) => {
      if (!user) {
        req.flash("errors", "user is invalid ");
        return res.redirect("/");
      }
      if(user.state == "Inactive"){
        req.flash("errors", "user state is inactive ");
        return res.redirect("/");
      }
   
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
             req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/nigga");
            });
          }
          req.flash("errors", "password is invalid");
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          req.flash(
            "errors",
            "An error has occurred contact the administrator."
          );
          res.redirect("/");
        });
    })
    .catch((err) => {
      console.log(err);
      req.flash("errors", "An error has occurred contact the administrator.");
      res.redirect("/");
    });
};

exports.Logout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.GetSignup = (req, res, next) => {
  res.render("auth/register", {
    pageTitle: "Signup",
    signupActive: true,
  });
};

exports.PostSignup = (req, res, next) => {
  const name = req.body.name;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  const imageUser = req.file;
  const email = req.body.email;
  const use = req.body.user;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password != confirmPassword) {
    req.flash("errors", "Password and confirm password no equals");
    return res.redirect("/register");
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/register");
    }

  const token = buffer.toString("hex");

  User.findOne({ where: { user: use, email: email } })
    .then((usuario) => {
      if (usuario) {
        req.flash(
          "errors",
          "email or user exits already, please pick a different one "
        );
        return res.redirect("/register");
      }

      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          User.create({ name: name, lastname: lastname, phone: phone, imagePath: "/" + imageUser.path, email: email, user: use, password: hashedPassword })
            .then((use) => {

              use.activateToken = token;
              use.save();

              transporter.sendMail({
                from: "SocialApp007@outlook.com",
                to: email,
                subject: `Account create`,
                html: `<h3> Usted ha creado su cuenta con exito </h3>
                   
                      <p> Haga click en este <a href="http://localhost:5000/activate/${token}"> link </a> para activar su cuenta </p>
    
                   `,
              });

              res.redirect("/");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  });
};

exports.GetActivate = (req, res, next) => {
  const token = req.params.token;

  User.findOne({ where: { activateToken: token } })
    .then((user) => {
      if (!user) {
        req.flash("errors", "no existe esta cuenta");
        return res.redirect("/login");
      }
      
      user.state = "Active";
      user.save();

      res.render("auth/activate", {
        pageTitle: "Activate",
        loginCSS: true,
        loginActive: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

exports.GetReset = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "Reset",
    loginCSS: true,
    loginActive: true,
  });
};


exports.PostReset = (req, res, next) => {
  const user = req.body.user;
  let email = "";

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ where: { user: user } })
      .then((user) => {
        if (!user) {
          req.flash("errors", "no existe una cuenta con este usuario");
          return null;
        }
        email = user.email;
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        let urlRedirect = "/reset";

        if (result) {
          urlRedirect = "/";

          transporter.sendMail({
            from: "SocialApp007@outlook.com",
            to: email,
            subject: `Password reset`,
            html: `<h3> Usted solicito un cambio de clave </h3>
               
                  <p> Haga click en este <a href="http://localhost:5000/reset/${token}"> link </a> para colocar una nueva contrasenia </p>

               `,
          });
        }

        res.redirect(urlRedirect);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.GetNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({ where: { resetToken: token, resetTokenExpiration: {[Op.gte]: Date.now()} } })
    .then((user) => {
      if (!user) {
        req.flash("errors", "no existe esta cuenta");
        return res.redirect("/reset");
      }

      res.render("auth/newpass", {
        pageTitle: "Reset",
        loginCSS: true,
        loginActive: true,
        passwordToken: token,
        userId: user.id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.PostNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  if (newPassword != confirmPassword) {
    req.flash("errors", "No coincide las contrasenia");
    return res.redirect("/");
  }

  User.findOne({
    where: {
      resetToken: passwordToken,
      id: userId,
      resetTokenExpiration: { [Op.gte]: Date.now() },
    },
  })
    .then((user) => {


      if (!user) {
        req.flash("errors", "no existe esta cuenta");
        return res.redirect("/reset");
      }

      bcrypt
        .hash(newPassword, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = null;
          user.resetTokenExpiration = null;
          return user.save();
        })
        .catch((err) => {
          console.log(err);
        });

      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};