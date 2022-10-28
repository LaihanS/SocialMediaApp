const express = require("express");

const postController = require("../controllers/postController");

const router = express.Router();

router.get("/nigga", postController.GetPosts);

router.post("/posteo", postController.createPost);

router.get("/edit/:postId", postController.GetEditPost);

router.post("/postedit", postController.PostEditPost);

router.post("/eliminal", postController.deletePost);

router.post("/comentar", postController.createComment);

router.post("/searchfriend", postController.createComment);


module.exports = router;