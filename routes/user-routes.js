const express = require('express');
const {singup, login, verifyToken, getUser} = require("../controllers/user-controllers")
const router = express.Router();

router.post("/singup",singup)
router.post("/login",login)
router.get("/user",verifyToken,getUser)

module.exports = router;