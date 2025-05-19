const express = require("express");
const userController=require('../controllers/userController')
const messageController=require('../controllers/messageController')
const {protectRoute}=require('../middleware/protectRoute')
const router=express.Router()

router.post('/register',userController.register)
router.post('/login',userController.login)
router.post("/logout", userController.logout);
router.put('/edit-profile',protectRoute,userController.editProfile)
router.get("/check",protectRoute, userController.checkAuth);


router.get("/messages/users",protectRoute,messageController.getUserForSidebar)
router.get("/messages/:id",protectRoute,messageController.getMessages)
router.post("/messages/send/:id",protectRoute,messageController.sendMessage)

module.exports=router;  
  


