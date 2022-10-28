const User = require("../models/userModel.js");
const post = require("../models/postModel");
const amigosconfirm = require("../models/friendModel");
const solicitud = require("../models/notificationModel");
const commentario = require("../models/commentModel")
const friends = require("../models/friendModel")
const {Op} = require("sequelize");

exports.GetFriends = (req, res, next) => {
    res.render("friends/searchFriends", {
        pageTitle: "friends",
      });
}

exports.ConfirmFriends = (req, res, next) => {
    const userId = res.locals.Usuario.id;
    const receptId = req.body.userIdRecept2;
    const vaina = req.body.idVaina;

    
        amigosconfirm.create({
            userId: userId,
            friendReceptId: receptId,
            isConfirmed: true,
         }).then((result) => {
            solicitud.update({isReceived: true}, {where: {id: vaina}}).then((result) => {
                res.redirect("/nigga");
            })     
        })
}

exports.GetNotificaciones = (req, res, next) => {
    const id = res.locals.Usuario.id
    solicitud.findAll({include: [{ model: User},], where: {[Op.and]: [{receptId: id}, {isReceived: false}]} }).then((result) => {
        const usuario = result.map((result) => result.dataValues);
        const notification = usuario.length;

       // console.log(usuario)
    res.render("notifications/notification", {
        pageTitle: "Notificaciones",
        usuario: usuario,
        hasNotification: notification > 0,
        notifications: notification,
      });
    });   
}

exports.Friends = (req, res, next) => { 
    const idni = parseInt(res.locals.Usuario.id)

    friends.findAll({ where: {[Op.or]: [ { userId: idni }, { friendReceptId: idni } ]} }).then((result0) => {

        const amigos = result0.map((result0) => result0.dataValues.friendReceptId);
        const amigos2 = result0.map((result0) => result0.dataValues.userId);
        const amigos3 = amigos.concat(amigos2);
        const nigga = amigos3.filter((i) => i !== idni);

    post.findAll({include: [{ model: User}, { model: commentario} ], where: {[Op.and]: [{userId: nigga}]}}).then((result) => {
        
    const friendos = result.map((result) => result.dataValues);

    friends.findAll({include: [{ model: User}], where: {[Op.or]: [ { userId: nigga }, { friendReceptId: nigga } ]} }).then((waos) => {

        const amih = waos.map((waos) => waos.dataValues);

    console.log("amigos de haitianesos", amih)
    res.render("friends/friend", {
        pageTitle: "friends",
        friends: friendos.reverse(),
        amiko: amih,
      });
   }); 
}); 

}); 

}

exports.PostGetFriends = (req, res, next) => {
    const username = req.body.search;
    User.findOne({where: {name: username} }).then((result) => {
        if (result != null) {
            var resulta = result.dataValues;
        }
        else{
            req.flash("errors", "no existe este usuario");
            return res.redirect("friends/searchFriends"); 
        }
    const results = resulta != null 
    res.render("friends/searchFriends", {
        pageTitle: "friends",
        users: resulta,
        hasUsers: results,
      });

    });   
}

exports.PostSolicitud = (req, res, next) => {
    const userId = res.locals.Usuario.id;
    const receptId = req.body.userIdRecept;
    
    solicitud.findAll({where: {[Op.and]: [{userId: userId}, {receptId: receptId}]}}).then((result) => {
        const mynigger = result.map((result) => result.dataValues);
        if (mynigger.length == 0) {
     solicitud.create({
        userId: userId,
        receptId: receptId,
        isReceived: false,
     }).then((result) => {
        res.redirect("/nigga");
    })
    }else{
        res.redirect("/nigga");
    }
})
   
}

exports.EliminarSoli = (req, res, next) => {
    const soliId = req.body.idDato;

    solicitud.destroy({where: {id: soliId}})
    .then((result) => {
        return res.redirect("/nigga");
      })
      .catch((err) => {
        console.log(err);
      });

}

exports.EliminarAmigo = (req, res, next) => {
    const amigoId = req.body.idAmigo;

    amigosconfirm.destroy({where: {id: amigoId}})
    .then((result) => {
        return res.redirect("/nigga");
      })
      .catch((err) => {
        console.log(err);
      });

}