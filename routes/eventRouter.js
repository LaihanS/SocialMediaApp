const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");
const isAuth = require("../middleware/is-auth.js");

router.get("/creados", isAuth, eventController.GetEvents);

router.get("/CreateEvent", isAuth, eventController.GetCreateEvents);

router.get("/Eventos", isAuth, eventController.Events);

router.post("/postCreate", isAuth, eventController.PostCreate);

router.get("/SendEvent/:EvID", isAuth, eventController.SendEvent);

router.post("/findAmigo", isAuth, eventController.PostGetFriends);

router.post("/solicitudPost", isAuth, eventController.SendSolicitud);

router.get("/Myevents", isAuth, eventController.MyEvents);

module.exports = router;