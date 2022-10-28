const User = require("../models/userModel.js");
const events = require("../models/eventModel");

 //where: {[Op.or]: [ { userId: idni }, { friendReceptId: idni } ]}

exports.GetEvents = (req, res, next) => {
    const id  = res.locals.Usuario.id;

    events.findAll({where:{ userId: id }}).then((result0) => {
    const eventos = result0.map((result0) => result0.dataValues);
    res.render("events/creados", {
      pageTitle: "Eventos",
      events: eventos,
    });
  });  
  };

  exports.MyEvents = (req, res, next) => {
    const id  = res.locals.Usuario.id;
    events.findAll({where:{ friendReceptEventId: id }}).then((result0) => {
    const eventos = result0.map((result0) => result0.dataValues);
    res.render("events/myEvents", {
      pageTitle: "Eventos",
      events: eventos,
    });
  });  
  };


  exports.PostGetFriends = (req, res, next) => {
    const username = req.body.search;
    const eventid = req.body.eventoId;
    User.findOne({where: {name: username} }).then((result) => {
        if (result != null) {
            var resulta = result.dataValues;
        }
    const results = resulta != null 
    res.render("events/searchUsers", {
        pageTitle: "friends",
        users: resulta,
        hasUsers: results,
        eventoId: eventid,
      });

    });   
}


exports.SendSolicitud = (req, res, next) => {
    const eventid = req.body.eventoId;
    const userId = req.body.userIdRecept;
    console.log("LO DATO SON",eventid)
    events.update(
        {friendReceptEventId: userId},
        { where: { id: eventid } }
      ).then((result) => {
        return res.redirect("/nigga");
      })
      .catch((err) => {
        console.log(err);
      });
}

  
  exports.SendEvent = (req, res, next) => {
    const event = req.params.EvID;
    res.render("events/searchUsers", {
      pageTitle: "Eventos",
      eventoId: event,
    });

  };

  exports.Events = (req, res, next) => {
    res.render("events/event", {
      pageTitle: "Eventos",
    });
  };

  exports.GetCreateEvents = (req, res, next) => {
    res.render("events/createEvent", {
      pageTitle: "Eventos",
    });
  };
  

  exports.PostCreate = (req, res, next) => {
    const name = req.body.name;
    const date = req.body.date;
    const place = req.body.place;
    const userid = req.body.idUser;
    
    events.create({
       name: name,
       eventDate: date,
       place: place,
       userId: userid,

      }).then((result) => {
        res.redirect("/Eventos");
      })
      
  };
  