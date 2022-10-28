const User = require("../models/userModel.js");
const post = require("../models/postModel");
const commentario = require("../models/commentModel")

exports.GetPosts = (req, res, next) => {

  const Usuario = res.locals.Usuario;

  
  post.findAll({include: [{ model: User}, {model: commentario}], where: { userId: Usuario.id } }).then((result) => {
    
    const nigger = result.map((result) => result.dataValues);
    const bruh = nigger.reverse();

    console.log("la vaina real e", bruh )
    res.render("home/home", {
      pageTitle: "home",
      Usuario: Usuario,
      Post: bruh,
    });

  })

};



exports.GetEditPost = (req, res, next) => {
  const idPost = req.params.postId;
  post.findOne({where: {id: idPost} }).then((result) => {
    const post = result.dataValues;
  res.render("home/editpost", {
    pageTitle: "Editpost",
    post: post,
  });
});

};

exports.PostEditPost = (req, res, next) => {
  const postId = req.body.postID;
  const texto = req.body.textoedit;
  const img = req.file;
  post.findOne({ where: { id: postId } })
  .then((result) => {

    const posteo = result.dataValues;

      if (!posteo) {
        return res.redirect("/nigga");
      }

      const imagePath = img ? "/" + img.path : posteo.imagePath;

      post
    .update(
      {text: texto, imagePath: imagePath},
      { where: { id: postId } }
    )

    .then((result) => {
      return res.redirect("/nigga");
    })
    .catch((err) => {
      console.log(err);
    });

  })
};

exports.deletePost = (req, res, next) => {
  const idpost = req.body.postID;
  post
    .destroy({ where: { id: idpost } })
    .then((result) => {
      return res.redirect("/nigga");
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.createPost = (req, res, next) => {
var txt = req.body.texto;
var imagen = req.file;
var userId = req.body.usuarioId;

if(imagen == undefined || imagen == null){
   imagen = "";
}

post.create({
  text: txt,
  imagePath: "/" + imagen.path,
  userId: userId,
}).then((result) => {
  res.redirect("/nigga");
})

};


exports.createComment = (req, res, next) => {
  var comentario = req.body.comentario;
  var usuario = req.body.usuarioID;
  var post = req.body.publicacionID;
  var commentImage = req.body.usuarioImage;
  
  commentario.create({
    text: comentario,
    imagePath: commentImage,
    userId: usuario,
    publicacionId: post
  }).then((result) => {
    res.redirect("/nigga");
  })
  
  };