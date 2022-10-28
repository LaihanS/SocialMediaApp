const express = require("express");

const router = express.Router();

const friendController = require("../controllers/friendController");
const isAuth = require("../middleware/is-auth.js");

router.get("/friends", isAuth, friendController.Friends);
router.get("/findFriend", isAuth, friendController.GetFriends);
router.post("/findFriends", isAuth, friendController.PostGetFriends);
router.post("/solicitud", isAuth, friendController.PostSolicitud);
router.get("/notificaciones", isAuth, friendController.GetNotificaciones);
router.post("/aceptarFriend", isAuth, friendController.ConfirmFriends);
router.post("/eliminarNotifi", isAuth, friendController.EliminarSoli);
router.post("/eliminarAmigo", isAuth, friendController.EliminarAmigo);

module.exports = router;